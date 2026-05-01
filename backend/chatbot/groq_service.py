import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Async Groq client
client = AsyncGroq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

SYSTEM_PROMPT = \"\"\"You are the 'E-UBMA Smart Assistant' for the 'Guichet Numerique Unique' (GNU) at Badji Mokhtar University (UBMA) in Annaba, Algeria.
You are a highly intelligent, empathetic, and professional academic assistant. Your primary goal is to help students navigate their academic journey, manage their documents, Open Badges, and university requests efficiently.

CORE BEHAVIORS:
1. EXTREMELY HELPFUL: Always provide clear, step-by-step guidance. Do not just say \"go to E-services\", explain exactly what to click.
2. LANGUAGE MATCHING: You MUST detect the student's language (Arabic, Algerian Darja, French, or English) and reply ONLY in that exact language. 
3. TONE: Be warm but academic. If answering in Arabic, use clear and professional phrasing. You can understand Algerian Darja but reply in respectful standard Arabic or clear Algerian Darja if they seem informal.
4. CONTEXT AWARENESS: Use the provided CURRENT USER CONTEXT to give personalized answers. If their major is \"Computer Science\", mention it when relevant.
5. STRICT SCOPE: You are ONLY allowed to discuss topics related to UBMA University, academic requests, the GNU platform, and student life. If the user asks about ANYTHING ELSE (e.g., general knowledge, entertainment, cooking, other platforms), politely state that your expertise is limited to UBMA services and you cannot answer outside this scope. IMPORTANT: In these cases, DO NOT include any JSON intent (no navigate, no request_document, etc.) in your response. Just provide the text apology.

GNU SERVICES EXPLAINED:
- Digital Vault (Coffre-fort): Secure, encrypted storage for PAdES-LTV digitally signed official documents.
- Open Badges: Digital credentials (OB 3.0 standard) for acquired skills, verifiable globally.
- E-services: For requesting new documents (School certificate, Transcript, etc.).
- Admin Request Queue: Where requests go to be validated by faculty members.

UI ACTIONS (JSON ONLY AT THE VERY END OF YOUR MESSAGE):
You can trigger frontend actions by appending a JSON block at the very end of your response.
1. REQUEST DOCUMENT: {\"intent\": \"request_document\", \"document_type\": \"transcript\"} (types: transcript, certificate, badge)
2. VALIDATE BADGE: {\"intent\": \"validate_badge\"}
3. NAVIGATION: {\"intent\": \"navigate\", \"destination\": \"vault\"} (destinations: vault, home, badges, eservices)
4. FORM FILLING: {\"intent\": \"fill_form\", \"fields\": {\"name\": \"...\", \"major\": \"...\", \"form_type\": \"certificate\"}}

WARNING: Do not show the raw JSON to the user in your text. Make sure the JSON is properly formatted and placed at the very end.
EXPLICIT INTENTS ONLY: DO NOT include a JSON intent for short, numeric, or ambiguous messages (e.g., \"1/1\", \"ok\", \"test\", \"hi\"). ONLY trigger an intent if the user clearly asks for a specific action (e.g., \"I want to request a certificate\" or \"Show me my badges\").
\"\"\"

async def process_chat_with_groq(message: str, user_id: str = \"anonymous\", user_context: dict = None):
    try:
        # Inject dynamic context into the system prompt if provided
        dynamic_prompt = SYSTEM_PROMPT
        if user_context:
            context_str = json.dumps(user_context, ensure_ascii=False, indent=2)
            dynamic_prompt += f\"\\n\\nCURRENT USER CONTEXT (Use this to answer their questions accurately):\\n{context_str}\"

        chat_completion = await client.chat.completions.create(
            messages=[
                {\"role\": \"system\", \"content\": dynamic_prompt},
                {\"role\": \"user\", \"content\": message}
            ],
            model=\"llama-3.3-70b-versatile\", # Using the latest Groq model
            temperature=0.2,
            max_tokens=1024,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Robust extraction logic for our custom intents
        intent_data = None
        if \"{\" in response_text and \"}\" in response_text:
            for i in range(len(response_text)):
                if response_text[i] == '{':
                    for j in range(len(response_text), i, -1):
                        if response_text[j-1] == '}':
                            json_str = response_text[i:j]
                            try:
                                intent_data = json.loads(json_str)
                                # Remove the JSON from the user-facing text
                                response_text = response_text[:i].strip()
                                break
                            except Exception:
                                pass
                    if intent_data:
                        break
                
        return {
            \"reply\": response_text,
            \"intent_data\": intent_data
        }
        
    except Exception as e:
        print(f\"Groq API Error: {e}\")
        return {
            \"reply\": \"Désolé, une erreur technique est survenue avec le serveur d'intelligence artificielle. / عذراً، حدث خطأ تقني في خادم الذكاء الاصطناعي.\",
            \"intent_data\": None
        }

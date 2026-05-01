import { FastAPI, HTTPException } from "fastapi"
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="E-UBMA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "online", "service": "E-UBMA Backend"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Dummy logic for now, in a real app we'd call Groq/OpenAI
    msg = request.message.lower()
    if "hello" in msg or "hi" in msg:
        reply = "Hello! I am your UBMA assistant. How can I help you with your studies today?"
    elif "document" in msg or "certificate" in msg:
        reply = "You can request documents like transcripts or school certificates in your Student Space under 'Documents'."
    elif "badge" in msg:
        reply = "Open Badges are digital credentials you earn for your achievements. You can view them in the 'Badges' section."
    else:
        reply = f"I received your message: '{request.message}'. I am here to help you with university services."
    
    return {"reply": reply}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)

from fastapi import FastAPI, HTTPException, UploadResponse, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from typing import List

app = FastAPI()

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
async def root():
    return {"message": "E-UBMA GNU API is running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    msg = request.message.lower()
    if "hello" in msg:
        reply = "Hello! I am your UBMA assistant. How can I help you today?"
    elif "request" in msg or "certificate" in msg:
        reply = "You can request school certificates in the E-services section."
    else:
        reply = f"I received your message: {request.message}. I am here to help you navigate the portal."
    return {"reply": reply}

@app.post("/api/crypto/encrypt")
async def encrypt_file(file: UploadFile = File(...)):
    # Simple pass-through for demo, in production we use AES
    content = await file.read()
    return content

@app.post("/api/crypto/decrypt")
async def decrypt_file(file: UploadFile = File(...)):
    # Simple pass-through for demo
    content = await file.read()
    return content

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)

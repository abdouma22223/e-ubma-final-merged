import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys

# Ensure local imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="E-UBMA University Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login(req: LoginRequest):
    # This is the old simple logic
    if req.email == "admin@ubma.dz" and req.password == "123456":
        return {"user_id": "1", "first_name": "Admin", "role": "admin", "major": "Administration"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/test")
async def test():
    return {"status": "ok", "message": "Original Backend Active"}

import os
from fastapi import FastAPI, HTTPException, Request, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from vault.notifications import NotificationManager
from vault.qr_service import generate_qr_verification_url
from badges.linkedin import generate_linkedin_add_url
from chatbot.groq_service import process_chat_with_groq

# Database & Security
from database import SessionLocal, engine
import models
from vault import crypto, sharing

app = FastAPI(
    title="E-UBMA Portal API",
    description="The Digital Gateway for Badji Mokhtar University - Secure Backend",
    version="2.0.0"
)

# Enable CORS for both local and production (Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",
        "https://e-ubma-final-merged.vercel.app", # رابط مشروعك على فيرسال
        "*" # للسماح بأي رابط في البداية لتسهيل الاختبار
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ph = PasswordHasher(time_cost=2, memory_cost=10240, parallelism=2)
notification_manager = NotificationManager()
UPLOAD_DIR = "backend/uploads"

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return {
        "detail": str(exc),
        "error_type": type(exc).__name__,
        "hint": "Check DATABASE_URL and requirements.txt"
    }

# Dependency
def get_db():
    try:
        db = SessionLocal()
        yield db
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Database Connection Error: {str(e)}"
        )
    finally:
        if 'db' in locals():
            db.close()

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"
    context: dict | None = None

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    major: str

class UserLogin(BaseModel):
    email: str
    password: str

class RequestCreate(BaseModel):
    title: str
    description: str
    request_type: str
    student_id: str

class RequestUpdate(BaseModel):
    status: str | None = None
    assigned_to: str | None = None

class CourseCreate(BaseModel):
    name: str
    code: str
    description: str
    professor_id: str
    credits: int

class GradeCreate(BaseModel):
    value: float
    student_id: str
    course_id: str

class FacultyCreate(BaseModel):
    name: str
    dean: str
    departments_count: int

# --- Endpoints ---

@app.get("/api/test")
def test_api():
    return {"status": "alive", "message": "Backend is reachable!"}

@app.get("/api/db-check")
def db_check():
    try:
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "success", "message": "Database is connected!"}
    except Exception as e:
        return {"status": "error", "message": str(e), "type": type(e).__name__}

@app.post("/api/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = ph.hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        first_name=user.first_name,
        last_name=user.last_name,
        major=user.major
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@app.post("/api/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not db_user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials or unmigrated user")
    try:
        ph.verify(db_user.hashed_password, user.password)
    except VerifyMismatchError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "message": "Login successful", 
        "user_id": db_user.id,
        "first_name": db_user.first_name,
        "role": db_user.role,
        "major": db_user.major
    }

@app.post("/api/documents/upload")
async def upload_document(user_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a file, encrypts it with AES-256 in memory, generates Hash & QR, and saves it."""
    file_data = await file.read()
    
    # Generate Hash for Authenticity
    file_hash = crypto.generate_file_hash(file_data)
    
    # Encrypt file data
    encrypted_data = crypto.encrypt_file(file_data)
    
    import uuid
    new_id = uuid.uuid4()
    
    # Ensure dir exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    # We use new_id instead of file_hash for local storage since file_hash doesn't exist in DB
    file_path = os.path.join(UPLOAD_DIR, f"{new_id}.enc")
    
    # Save encrypted data
    with open(file_path, "wb") as f:
        f.write(encrypted_data)
        
    new_doc = models.Document(
        id=new_id,
        filename=file.filename,
        storage_path=file_path,
        mimetype=file.content_type or "application/octet-stream",
        is_encrypted=True,
        owner_id=user_id,
        status="pending"
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # Get dynamic base URL from request or environment
    base_url = os.environ.get("VERCEL_URL", "localhost:5173")
    if not base_url.startswith("http"):
        base_url = f"https://{base_url}"
    
    qr_url = f"{base_url}/verify/{new_id}"
    
    return {
        "message": "File encrypted and uploaded securely",
        "document_id": new_doc.id,
        "qr_verification_url": qr_url
    }

@app.get("/api/documents/download/{doc_id}")
def download_document(doc_id: str, user_id: str, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not os.path.exists(doc.storage_path):
        raise HTTPException(status_code=404, detail="File missing on server")
        
    with open(doc.storage_path, "rb") as f:
        encrypted_data = f.read()
        
    try:
        decrypted_data = crypto.decrypt_file(encrypted_data)
        from fastapi.responses import Response
        return Response(
            content=decrypted_data,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={doc.filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decryption failed: {str(e)}")

@app.get("/api/documents")
def get_user_documents(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.role in ["admin", "professor"]:
        docs = db.query(models.Document).all()
    else:
        docs = db.query(models.Document).filter(models.Document.owner_id == user_id).all()
        
    return [{"id": str(d.id), "filename": d.filename, "hash": str(d.id), "status": d.status} for d in docs]

class StatusUpdate(BaseModel):
    status: str

@app.post("/api/documents/{doc_id}/status")
def update_document_status(doc_id: str, payload: StatusUpdate, user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.role not in ["admin", "professor"]:
        raise HTTPException(status_code=403, detail="Not authorized to validate documents")
        
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc.status = payload.status
    db.commit()
    return {"message": f"Document status updated to {payload.status}"}

@app.get("/api/documents/share/{doc_id}")
def generate_share_link(doc_id: str, expires_in: int = 24, db: Session = Depends(get_db)):
    """Generate a temporary JWT link to share the document."""
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    token = sharing.create_temporary_link(doc_id, expires_delta_hours=expires_in)
    # Return a frontend URL (same as base URL but without /api)
    base_url = os.environ.get("VERCEL_URL", "localhost:5173")
    if not base_url.startswith("http"):
        base_url = f"https://{base_url}"
    
    return {"temporary_link": f"{base_url}/shared?token={token}"}

@app.post("/api/crypto/encrypt")
async def encrypt_file_endpoint(file: UploadFile = File(...)):
    """Stateless encryption for frontend to call before uploading to Supabase."""
    file_data = await file.read()
    try:
        encrypted_data = crypto.encrypt_file(file_data)
        from fastapi.responses import Response
        return Response(content=encrypted_data, media_type="application/octet-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/crypto/decrypt")
async def decrypt_file_endpoint(file: UploadFile = File(...)):
    """Stateless decryption for frontend to call after downloading from Supabase."""
    encrypted_data = await file.read()
    try:
        decrypted_data = crypto.decrypt_file(encrypted_data)
        from fastapi.responses import Response
        return Response(content=decrypted_data, media_type="application/octet-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/verify/{doc_id}")
def verify_document_authenticity(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        return {"status": "Fake", "message": "This document does NOT exist in the university vault."}
    
    owner = db.query(models.User).filter(models.User.id == doc.owner_id).first()
    return {
        "status": "Authentic",
        "message": "This is a verified E-UBMA document.",
        "filename": doc.filename,
        "owner": f"{owner.first_name} {owner.last_name}",
        "major": owner.major
    }

@app.post("/api/chat")
async def chat_with_assistant(req: ChatRequest):
    """Main Chatbot Endpoint using Groq API"""
    result = await process_chat_with_groq(req.message, req.user_id, req.context)
    intent_data = result.get("intent_data")
    
    if intent_data:
        intent = intent_data.get("intent")
        ui_language = req.context.get("ui_language", "fr") if req.context else "fr"
            
        if intent == "request_document":
            pass # Silent execution
        elif intent == "fill_form":
            pass # Silent execution
        elif intent == "validate_badge":
            pass # Silent execution
            
    return {
        "reply": result["reply"],
        "intent_detected": intent_data
    }

# --- Requests Endpoints ---

@app.get("/api/requests")
def get_requests(user_id: str | None = None, role: str = "student", db: Session = Depends(get_db)):
    if role == "admin":
        return db.query(models.Request).all()
    if role == "professor":
        return db.query(models.Request).filter(models.Request.assigned_to == user_id).all()
    return db.query(models.Request).filter(models.Request.student_id == user_id).all()

@app.post("/api/requests")
def create_request(req: RequestCreate, db: Session = Depends(get_db)):
    new_req = models.Request(
        title=req.title,
        description=req.description,
        request_type=req.request_type,
        student_id=req.student_id,
        status="pending"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@app.patch("/api/requests/{req_id}")
def update_request(req_id: str, update: RequestUpdate, db: Session = Depends(get_db)):
    req = db.query(models.Request).filter(models.Request.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if update.status:
        req.status = update.status
    if update.assigned_to:
        req.assigned_to = update.assigned_to
    db.commit()
    return req

# --- Courses & Grades Endpoints ---

@app.get("/api/courses")
def get_courses(professor_id: str | None = None, db: Session = Depends(get_db)):
    if professor_id:
        return db.query(models.Course).filter(models.Course.professor_id == professor_id).all()
    return db.query(models.Course).all()

@app.post("/api/courses")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@app.get("/api/grades")
def get_grades(student_id: str | None = None, db: Session = Depends(get_db)):
    if student_id:
        return db.query(models.Grade).filter(models.Grade.student_id == student_id).all()
    return db.query(models.Grade).all()

@app.post("/api/grades")
def create_grade(grade: GradeCreate, db: Session = Depends(get_db)):
    new_grade = models.Grade(**grade.dict())
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return new_grade

@app.get("/api/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/api/admin/faculties")
def get_faculties(db: Session = Depends(get_db)):
    return db.query(models.Faculty).all()

@app.post("/api/admin/faculties")
def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    new_faculty = models.Faculty(**faculty.dict())
    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)
    return new_faculty

@app.get("/api/admin/activity-logs")
def get_activity_logs(db: Session = Depends(get_db)):
    return db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(50).all()

if __name__ == "__main__":
    import uvicorn
    # Render sets the PORT environment variable automatically
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

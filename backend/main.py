import os
import sys
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

load_dotenv()

# Add current directory and its parent to path to fix Render deployment issues
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

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

# Supabase Client
from supabase import create_client, Client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Create tables
models.Base.metadata.create_all(bind=engine)

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
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    from fastapi.responses import JSONResponse
    from fastapi import HTTPException
    import traceback
    
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
        
    print(f"CRITICAL ERROR: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "error_type": type(exc).__name__
        }
    )

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

class BadgeCreate(BaseModel):
    title: str
    description: str
    icon: str
    student_id: str
    professor_id: str

# --- Health & Status Endpoints ---

@app.get("/")
def read_root():
    return {
        "message": "Welcome to E-UBMA Portal API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc),
        "version": "2.0.1"
    }

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
    
    # Robust UUID conversion for user_id
    try:
        user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) and len(user_id) > 20 else user_id
    except ValueError:
        user_uuid = user_id # Fallback for non-uuid IDs (e.g. seeds)

    # Determine bucket based on user role
    user = db.query(models.User).filter(models.User.id == user_uuid).first()
    bucket = "documents" # default
    if user and user.role in ["professor", "admin"]:
        bucket = "prof"
        
    # Upload to Supabase if configured (and not using placeholder key)
    storage_path = ""
    is_placeholder_key = SUPABASE_KEY == "YOUR_SUPABASE_SERVICE_ROLE_OR_ANON_KEY"
    if supabase and not is_placeholder_key:
        try:
            supabase_path = f"{user_id}/{new_id}.enc"
            supabase.storage.from_(bucket).upload(
                path=supabase_path,
                file=encrypted_data,
                file_options={"content-type": "application/octet-stream"}
            )
            storage_path = f"supabase://{bucket}/{supabase_path}"
        except Exception as e:
            print(f"Supabase Upload Error: {str(e)}")
            # Fallback to local
            os.makedirs(UPLOAD_DIR, exist_ok=True)
            storage_path = os.path.join(UPLOAD_DIR, f"{new_id}.enc")
            with open(storage_path, "wb") as f:
                f.write(encrypted_data)
    else:
        # Local fallback (if supabase not ready or key is placeholder)
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        storage_path = os.path.join(UPLOAD_DIR, f"{new_id}.enc")
        with open(storage_path, "wb") as f:
            f.write(encrypted_data)
        
    new_doc = models.Document(
        id=new_id,
        filename=file.filename,
        storage_path=storage_path,
        mimetype=file.content_type or "application/octet-stream",
        is_encrypted=True,
        owner_id=user_uuid,
        status="validated" if user and user.role in ["professor", "admin"] else "pending"
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
    
    # Handle Supabase vs Local
    encrypted_data = None
    if doc.storage_path.startswith("supabase://"):
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        parts = doc.storage_path.replace("supabase://", "").split("/", 1)
        bucket = parts[0]
        path = parts[1]
        try:
            encrypted_data = supabase.storage.from_(bucket).download(path)
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"File not found in Supabase: {str(e)}")
    else:
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
        
    return [{"id": str(d.id), "filename": d.filename, "hash": str(d.id), "status": d.status, "owner_id": str(d.owner_id)} for d in docs]

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


class ShareLinkCreate(BaseModel):
    file_id: str
    duration_hours: int | None = None
    custom_expiry: str | None = None
    usage_type: str # 'one-time' or 'unlimited'

@app.post("/api/documents/share")
def create_share_link(data: ShareLinkCreate, db: Session = Depends(get_db)):
    import uuid
    try:
        file_uuid = uuid.UUID(data.file_id)
        doc = db.query(models.Document).filter(models.Document.id == file_uuid).first()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid file ID format")
        
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {data.file_id} not found")
    
    import secrets
    token = secrets.token_urlsafe(16)
    
    if data.custom_expiry:
        try:
            expires_at = datetime.fromisoformat(data.custom_expiry.replace('Z', '+00:00'))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    else:
        expires_at = datetime.now(timezone.utc) + timedelta(hours=data.duration_hours or 24)
    
    new_link = models.SharedLink(
        token=token,
        file_id=doc.id,
        expires_at=expires_at,
        usage_type=data.usage_type,
        is_active=True
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    return {
        "token": token,
        "expires_at": expires_at.isoformat(),
        "usage_type": data.usage_type
    }

@app.get("/s/{token}")
def access_shared_file(token: str, request: Request, db: Session = Depends(get_db)):
    try:
        print(f"DEBUG: Accessing shared link with token: '{token}'")
        link = db.query(models.SharedLink).filter(models.SharedLink.token == token).first()
        
        # 1. Check existence and basic activity
        if not link:
            print(f"WARNING: Token '{token}' not found.")
            raise HTTPException(status_code=404, detail="LINK_NOT_FOUND")
        
        if not link.is_active:
            print(f"WARNING: Token '{token}' is revoked.")
            raise HTTPException(status_code=403, detail="REVOKED_BY_OWNER")
            
        # 2. Check Expiry
        now = datetime.now(timezone.utc)
        link_expiry = link.expires_at
        if link_expiry.tzinfo is None:
            link_expiry = link_expiry.replace(tzinfo=timezone.utc)
            
        if link_expiry < now:
            print(f"WARNING: Token '{token}' has expired.")
            raise HTTPException(status_code=403, detail="EXPIRED")
            
        # 3. Check Usage Type
        if link.usage_type == "one-time" and link.opened_count >= 1:
            print(f"WARNING: Token '{token}' reached max usage.")
            raise HTTPException(status_code=403, detail="MAX_OPENS_REACHED")
            
        # 4. Log Access
        log = models.LinkAccessLog(
            link_id=link.id,
            ip=request.client.host,
            user_agent=request.headers.get("user-agent")
        )
        db.add(log)
        
        # 5. Increment opened count
        link.opened_count += 1
        db.commit()
        
        # 6. Return file
        doc = db.query(models.Document).filter(models.Document.id == link.file_id).first()
        if not doc:
            print(f"ERROR: Document {link.file_id} not found in database.")
            raise HTTPException(status_code=404, detail="DOCUMENT_NOT_FOUND")
            
        storage_path = doc.storage_path
        # Fix for paths stored with 'backend/' prefix when running from the backend directory
        if not os.path.exists(storage_path) and storage_path.startswith("backend/"):
            alt_path = storage_path.replace("backend/", "", 1)
            if os.path.exists(alt_path):
                storage_path = alt_path
                
        if not os.path.exists(storage_path):
            print(f"ERROR: File for document {link.file_id} missing at {storage_path}")
            raise HTTPException(status_code=404, detail="FILE_MISSING")
            
        with open(storage_path, "rb") as f:
            encrypted_data = f.read()
            
        try:
            decrypted_data = crypto.decrypt_file(encrypted_data)
            from fastapi.responses import Response
            return Response(
                content=decrypted_data,
                media_type=doc.mimetype or "application/pdf",
                headers={"Content-Disposition": f"attachment; filename={doc.filename}"}
            )
        except Exception as e:
            print(f"ERROR during decryption: {str(e)}")
            raise HTTPException(status_code=500, detail="DECRYPTION_FAILED")
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"CRITICAL ERROR in access_shared_file: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/share/{token}")
def revoke_share_link(token: str, db: Session = Depends(get_db)):
    link = db.query(models.SharedLink).filter(models.SharedLink.token == token).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    link.is_active = False
    db.commit()
    return {"message": "Link revoked successfully"}

@app.get("/api/documents/share/status/{token}")
def get_share_link_status(token: str, db: Session = Depends(get_db)):
    link = db.query(models.SharedLink).filter(models.SharedLink.token == token).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    return {
        "token": link.token,
        "expires_at": link.expires_at,
        "usage_type": link.usage_type,
        "opened_count": link.opened_count,
        "is_active": link.is_active
    }

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

@app.post("/api/badges")
def create_badge(badge: BadgeCreate, db: Session = Depends(get_db)):
    prof = db.query(models.User).filter(models.User.id == badge.professor_id).first()
    if not prof or prof.role != "professor":
        raise HTTPException(status_code=403, detail="Only professors can issue badges")
        
    new_badge = models.Badge(
        title=badge.title,
        description=badge.description,
        icon=badge.icon,
        student_id=badge.student_id,
        professor_id=badge.professor_id
    )
    db.add(new_badge)
    db.commit()
    db.refresh(new_badge)
    return new_badge

@app.get("/api/badges")
def get_badges(student_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Badge)
    if student_id:
        query = query.filter(models.Badge.student_id == student_id)
    
    results = query.all()
    return [
        {
            "id": str(b.id),
            "title": b.title,
            "description": b.description,
            "icon": b.icon,
            "created_at": b.created_at,
            "professor": f"Prof. {b.professor.first_name} {b.professor.last_name}" if b.professor else "University Administration"
        } for b in results
    ]

@app.get("/api/admin/users")
def get_all_users(role: str = "admin", db: Session = Depends(get_db)):
    if role not in ["admin", "professor"]:
        raise HTTPException(status_code=403, detail="Not authorized")
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
    uvicorn.run(app, host="0.0.0.0", port=8000)

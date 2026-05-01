from sqlalchemy import Column, Integer, String, ForeignKey, Uuid, DateTime, Boolean, Text, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    major = Column(String)
    role = Column(String, default="student") # student, professor, admin

    documents = relationship("Document", back_populates="owner")
    requests = relationship("Request", foreign_keys="[Request.student_id]", back_populates="student")
    assigned_tasks = relationship("Request", foreign_keys="[Request.assigned_to]", back_populates="assignee")
    grades = relationship("Grade", back_populates="student")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    filename = Column(Text, index=True)
    storage_path = Column(Text)
    mimetype = Column(Text)
    is_encrypted = Column(Boolean, default=True)
    owner_id = Column(Uuid, ForeignKey("users.id"))
    status = Column(Text, default="pending")
    validated_by = Column(Uuid, nullable=True)

    owner = relationship("User", back_populates="documents")

class Request(Base):
    __tablename__ = "requests"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    title = Column(String)
    description = Column(Text)
    status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    student_id = Column(Uuid, ForeignKey("users.id"))
    assigned_to = Column(Uuid, ForeignKey("users.id"), nullable=True)
    request_type = Column(String) # academic, administrative, technical

    student = relationship("User", foreign_keys=[student_id], back_populates="requests")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_tasks")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String)
    code = Column(String, unique=True)
    description = Column(Text)
    professor_id = Column(Uuid, ForeignKey("users.id"))
    credits = Column(Integer)

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    value = Column(Float)
    student_id = Column(Uuid, ForeignKey("users.id"))
    course_id = Column(Uuid, ForeignKey("courses.id"))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    student = relationship("User", back_populates="grades")

class Faculty(Base):
    __tablename__ = "faculties"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, unique=True)
    dean = Column(String)
    departments_count = Column(Integer, default=0)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"))
    action = Column(String)
    details = Column(Text)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

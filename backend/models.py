import os
from sqlalchemy import create_all
from .database import engine
from . import models

# Create tables on startup
models.Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from supabase import create_client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (kept for other potential uses)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Supabase connection
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_ANON_KEY']
supabase = create_client(supabase_url, supabase_key)

app = FastAPI()
api_router = APIRouter(prefix="/api")


class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = ""
    email: str
    created_at: str = ""


class WaitlistCreate(BaseModel):
    email: str


class WaitlistCountResponse(BaseModel):
    count: int


@api_router.get("/")
async def root():
    return {"message": "Citius API"}


@api_router.post("/waitlist", response_model=WaitlistEntry)
async def join_waitlist(input: WaitlistCreate):
    email = input.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address")

    # Check for duplicate in Supabase
    existing = supabase.table("waitlist").select("id").eq("email", email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=409, detail="Email already registered")

    # Insert into Supabase
    result = supabase.table("waitlist").insert({"email": email}).execute()

    if result.data and len(result.data) > 0:
        row = result.data[0]
        return WaitlistEntry(
            id=str(row.get("id", "")),
            email=row.get("email", email),
            created_at=str(row.get("created_at", ""))
        )

    raise HTTPException(status_code=500, detail="Failed to insert")


@api_router.get("/waitlist/count", response_model=WaitlistCountResponse)
async def get_waitlist_count():
    result = supabase.table("waitlist").select("id", count="exact").execute()
    return WaitlistCountResponse(count=result.count or 0)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

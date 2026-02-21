from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# ─── Auth ────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    accessory_level: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Mood ─────────────────────────────────────────────────────────────
class MoodCreate(BaseModel):
    mood_score: int  # 1-5
    mood_label: str


class MoodOut(BaseModel):
    id: int
    mood_score: int
    mood_label: str
    timestamp: datetime

    class Config:
        from_attributes = True


# ─── Gratitude ────────────────────────────────────────────────────────
class GratitudeCreate(BaseModel):
    content: str


class GratitudeOut(BaseModel):
    id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class StreakOut(BaseModel):
    streak_days: int
    accessory_level: int
    total_notes: int

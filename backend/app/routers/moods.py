from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import MoodEntry, User
from app.schemas import MoodCreate, MoodOut
from app.auth import get_current_user

router = APIRouter(prefix="/moods", tags=["moods"])


@router.post("/", response_model=MoodOut)
def log_mood(mood_in: MoodCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = MoodEntry(
        user_id=current_user.id,
        mood_score=mood_in.mood_score,
        mood_label=mood_in.mood_label,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/", response_model=List[MoodOut])
def get_moods(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(MoodEntry)
        .filter(MoodEntry.user_id == current_user.id)
        .order_by(MoodEntry.timestamp.desc())
        .limit(30)
        .all()
    )

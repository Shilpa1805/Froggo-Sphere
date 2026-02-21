from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models import GratitudeNote, User
from app.schemas import GratitudeCreate, GratitudeOut, StreakOut
from app.auth import get_current_user

router = APIRouter(prefix="/gratitude", tags=["gratitude"])


@router.post("/", response_model=GratitudeOut)
def add_note(note_in: GratitudeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = GratitudeNote(user_id=current_user.id, content=note_in.content)
    db.add(note)

    # Recalculate streak and accessory level
    streak = _calc_streak(current_user.id, db)
    current_user.accessory_level = streak // 3
    db.commit()
    db.refresh(note)
    return note


@router.get("/", response_model=List[GratitudeOut])
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(GratitudeNote)
        .filter(GratitudeNote.user_id == current_user.id)
        .order_by(GratitudeNote.created_at.desc())
        .all()
    )


@router.get("/streak", response_model=StreakOut)
def get_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    streak = _calc_streak(current_user.id, db)
    total = db.query(GratitudeNote).filter(GratitudeNote.user_id == current_user.id).count()
    return StreakOut(
        streak_days=streak,
        accessory_level=streak // 3,
        total_notes=total,
    )


def _calc_streak(user_id: int, db: Session) -> int:
    """Count consecutive days with at least one gratitude note."""
    notes = (
        db.query(GratitudeNote)
        .filter(GratitudeNote.user_id == user_id)
        .order_by(GratitudeNote.created_at.desc())
        .all()
    )
    if not notes:
        return 0

    unique_days = sorted(
        set(n.created_at.date() for n in notes), reverse=True
    )

    streak = 0
    expected = datetime.utcnow().date()
    for day in unique_days:
        if day == expected or day == expected - timedelta(days=0):
            if streak == 0 or day == expected:
                streak += 1
                expected = day - timedelta(days=1)
            else:
                break
        else:
            break
    return streak

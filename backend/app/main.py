from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import users, moods, gratitude

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Froggo-Sphere API",
    description="🐸 Leap of Faith — backend for mood & gratitude tracking",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(moods.router)
app.include_router(gratitude.router)


@app.get("/")
def root():
    return {"message": "🐸 Froggo-Sphere API is live! Hop on in."}

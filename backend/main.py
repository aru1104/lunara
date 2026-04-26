import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models, database, ml_engine, chatbot

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Lunara API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CycleCreate(BaseModel):
    start_date: str
    end_date:   str
    flow:       str
    mood:       str
    symptoms:   str
    notes:      Optional[str] = ""

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "Lunara API is running"}

@app.get("/cycles")
def get_cycles(db: Session = Depends(database.get_db)):
    cycles = db.query(models.Cycle).filter(
        models.Cycle.user_id == 1
    ).order_by(models.Cycle.start_date).all()
    return [
        {
            "id":         c.id,
            "start_date": c.start_date,
            "end_date":   c.end_date,
            "flow":       c.flow,
            "mood":       c.mood,
            "symptoms":   c.symptoms,
            "notes":      c.notes
        }
        for c in cycles
    ]

@app.post("/cycles")
def create_cycle(cycle: CycleCreate, db: Session = Depends(database.get_db)):
    db_cycle = models.Cycle(**cycle.dict(), user_id=1)
    db.add(db_cycle)
    db.commit()
    db.refresh(db_cycle)
    return {"id": db_cycle.id, "message": "Cycle saved successfully"}

@app.delete("/cycles/{cycle_id}")
def delete_cycle(cycle_id: int, db: Session = Depends(database.get_db)):
    cycle = db.query(models.Cycle).filter(models.Cycle.id == cycle_id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    db.delete(cycle)
    db.commit()
    return {"ok": True}

@app.get("/analysis")
def get_analysis(db: Session = Depends(database.get_db)):
    cycles = db.query(models.Cycle).filter(
        models.Cycle.user_id == 1
    ).all()
    cycle_list = [{"start_date": c.start_date} for c in cycles]
    result = ml_engine.analyze_cycles(cycle_list)
    result["total_cycles"] = len(cycles)
    return result

@app.post("/chat")
def chat_endpoint(req: ChatRequest, db: Session = Depends(database.get_db)):
    cycles     = db.query(models.Cycle).filter(models.Cycle.user_id == 1).all()
    cycle_list = [{"start_date": c.start_date} for c in cycles]
    context    = ml_engine.analyze_cycles(cycle_list)
    context["total_cycles"] = len(cycles)
    reply = chatbot.chat(req.message, context)
    return {"reply": reply}

# GET so you can open directly in browser
@app.get("/seed-demo")
def seed_demo(db: Session = Depends(database.get_db)):
    existing = db.query(models.Cycle).count()
    if existing > 0:
        return {"message": f"Already has {existing} cycles — skipping seed"}
    demo = [
        {"start_date":"2024-07-03","end_date":"2024-07-07","flow":"heavy","mood":"bad","symptoms":"cramps,bloating"},
        {"start_date":"2024-08-10","end_date":"2024-08-14","flow":"medium","mood":"okay","symptoms":"cramps"},
        {"start_date":"2024-09-18","end_date":"2024-09-22","flow":"heavy","mood":"bad","symptoms":"cramps,fatigue"},
        {"start_date":"2024-11-05","end_date":"2024-11-09","flow":"light","mood":"good","symptoms":"bloating"},
        {"start_date":"2024-12-20","end_date":"2024-12-24","flow":"heavy","mood":"bad","symptoms":"cramps,mood swings"},
        {"start_date":"2025-02-10","end_date":"2025-02-14","flow":"medium","mood":"okay","symptoms":"fatigue"},
        {"start_date":"2025-03-28","end_date":"2025-04-01","flow":"heavy","mood":"bad","symptoms":"cramps,bloating"},
    ]
    for c in demo:
        db.add(models.Cycle(**c, user_id=1))
    db.commit()
    return {"seeded": len(demo), "message": "Demo data loaded successfully"}

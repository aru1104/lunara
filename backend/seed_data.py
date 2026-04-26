from database import SessionLocal
from models import Cycle

demo_cycles = [
    {"start_date": "2024-07-03", "end_date": "2024-07-07", "flow": "heavy",   "mood": "bad",  "symptoms": "cramps,bloating"},
    {"start_date": "2024-08-10", "end_date": "2024-08-14", "flow": "medium",  "mood": "okay", "symptoms": "cramps"},
    {"start_date": "2024-09-18", "end_date": "2024-09-22", "flow": "heavy",   "mood": "bad",  "symptoms": "cramps,fatigue,bloating"},
    {"start_date": "2024-11-05", "end_date": "2024-11-09", "flow": "light",   "mood": "good", "symptoms": "bloating"},
    {"start_date": "2024-12-20", "end_date": "2024-12-24", "flow": "heavy",   "mood": "bad",  "symptoms": "cramps,mood swings"},
    {"start_date": "2025-02-10", "end_date": "2025-02-14", "flow": "medium",  "mood": "okay", "symptoms": "fatigue"},
    {"start_date": "2025-03-28", "end_date": "2025-04-01", "flow": "heavy",   "mood": "bad",  "symptoms": "cramps,bloating,fatigue"},
]

db = SessionLocal()
for c in demo_cycles:
    db.add(Cycle(**c, user_id=1))
db.commit()
db.close()
print("Seeded 7 demo cycles with irregular pattern for PCOD detection.")
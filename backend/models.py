from sqlalchemy import Column, Integer, String, Date, Text
from database import Base

class Cycle(Base):
    __tablename__ = "cycles"
    id        = Column(Integer, primary_key=True, index=True)
    user_id   = Column(Integer, default=1)
    start_date = Column(String)
    end_date   = Column(String)
    flow       = Column(String)       # light / medium / heavy
    mood       = Column(String)       # good / okay / bad
    symptoms   = Column(Text)         # comma-separated: cramps, bloating, etc.
    notes      = Column(Text, nullable=True)
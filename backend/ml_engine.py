import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def analyze_cycles(cycles: list) -> dict:
    # -----------------------------
    # 1. Handle insufficient data
    # -----------------------------
    if not cycles or len(cycles) < 2:
        return {
            "risk_score": 0,
            "risk_level": "Insufficient data",
            "predicted_next": None,
            "warnings": ["Log at least 2 cycles for analysis"],
            "cycle_lengths": [],
            "avg_length": None
        }

    # -----------------------------
    # 2. Extract and clean dates
    # -----------------------------
    try:
        dates = sorted([
            pd.to_datetime(c["start_date"])
            for c in cycles
            if c.get("start_date")
        ])
    except Exception:
        return {
            "risk_score": 0,
            "risk_level": "Error parsing dates",
            "predicted_next": None,
            "warnings": ["Invalid date format in cycles"],
            "cycle_lengths": [],
            "avg_length": None
        }

    # -----------------------------
    # 3. Calculate cycle lengths
    # -----------------------------
    lengths = []
    for i in range(1, len(dates)):
        delta = (dates[i] - dates[i - 1]).days
        if delta > 0:
            lengths.append(delta)

    if len(lengths) == 0:
        return {
            "risk_score": 0,
            "risk_level": "Need more data",
            "predicted_next": None,
            "warnings": ["Not enough valid cycle gaps"],
            "cycle_lengths": [],
            "avg_length": None
        }

    # -----------------------------
    # 4. Safe stats calculation
    # -----------------------------
    avg = float(np.mean(lengths)) if lengths else 28
    std = float(np.std(lengths)) if lengths else 0

    if np.isnan(avg) or avg <= 0:
        avg = 28  # safe default

    score = 0
    warnings = []

    # -----------------------------
    # 5. Risk signals
    # -----------------------------
    if std > 8:
        score += 30
        warnings.append(f"High cycle variance detected (std: {std:.1f} days)")

    abnormal = [l for l in lengths if l < 21 or l > 35]
    if abnormal:
        score += min(40, len(abnormal) * 10)
        warnings.append(f"{len(abnormal)} cycle(s) outside 21–35 day range")

    skipped = [l for l in lengths if l > 45]
    if skipped:
        score += min(30, len(skipped) * 15)
        warnings.append(f"{len(skipped)} possible skipped cycle(s) detected")

    # -----------------------------
    # 6. ML anomaly detection
    # -----------------------------
    if len(lengths) >= 4:
        try:
            iso = IsolationForest(contamination=0.2, random_state=42)
            preds = iso.fit_predict(np.array(lengths).reshape(-1, 1))
            anomalies = np.sum(preds == -1)

            if anomalies > 0:
                score = min(100, score + anomalies * 5)
                warnings.append(f"ML anomaly detector flagged {anomalies} unusual pattern(s)")
        except Exception:
            pass  # never crash ML layer

    # -----------------------------
    # 7. Final scoring
    # -----------------------------
    score = max(0, min(100, int(score)))

    # -----------------------------
    # 8. Safe prediction
    # -----------------------------
    last_date = dates[-1]
    predicted_next = (last_date + pd.Timedelta(days=int(avg))).strftime("%Y-%m-%d")

    risk_level = "Low" if score < 30 else ("Medium" if score < 60 else "High")

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "predicted_next": predicted_next,
        "warnings": warnings,
        "cycle_lengths": lengths,
        "avg_length": round(avg, 1)
    }
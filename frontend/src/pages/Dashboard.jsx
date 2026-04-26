import { useEffect, useState } from "react";
import { getCycles, getAnalysis } from "../api";
import CycleChart from "../components/CycleChart";
import RiskScore from "../components/RiskScore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [cycles, setCycles]     = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    getCycles().then(setCycles);
    getAnalysis().then(setAnalysis);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-purple-100">Your health dashboard</h1>
        <p className="text-purple-300/60 mt-1">Know your cycle. Know yourself.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {[
          { label: "Cycles logged",    value: cycles.length },
          { label: "Avg cycle length", value: analysis?.avg_length ? `${analysis.avg_length}d` : "—" },
          { label: "Next period",      value: analysis?.predicted_next?.slice(5) || "—" },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-purple-800/40 rounded-xl p-4">
            <p className="text-xs text-purple-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-semibold text-purple-100 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {analysis && (
        <RiskScore
          score={analysis.risk_score}
          level={analysis.risk_level}
          warnings={analysis.warnings}
          predicted={analysis.predicted_next}
          avg={analysis.avg_length}
        />
      )}

      <CycleChart cycles={cycles} />

      <Link to="/log"
        className="block w-full text-center bg-purple-700 hover:bg-purple-600 transition text-white py-3 rounded-xl font-medium">
        + Log a new cycle
      </Link>
    </div>
  );
}
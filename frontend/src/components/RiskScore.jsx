export default function RiskScore({ score, level, warnings, predicted, avg }) {
  const color = level === "High" ? "text-red-400 border-red-500/40"
              : level === "Medium" ? "text-amber-400 border-amber-500/40"
              : "text-teal-400 border-teal-500/40";

  return (
    <div className="bg-white/5 border border-purple-800/40 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm text-purple-300 font-medium uppercase tracking-widest">
        PCOD risk score
      </h2>
      <div className={`text-6xl font-bold ${color}`}>{score}<span className="text-2xl text-purple-400">/100</span></div>
      <div className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${color}`}>
        {level} risk
      </div>
      {predicted && (
        <p className="text-sm text-purple-200/70">
          Next cycle predicted: <span className="text-teal-400 font-medium">{predicted}</span>
        </p>
      )}
      {avg && (
        <p className="text-sm text-purple-200/70">
          Average cycle: <span className="text-purple-200 font-medium">{avg} days</span>
        </p>
      )}
      {warnings.length > 0 && (
        <ul className="space-y-1 pt-2 border-t border-purple-800/30">
          {warnings.map((w, i) => (
            <li key={i} className="text-xs text-amber-400/80 flex gap-2">
              <span>⚠</span>{w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
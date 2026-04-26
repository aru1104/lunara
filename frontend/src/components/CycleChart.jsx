import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function CycleChart({ cycles }) {
  if (cycles.length < 2) return (
    <div className="bg-white/5 border border-purple-800/40 rounded-2xl p-6 flex items-center justify-center h-48 text-purple-400/50 text-sm">
      Log at least 2 cycles to see your chart
    </div>
  );

  const data = [];
  const sorted = [...cycles].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  for (let i = 1; i < sorted.length; i++) {
    const days = Math.round(
      (new Date(sorted[i].start_date) - new Date(sorted[i-1].start_date)) / 86400000
    );
    data.push({ name: sorted[i].start_date.slice(5), days });
  }

  return (
    <div className="bg-white/5 border border-purple-800/40 rounded-2xl p-6">
      <h2 className="text-sm text-purple-300 font-medium uppercase tracking-widest mb-4">
        Cycle length history
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#9f7aea" tick={{fontSize: 11}} />
          <YAxis stroke="#9f7aea" tick={{fontSize: 11}} domain={[0, 50]} />
          <Tooltip
            contentStyle={{background:"#1a1030", border:"1px solid #6c4fd4", borderRadius:8}}
            labelStyle={{color:"#c4b5fd"}}
            itemStyle={{color:"#2dd4bf"}}
          />
          <Bar dataKey="days" radius={[4,4,0,0]}>
            {data.map((entry, i) => (
              <Cell key={i}
                fill={entry.days < 21 || entry.days > 35 ? "#f87171" : "#1D9E75"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-purple-400/50 mt-2">Red bars = outside normal 21–35 day range</p>
    </div>
  );
}
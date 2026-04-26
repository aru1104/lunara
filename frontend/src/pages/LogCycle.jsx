import { useState } from "react";
import { addCycle } from "../api";
import { useNavigate } from "react-router-dom";

const symptoms = ["Cramps", "Bloating", "Fatigue", "Mood swings", "Headache", "Acne"];

export default function LogCycle() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    start_date: "", end_date: "", flow: "medium", mood: "okay",
    symptoms: [], notes: ""
  });

  const toggle = (s) => setForm(f => ({
    ...f,
    symptoms: f.symptoms.includes(s) ? f.symptoms.filter(x => x !== s) : [...f.symptoms, s]
  }));

  const submit = async () => {
    await addCycle({ ...form, symptoms: form.symptoms.join(",") });
    nav("/");
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-purple-100">Log your cycle</h1>

      <div className="space-y-4">
        {[["Start date", "start_date"], ["End date", "end_date"]].map(([label, key]) => (
          <div key={key}>
            <label className="text-sm text-purple-300">{label}</label>
            <input type="date" value={form[key]}
              onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
              className="w-full mt-1 bg-white/5 border border-purple-800/40 rounded-xl px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        ))}

        <div>
          <label className="text-sm text-purple-300">Flow intensity</label>
          <div className="flex gap-3 mt-2">
            {["light", "medium", "heavy"].map(f => (
              <button key={f} onClick={() => setForm(x => ({...x, flow: f}))}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  form.flow === f
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "border-purple-800/40 text-purple-300 hover:border-purple-500"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-purple-300">Mood</label>
          <div className="flex gap-3 mt-2">
            {["good", "okay", "bad"].map(m => (
              <button key={m} onClick={() => setForm(x => ({...x, mood: m}))}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  form.mood === m
                    ? "bg-teal-700 border-teal-500 text-white"
                    : "border-purple-800/40 text-purple-300 hover:border-teal-600"
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-purple-300">Symptoms</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {symptoms.map(s => (
              <button key={s} onClick={() => toggle(s)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  form.symptoms.includes(s)
                    ? "bg-pink-800/40 border-pink-500/60 text-pink-200"
                    : "border-purple-800/40 text-purple-400 hover:border-pink-600"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-purple-300">Notes (optional)</label>
          <textarea value={form.notes}
            onChange={e => setForm(f => ({...f, notes: e.target.value}))}
            className="w-full mt-1 bg-white/5 border border-purple-800/40 rounded-xl px-4 py-2 text-purple-100 focus:outline-none focus:border-purple-500 h-20 resize-none"
          />
        </div>

        <button onClick={submit}
          className="w-full bg-purple-700 hover:bg-purple-600 transition text-white py-3 rounded-xl font-medium">
          Save cycle
        </button>
      </div>
    </div>
  );
}
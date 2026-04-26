const BASE = "http://localhost:8000";

export const getCycles   = () => fetch(`${BASE}/cycles`).then(r => r.json());
export const getAnalysis = () => fetch(`${BASE}/analysis`).then(r => r.json());
export const addCycle    = (data) => fetch(`${BASE}/cycles`, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(data)
}).then(r => r.json());
export const deleteCycle = (id) => 
  fetch(`${BASE}/cycles/${id}`, {method: "DELETE"});
export const sendChat    = (message) => fetch(`${BASE}/chat`, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({message})
}).then(r => r.json());

const BASE_URL = import.meta.env.VITE_API_URL;

export const chat = async (message) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  return res.json();
};
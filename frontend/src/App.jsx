import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LogCycle from "./pages/LogCycle";
import ChatPage from "./pages/ChatPage";
import Report from "./pages/Report";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F0A1E] text-white">
        <Navbar />
        <Routes>
          <Route path="/"       element={<Dashboard />} />
          <Route path="/log"    element={<LogCycle />} />
          <Route path="/chat"   element={<ChatPage />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
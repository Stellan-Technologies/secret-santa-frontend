import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Verify from "./pages/Verify";
import { Toaster } from "react-hot-toast";
import SnowParticles from "./components/SnowParticles";
import Delete from "./pages/Delete";


export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 text-white relative overflow-hidden">
      {/* Snow Background */}
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[url('/snow.png')] bg-cover animate-[snowfall_20s_linear_infinite]" />

      <BrowserRouter>
        <SnowParticles />

        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />               {/* CREATE / JOIN ROOM */}
            <Route path="/room/:roomCode" element={<Room />} /> {/* ROOM PAGE */}
            <Route path="/verify" element={<Verify />} />        {/* EMAIL VERIFY */}
            <Route path="/delete" element={<Delete />} />
          </Routes>
        </div>
      </BrowserRouter>

      <Toaster position="top-center" />
    </div>
  );
}

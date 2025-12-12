import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Room() {
  const { roomCode } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [participants, setParticipants] = useState([]);
  const [drawState, setDrawState] = useState({ hasDrawRun: false, lastCount: 0 });
  const [loading, setLoading] = useState(true);

  // Load participants for this room
  const loadParticipants = async () => {
    try {
      const res = await api.get(`/participants/verified/all?roomCode=${roomCode}`);
      setParticipants(res.data.participants || []);
    } catch (err) {
      console.log("Load participants error:", err);
    }
  };

  // Load draw state
  const loadDrawState = async () => {
    try {
      const res = await api.get(`/draw/state?roomCode=${roomCode}`);
      setDrawState(res.data || { hasDrawRun: false, lastCount: 0 });
    } catch (err) {
      console.log("State load error:", err);
    }
  };

  // Initial load
  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      setLoading(true);
      await loadParticipants();
      await loadDrawState();
      if (mounted) setLoading(false);
    };
    refresh();
    return () => {
      mounted = false;
    };
  }, [roomCode]);

  // Poll every 5s for live updates
  useEffect(() => {
    const id = setInterval(() => {
      loadParticipants();
      loadDrawState();
    }, 5000);
    return () => clearInterval(id);
  }, [roomCode]);

  // Reset draw flag when participant count changes
  useEffect(() => {
    if (participants.length > 0 && drawState.lastCount !== participants.length) {
      setDrawState(prev => ({ ...prev, hasDrawRun: false }));
    }
  }, [participants.length]);

  // Register user in this room
  const handleRegister = async () => {
    if (!name || !email) return toast.error("Enter name & email");

    try {
      await api.post("/participants/register", {
        name,
        email,
        roomCode
      });

      toast.success("Verification email sent!");
      setName("");
      setEmail("");
      // refresh
      await loadParticipants();
      await loadDrawState();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  // Run draw for this room
  const handleDraw = async () => {
    try {
      const res = await api.post("/draw", { roomCode });
      toast.success(res.data.message || "Draw complete");
      // refresh
      await loadDrawState();
      await loadParticipants();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Draw failed");
    }
  };

  // Copy invite link
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomCode}`);
    toast.success("Invite link copied!");
  };

  const drawDisabled = drawState.hasDrawRun && drawState.lastCount === participants.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto p-6 mt-10 text-white"
    >
      <h1 className="text-4xl font-bold text-center mb-4 text-yellow-300">
        🎄 Room: {roomCode}
      </h1>

      <button
        onClick={copyLink}
        className="w-full mb-6 bg-yellow-400 text-red-900 py-2 rounded-lg font-bold hover:bg-yellow-300"
      >
        Copy Invite Link
      </button>

      <div className="bg-red-800/40 p-4 rounded-lg mb-6 backdrop-blur-sm shadow">
        <h2 className="text-xl font-bold mb-2">Register</h2>

        <input
          className="w-full p-2 rounded text-black mb-2"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 rounded text-black mb-3"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 hover:bg-green-400 py-2 rounded-lg font-bold"
        >
          Register & Get Verification Email
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-3">🎅 Verified Participants</h2>

      {loading ? (
        <p className="text-yellow-200 text-center">Loading...</p>
      ) : (
        <ul className="space-y-3">
          {participants.map((p) => (
            <motion.li
              key={p._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-900/50 rounded-lg shadow flex items-center space-x-3"
            >
              <span className="text-2xl">🎁</span>
              <div>
                <strong>{p.name}</strong>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {participants.length >= 3 && (
        <button
          onClick={handleDraw}
          disabled={drawDisabled}
          className={`mt-6 w-full py-2 rounded-lg font-bold transition ${
            drawDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400"
          }`}
        >
          {drawDisabled ? "Draw Already Completed" : "Run Secret Santa Draw"}
        </button>
      )}
    </motion.div>
  );
}

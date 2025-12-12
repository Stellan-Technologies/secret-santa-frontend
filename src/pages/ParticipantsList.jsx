import { useEffect, useState } from "react";
import api from "../api/apiClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ParticipantsList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawLocked, setDrawLocked] = useState(false);

  const animatedIcons = [
    { icon: "🎅", class: "animate-bounce" },
    { icon: "🎄", class: "animate-[shake_1s_ease-in-out_infinite]" },
    { icon: "🎁", class: "group-hover:animate-wiggle" },
    { icon: "✨", class: "animate-pulse" }
  ];

  const getAnimatedIcon = (name) => {
    const index = name.charCodeAt(0) % animatedIcons.length;
    return animatedIcons[index];
  };

  const loadDrawStatus = async (count) => {
    try {
      const res = await api.get("/draw/state");
      const state = res.data;

      if (state?.hasDrawRun && state?.lastCount === count) {
        setDrawLocked(true);
      } else {
        setDrawLocked(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadParticipants = async () => {
    setLoading(true);
    const res = await api.get("/participants/verified/all");
    setParticipants(res.data.participants);
    setLoading(false);

    await loadDrawStatus(res.data.participants.length);
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + "/");
    toast.success("Invite link copied!");
  };

  const handleDraw = async () => {
    try {
      const res = await api.post("/draw");
      toast.success(res.data.message);
      loadParticipants();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Draw failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto p-6 mt-10 text-white"
    >
      <h1 className="text-4xl font-bold text-center mb-6 text-yellow-300">
        🎄 Verified Participants
      </h1>

      <button
        onClick={handleCopy}
        className="w-full mb-4 bg-yellow-400 text-red-900 py-2 rounded-lg hover:bg-yellow-300 transition font-bold"
      >
        Copy Invite Link
      </button>

      {loading ? (
        <p className="text-center text-yellow-200">Loading...</p>
      ) : (
        <ul className="space-y-4 flex flex-col items-center">
          {participants.map((p, index) => {
            const iconData = getAnimatedIcon(p.name);
            return (
              <li
                key={index}
                className="group w-72 flex items-center gap-4 p-4 bg-red-800/60 rounded-lg shadow justify-center"
              >
                <span className={`text-3xl ${iconData.class}`}>
                  {iconData.icon}
                </span>
                <strong className="text-xl">{p.name}</strong>
              </li>
            );
          })}
        </ul>
      )}

      {participants.length >= 3 && (
        <button
          disabled={drawLocked}
          onClick={handleDraw}
          className={`mt-6 w-full py-2 rounded-lg font-bold transition
            ${
              drawLocked
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400"
            }`}
        >
          {drawLocked ? "Draw Completed 🎉" : "Run Secret Santa Draw"}
        </button>
      )}
    </motion.div>
  );
}

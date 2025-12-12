import { useState } from "react";
import api from "../api/apiClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

export default function Register() {
  const [params] = useSearchParams();
  const roomFromUrl = params.get("room") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/participants/register", {
        name,
        email,
        roomCode: roomFromUrl
      });
      toast.success("Verification email sent!");
      setName("");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 mt-10 bg-red-800/60 backdrop-blur-sm rounded-xl shadow-xl text-white"
    >
      <h1 className="text-4xl font-bold text-center mb-4 text-yellow-300 drop-shadow">
        🎅 Secret Santa
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-white/20 placeholder-gray-300"
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-white/20 placeholder-gray-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-red-900 py-2 rounded-lg font-bold transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Register"}
        </button>
      </form>
    </motion.div>
  );
}

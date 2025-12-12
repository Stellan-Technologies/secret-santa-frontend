import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import toast from "react-hot-toast";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // CREATE ROOM -> calls /rooms/create
  const handleCreateRoom = async () => {
    try {
      setCreating(true);
      const res = await api.post("/rooms/create");
      const code = res.data.roomCode;
      toast.success(`Room created: ${code}`);
      navigate(`/room/${code}`);
    } catch (err) {
      console.error("Create room error:", err?.response?.data || err.message);
      toast.error("Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  // JOIN ROOM -> validate by calling backend join endpoint
  const handleJoinRoom = async () => {
    const code = roomCode?.trim().toUpperCase();
    if (!code) return toast.error("Enter room code");

    try {
      await api.post("/rooms/join", { roomCode: code });
      navigate(`/room/${code}`);
    } catch (err) {
      console.error("Join room error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Room not found");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-center text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-yellow-300">
        🎄 Secret Santa Rooms
      </h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={e => setRoomCode(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        />
        <button
          onClick={handleJoinRoom}
          className="mt-4 w-full bg-green-500 hover:bg-green-400 py-2 rounded-lg font-bold"
        >
          Join Room
        </button>
      </div>

      <hr className="border-red-300/50 my-6" />

      <button
        onClick={handleCreateRoom}
        disabled={creating}
        className="w-full bg-yellow-400 text-red-900 py-2 rounded-lg font-bold hover:bg-yellow-300"
      >
        {creating ? "Creating..." : "Create New Room 🎁"}
      </button>
    </div>
  );
}

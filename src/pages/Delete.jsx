import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import toast from "react-hot-toast";

export default function Delete() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const id = params.get("id");
  const room = params.get("room");

  useEffect(() => {
    const confirmDelete = async () => {
      try {
        await api.get(`/participants/confirm-delete?token=${token}&id=${id}`);
        toast.success("You have been removed from the room");
        navigate(`/room/${room}`);
      } catch (err) {
        toast.error("Delete failed or expired");
        navigate("/");
      }
    };

    confirmDelete();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-white text-center">
      <h1 className="text-3xl text-red-400 animate-pulse">
        Processing deletion…
      </h1>
    </div>
  );
}

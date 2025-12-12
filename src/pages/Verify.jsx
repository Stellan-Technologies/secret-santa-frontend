import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import toast from "react-hot-toast";

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const id = params.get("id");
  const roomFromUrl = params.get("room");

  useEffect(() => {
    if (!token || !id) {
      toast.error("Invalid verification link");
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.get(
          `/participants/verify?token=${token}&id=${id}`
        );

        toast.success("Email verified!");

        // backend should return the roomCode after verification
        const backendRoom = res.data?.roomCode || roomFromUrl;

        setTimeout(() => {
          if (backendRoom) navigate(`/room/${backendRoom}`);
          else navigate("/");
        }, 1000);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Verification failed");
        setTimeout(() => navigate("/"), 1500);
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-white">
      <div className="text-4xl animate-pulse mb-4">🎄</div>
      <h1 className="text-3xl font-bold mb-4 text-yellow-300">
        Verifying Email…
      </h1>
      <p className="opacity-80">Please wait a moment while we confirm you.</p>
    </div>
  );
}

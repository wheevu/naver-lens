import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../assets/naverLogo.png"; // ✅ FIXED

const PageA = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  // simple loading animation (., .., ...)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-between items-center bg-gradient-to-b from-[#0f1f0f] to-[#0a0f0a] text-white p-6">

      {/* Center card */}
      <div className="flex flex-col items-center mt-20">
        <div
          className="p-10 rounded-2xl shadow-xl backdrop-blur-md"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-32 h-32 object-contain drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold mt-6">Loading{dots}</h1>
        <p className="text-gray-300 mt-2">Preparing your experience...</p>
      </div>

      {/* Continue button */}
      <button
        onClick={() => navigate("/home")}
        className="mb-12 w-full max-w-xs py-3 rounded-xl font-semibold text-lg transition-all shadow-lg
          bg-green-500 hover:bg-green-600 active:scale-95"
      >
        Proceed →
      </button>
    </div>
  );
};

export default PageA;

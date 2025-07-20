import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-between h-screen p-6 bg-[#FAF9F6]">
      <div className="mt-12 text-center">
        <div className="text-5xl mb-2">💊</div>
        <h1 className="text-3xl font-bold">PillSense</h1>
        <p className="mt-6 text-gray-700">
          Understand what you're taking. Quickly identify pill effects and ingredients with a photo or a few words.
        </p>
      </div>

      <button
        className="w-full bg-[#FF6B6B] text-white py-3 rounded-full text-lg mt-10"
        onClick={() => navigate("/input")}
      >
        Get Started
      </button>
    </div>
  );
}

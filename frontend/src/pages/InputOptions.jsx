import { useNavigate } from "react-router-dom";

export default function InputOptions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-white">
      <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">&lt; Back</button>
      <h2 className="text-2xl font-semibold mb-6">Tell us about your pill</h2>

      {/* Photo Option */}
      <div className="p-4 border border-[#4ECDC4] rounded-lg shadow mb-4">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">📷</span>
          <p className="font-medium">Take a picture of the pill or its ingredients</p>
        </div>
        <button className="bg-[#4ECDC4] text-white px-4 py-2 rounded">Take Photo</button>
      </div>

      <div className="text-center my-2 text-gray-500">or</div>

      {/* Manual Input */}
      <input
        type="text"
        placeholder="Type pill name or ingredients"
        className="w-full border rounded p-3 mb-3"
      />
      <button
        onClick={() => navigate("/result")}
        className="bg-[#FF6B6B] text-white w-full py-3 rounded"
      >
        Submit
      </button>
    </div>
  );
}

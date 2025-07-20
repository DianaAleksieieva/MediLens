export default function Result() {
  return (
    <div className="min-h-screen p-6 bg-white flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Here's what we found</h2>

        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="font-bold text-lg">Ibuprofen</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
            <li>Active ingredient: Ibuprofen 200mg</li>
            <li>Anti-inflammatory</li>
            <li>Pain relief, fever reducer</li>
          </ul>
        </div>

        <div className="mt-6">
          <label className="block mb-1 font-medium">Have a follow-up question?</label>
          <input
            type="text"
            placeholder="Type your question..."
            className="w-full border rounded p-3"
          />
          <button className="bg-[#FF6B6B] text-white mt-2 w-full py-2 rounded">Ask</button>
        </div>
      </div>

      <button className="bg-[#4ECDC4] text-white mt-8 py-3 rounded-full w-full">
        Check another pill
      </button>
    </div>
  );
}

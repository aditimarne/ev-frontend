import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const Olahistory = () => {
  const [history, setHistory] = useState([]);

  const [showIdealRanges, setShowIdealRanges] = useState(false);


  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("olaBatteryHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const deleteEntry = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("olaBatteryHistory", JSON.stringify(updatedHistory));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex-col px-4 py-6 max-w-screen-xl mx-auto pt-40">

      <h2 className="text-2xl md:text-4xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300  animate-pulse mb-20">
        Ola Battery Health History
      </h2>
      <div className="flex justify-end mb-4">
  <button
    onClick={() => setShowIdealRanges(true)}
    className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-indigo-600 transition"
  >
    View Ideal Ranges
  </button>
</div>




      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...history].reverse().map((entry, index) => (
            <motion.div
              key={index}
              className="relative bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              <button
                onClick={() => deleteEntry(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
              >
                <FaTrash size={16} />
              </button>

              <p className="text-gray-500 text-sm mb-2">📅 {entry.timestamp}</p>

              <div className="text-sm space-y-1 text-gray-700">
                <p className="font-semibold text-gray-800">🚗 Distance: {entry.inputs.Distance_Travelled} km</p>
                <p>⏳ Ride Time: {entry.inputs.RideTime} min</p>
                <p>⚡ Avg Speed: {entry.inputs.Average_Speed} km/h</p>
                <p>🚀 Max Speed: {entry.inputs.Max_Speed} km/h</p>
                <p>🌱 Eco Mode: {entry.inputs.Eco_Mode} %</p>
                <p>⚖ Normal Mode: {entry.inputs.Normal_Mode} %</p>
                <p>🔥 Sport Mode: {entry.inputs.Sport_Mode} %</p>
                <p>🔋 SOC Consumed: {entry.inputs.SOC_Consumed} %</p>
              </div>

              <p className="text-lg font-bold text-blue-600 mt-3">📊 SOH: {entry.percentage}%</p>
              <p className="text-lg font-bold text-green-600">⏳ Life: {entry.remainingLife.toFixed(1)} Months</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No history available.</p>
      )}
      {showIdealRanges && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-700">🔋 Battery Wellness Compass</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm text-gray-800">
          <thead className="bg-indigo-100 text-indigo-700 font-semibold text-left">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Parameter</th>
              <th className="px-4 py-2 border border-gray-300">Ideal Range</th>
              <th className="px-4 py-2 border border-gray-300">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {/* Charging Habits */}
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 font-medium">🔌 Charge Times</td>
              <td className="px-4 py-2 border border-gray-300">1 - 2 times/day</td>
              <td className="px-4 py-2 border border-gray-300">Avoid overcharging</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300 font-medium">⏱ Charge Duration</td>
              <td className="px-4 py-2 border border-gray-300">1 - 4 hours</td>
              <td className="px-4 py-2 border border-gray-300">Slow charging preferred</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 font-medium">🔋 Avg Charging %</td>
              <td className="px-4 py-2 border border-gray-300">20% - 80%</td>
              <td className="px-4 py-2 border border-gray-300 text-red-600">Avoid fast charging often</td>
            </tr>

            {/* Daily Usage */}
            <tr>
              <td className="px-4 py-2 border border-gray-300 font-medium">🛣 Distance Travelled</td>
              <td className="px-4 py-2 border border-gray-300">20 - 50 km/day</td>
              <td className="px-4 py-2 border border-gray-300">Balanced usage</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 font-medium">🕒 Travel Time</td>
              <td className="px-4 py-2 border border-gray-300">1 - 2 hrs/day</td>
              <td className="px-4 py-2 border border-gray-300">Avoid excessive idling</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300 font-medium">🚦 Avg Speed</td>
              <td className="px-4 py-2 border border-gray-300">20 - 40 km/h</td>
              <td className="px-4 py-2 border border-gray-300">Maintain steady speeds</td>
            </tr>

            {/* Driving Behavior */}
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 font-medium">🟢 Eco Mode</td>
              <td className="px-4 py-2 border border-gray-300">60% - 80%</td>
              <td className="px-4 py-2 border border-gray-300 text-green-600">✅ Best</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300 font-medium">🟡 Normal Mode</td>
              <td className="px-4 py-2 border border-gray-300">20% - 30%</td>
              <td className="px-4 py-2 border border-gray-300 text-yellow-600">👍 Balanced</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 font-medium">🔴 Sport Mode</td>
              <td className="px-4 py-2 border border-gray-300">5% - 10%</td>
              <td className="px-4 py-2 border border-gray-300 text-orange-500">⚠ Limited use</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300 font-medium">🔥 Hyper Mode</td>
              <td className="px-4 py-2 border border-gray-300">1% - 5%</td>
              <td className="px-4 py-2 border border-gray-300 text-red-600">⚡ Emergency only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowIdealRanges(false)}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>

  );
};

export default Olahistory;

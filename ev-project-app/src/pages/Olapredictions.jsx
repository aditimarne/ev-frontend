import "@fortawesome/fontawesome-free/css/all.min.css";
import { gsap } from "gsap";
import { useEffect, useState } from "react";
import MLAPI from "../api/ml";

const Olapredictions = () => {
  useEffect(() => {
    localStorage.setItem("lastUsedPrediction", "ola");
  }, []);

  const [inputs, setInputs] = useState({
    Year_of_purchase: "",
    Month_of_purchase: "",
    Charge_times: "",
    Charge_duration: "",
    Avg_charging_percentage: "",
    Total_distance_travelled_daily: "",
    Travel_time_daily: "",
    Avg_speed_daily: "",
    Eco_mode_distance: "",
    Normal_mode_distance: "",
    Sport_mode_distance: "",
    Hyper_mode_distance: "",
  });

  const [percentage, setPercentage] = useState(0);
  const [remainingLife, setRemainingLife] = useState(0);
  const [recommendations, setRecommendations] = useState({ title: '', suggestions: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});


  const circumference = 2 * Math.PI * 47;

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Check if it's not a valid number
  const isInvalid = value.trim() !== "" && isNaN(Number(value));

  setInvalidFields({ ...invalidFields, [name]: isInvalid });

  setInputs({ ...inputs, [name]: value });
};


  const calculateBatteryHealth = async () => {
    try {
      // Check if any input is empty
      const emptyFields = Object.entries(inputs).filter(([key, value]) => value === "");
      if (emptyFields.length > 0) {
        alert("Please fill all fields before calculating battery health.");
        return;
      }
  
const response = await MLAPI.post("/ola/predict", inputs);


      if (!response.data || !response.data.soh || !response.data.rul) {
        throw new Error("Invalid API response");
      }
      setPercentage(response.data.soh);
      setRemainingLife(response.data.rul);
  
      // Animate circles
      setTimeout(() => {
        gsap.to("#progress", {
          strokeDashoffset: circumference - (circumference * response.data.soh) / 100,
          duration: 1.5,
          ease: "power2.out",
        });
        gsap.to("#progress-life", {
          strokeDashoffset: circumference - (circumference * response.data.rul) / 10,
          duration: 1.5,
          ease: "power2.out",
        });
        
      }, 100);
      // After response from API
const timestamp = new Date().toLocaleString();

const newEntry = {
  inputs: {
    Distance_Travelled: inputs.Total_distance_travelled_daily,
    RideTime: inputs.Travel_time_daily,
    Average_Speed: inputs.Avg_speed_daily,
    Eco_Mode: inputs.Eco_mode_distance,
    Normal_Mode: inputs.Normal_mode_distance,
    Sport_Mode: inputs.Sport_mode_distance,
    SOC_Consumed: inputs.SOC_consumed, // Make sure your form input uses this key
  },
  percentage: response.data.soh,        // SOH
  remainingLife: response.data.rul,     // RUL
  timestamp: new Date().toLocaleString()
};


// Save to localStorage
const existingHistory = JSON.parse(localStorage.getItem("olaBatteryHistory")) || [];
existingHistory.push(newEntry);
localStorage.setItem("olaBatteryHistory", JSON.stringify(existingHistory));

    } catch (error) {
      console.error("Error fetching battery health:", error);
    }

  };

  const handleShowSuggestions = async () => {
    try {
      const recommendationKeys = [
        "Charge_times",
        "Charge_duration",
        "Avg_charging_percentage",
        "Total_distance_travelled_daily",
        "Travel_time_daily",
        "Avg_speed_daily",
        "Eco_mode_distance",
        "Normal_mode_distance",
        "Sport_mode_distance",
        "Hyper_mode_distance"
      ];

      // ✅ Filter only required keys
      const filteredInputs = {};
      recommendationKeys.forEach((key) => {
        filteredInputs[key] = inputs[key];
      });

      console.log("🚀 Sending filtered inputs to backend:", filteredInputs);


const response = await MLAPI.post("/ola/recommendations", inputs);

      if (!response.data || !response.data.suggestions) {
        throw new Error("Invalid API response");
      }

      setRecommendations({
        title: response.data.title,
        suggestions: response.data.suggestions,
      });
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (percentage > 0 || remainingLife > 0) {
      setTimeout(() => {
        gsap.to("#progress", {
          strokeDashoffset: circumference - (circumference * percentage) / 100,
          duration: 1.5,
          ease: "power2.out",
        });
        gsap.to("#progress-life", {
          strokeDashoffset: circumference - (circumference * remainingLife) / 10,
          duration: 1.5,
          ease: "power2.out",
        });
      }, 100);
    }
  }, [percentage, remainingLife]);

   return (
    <div
      className="
        max-w-7xl
        mx-auto
        px-4
        pt-28
        sm:pt-48
        lg:pt-56
      "
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* ===== INPUTS ===== */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-4
            lg:grid-cols-4
            sm:gap-x-8
            lg:gap-x-5
            lg:gap-y-16
            gap-y-8
            lg:gap-10
          "
        >
          {Object.keys(inputs).map((key) => (
            <div key={key} className="relative ">
              <input
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className={`peer
                  w-full
                  max-w-[150px]
                  sm:max-w-[100px]
                  lg:max-w-[160px]
                  p-1.5
                  text-xs
                  sm:text-sm
                  bg-transparent
                  border-b-2
                  outline-none
                  text-white
                  ${invalidFields[key]
                    ? "border-red-500"
                    : "border-gray-400 focus:border-blue-500"}
                `}
              />
              <label className="absolute -top-3 left-0 text-[11px] sm:text-sm text-white transition-all
      pointer-events-none

      peer-placeholder-shown:top-2
      peer-placeholder-shown:text-sm
      peer-placeholder-shown:text-gray-400

      peer-focus:-top-3
      peer-focus:text-xs
      peer-focus:text-blue-400">
                {key.replace(/_/g, " ")}
              </label>
            </div>
          ))}

          <div className="col-span-2 md:col-span-4 flex justify-center">
            <button
              onClick={calculateBatteryHealth}
              className="
                h-10
                sm:h-12
                lg:h-14
                w-44
                sm:w-56
                lg:w-64
                bg-blue-500
                text-sm
                sm:text-base
                text-white
                font-semibold
                rounded-md
                hover:bg-blue-600
              "
            >
              Calculate Battery Health
            </button>
          </div>
        </div>

        {/* ===== CIRCLES + BUTTON ===== */}
        <div className="flex flex-col items-center">

          <div
            className="
              grid
              grid-cols-2
              gap-16
              sm:gap-14
              lg:gap-16
              md:ml-24
              w-fit
              mr-24
              lg:mr-10
              mx-auto
            "
          >
            {/* SOH */}
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                <circle cx="50" cy="50" r="45" stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle
                  id="progress"
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#22c55e"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{percentage}%</p>
                <p className="text-[9px] sm:text-xs lg:text-sm">SOH</p>
              </div>
            </div>

            {/* RUL */}
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                <circle cx="50" cy="50" r="45" stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle
                  id="progress-life"
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#f97316"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">
                  {remainingLife.toFixed(1)}M
                </p>
                <p className="text-[9px] sm:text-xs lg:text-sm">RUL</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full mt-10 lg:mt-20">
            <button
              onClick={handleShowSuggestions}
              className="
                h-10
                sm:h-14
                lg:h-14
                lg:ml-20
                w-44
                sm:w-56
                lg:w-64
                bg-green-500
                text-sm
                sm:text-base
                text-white
                font-semibold
                rounded-md
                hover:bg-green-600
              "
            >
              Look Suggestions
            </button>
          </div>
        </div>
      </div>

      {/* MODAL unchanged */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-gray-50 to-blue-100 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700">
              🔋 {recommendations.title}
            </h2>
            {recommendations.suggestions.map((s, i) => (
              <div key={i} className="mb-4 p-4 rounded-lg bg-white shadow-md border-l-4 border-blue-400">
                <p className="text-gray-800 text-sm font-medium">💡 {s}</p>
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowSuggestions(false)}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg"
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

export default Olapredictions;
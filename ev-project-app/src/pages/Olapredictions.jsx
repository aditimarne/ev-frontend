import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { gsap } from "gsap";
import React, { useEffect, useState } from "react";
import API from "../api/api";

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
  
const response = await API.post("/ola/predict/", inputs);


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


const response = await API.post("ola/recommendations/", inputs);

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
    <div className="flex p-4 justify-center pt-44">
      <div className="grid grid-cols-3 gap-[32px] p-5 mr-20">
        {Object.keys(inputs).map((key) => (
          <div key={key} className="relative p-[9px]">
            <input
  name={key}
  value={inputs[key]}
  onChange={handleChange}
  className={`peer w-40 p-2 text-sm border-b-2 bg-transparent outline-none text-white focus:ring-0 transition-all 
    ${invalidFields[key] ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-blue-500'}`}
/>

            <label
              htmlFor={key}
              className="absolute left-0 top-[-9px] text-sm text-white transition-all peer-focus:text-xs peer-focus:text-blue-500"
            >
              {key.replace(/_/g, " ")}
            </label>
          </div>
        ))}
        <div className="col-span-full flex justify-center mb-10">
          <button
            onClick={calculateBatteryHealth}
            className="px-9 py-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Calculate Battery Health
          </button>
        </div>
      </div>
      <div className="SOH">
        <div className="flex flex-col w-1/2 h-max">
          <div className="relative w-39 h-36 mb-8 pt-20">
            <svg width="200" height="250" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#e0e0e0" strokeWidth="6" />
              <circle
                id="progress"
                cx="50" cy="50"
                r="47"
                fill="none"
                stroke={percentage > 50 ? "#4CAF50" : "#FFC107"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * percentage) / 100}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute top-48 left-20 w-full h-full flex text-2xl text-white font-bold">{percentage}%</div>
          </div>
          <div className="relative w-39 h-36 ml-80 bottom-24">
            <svg width="200" height="250" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#e0e0e0" strokeWidth="6" />
              <circle
                id="progress-life"
                cx="50" cy="50"
                r="47"
                fill="none"
                stroke={remainingLife > 5 ? "#4CAF50" : "#FF5733"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * remainingLife) / 10}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute top-28 left-20 w-full h-full flex text-2xl text-white font-bold">{remainingLife.toFixed(1)}M</div>
          </div>
        </div>
        <button onClick={handleShowSuggestions} className="ml-36 mt-12 px-1 py-1 h-14 w-64 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600">Look Suggestions</button>

    {showSuggestions && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-100 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700">🔋 {recommendations.title}</h2>
      {recommendations.suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="mb-4 p-4 rounded-lg bg-white shadow-md border-l-4 border-blue-400"
        >
          <p className="text-gray-800 text-sm font-medium">💡 {suggestion}</p>
        </div>
      ))}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowSuggestions(false)}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow hover:from-red-600 hover:to-red-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </div>

    </div>
  );
};

export default Olapredictions;
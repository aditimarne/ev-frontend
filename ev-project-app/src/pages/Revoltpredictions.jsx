import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { gsap } from "gsap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Revoltpredictions = () => {
  useEffect(() => {
    localStorage.setItem("lastUsedPrediction", "revolt");
  }, []);

  const [inputs, setInputs] = useState({
    Distance_Travelled: "",
    RideTime: "",
    Average_Speed: "",
    Max_Speed: "",
    Eco_Mode: "",
    Normal_Mode: "",
    Sport_Mode: "",
    SOC_Consumed: "",
    Year_of_purchase: "",
    Month_of_purchase: "",
  });

  const [percentage, setPercentage] = useState(0);
  const [remainingLife, setRemainingLife] = useState(0);
  const [recommendations, setRecommendations] = useState({ title: '', suggestions: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const circumference = 2 * Math.PI * 47;
  const [invalidFields, setInvalidFields] = useState({});


  const handleChange = (e) => {
  const { name, value } = e.target;

  const isInvalid = value.trim() !== "" && isNaN(Number(value));

  setInvalidFields({ ...invalidFields, [name]: isInvalid });
  setInputs({ ...inputs, [name]: value });
};


  const calculateBatteryHealth = async () => {
    try {
      const emptyFields = Object.entries(inputs).filter(([_, value]) => value === "");
      if (emptyFields.length > 0) {
        alert("Please fill all fields before calculating battery health.");
        return;
      }

  const response = await API.post("/revolt/predict/", inputs);


      if (!response.data || !response.data.soh || !response.data.rul) {
        throw new Error("Invalid API response");
      }
      setPercentage(response.data.soh);
      setRemainingLife(response.data.rul);

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

      const newEntry = {
        inputs,
        percentage: response.data.soh,
        remainingLife: response.data.rul,
        timestamp: new Date().toLocaleString(),
      };

      const existingHistory = JSON.parse(localStorage.getItem("revoltBatteryHistory")) || [];
      existingHistory.push(newEntry);
      localStorage.setItem("revoltBatteryHistory", JSON.stringify(existingHistory));
    } catch (error) {
      console.error("Error fetching battery health:", error);
    }
  };

  const handleShowSuggestions = async () => {
    try {
      const keys = [
        "Distance_Travelled", "RideTime", "Average_Speed", "Max_Speed",
        "Eco_Mode", "Normal_Mode", "Sport_Mode", "SOC_Consumed"
      ];
      const filteredInputs = {};
      keys.forEach(key => filteredInputs[key] = inputs[key]);


  const response = await API.post("/revolt/recommendations/", inputs);

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
  }, [percentage, remainingLife]);

  return (
    <div className="flex p-5 justify-center pt-52 ">
      <div className="grid grid-cols-4 gap-7 p-7 mr-20">
        {Object.keys(inputs).map((key) => (
          <div key={key} className="relative p-[8px]">
            <input
              name={key}
      value={inputs[key]}
      onChange={handleChange}
      className={`peer w-36 p-2 text-sm border-b-2 bg-transparent outline-none text-white focus:ring-0 transition-all 
        ${invalidFields[key] ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-blue-500'}`}
      placeholder=" "
            />
            <label
              htmlFor={key}
              className="absolute left-0 top-[-9px] text-sm text-white transition-all peer-focus:text-xs peer-focus:text-blue-500"
            >
              {key.replace(/_/g, " ")}
            </label>
          </div>
        ))}
        <div className="col-span-full flex justify-center  ">
          <button
            onClick={calculateBatteryHealth}
            className="ml-36 mb-0 px-1 py-1 h-14 w-64 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Calculate Battery Health
          </button>
        </div>
      </div>

        <div className="SOH">
      <div className="flex flex-col pl-20pb-10">
        <div className=" relative w-39 h-36 mb-8 pt-4">
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
                      <div className="absolute top-32 left-20 w-full h-full flex text-2xl text-white font-bold">{percentage}%</div>

          </div>
           <div className="relative w-39 h-36 ml-80 bottom-40">
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
        
        {/* <div className="text-center">
          <p className="text-xl font-bold ">State of health</p>
          <p className="text-xl font-bold">Remaining life span</p>
        </div> */}
        <button
          onClick={handleShowSuggestions}
          className="ml-36 mb-11 px-1 py-1 h-14 w-64 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          Look Suggestions
        </button>
      </div>

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

export default Revoltpredictions;

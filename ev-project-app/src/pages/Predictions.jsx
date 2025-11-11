// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { gsap } from "gsap";
// import React, { useEffect, useState } from "react";

// const Predictions = () => {
//   const [inputs, setInputs] = useState({
//     Distance_Travelled: "",
//     RideTime: "",
//     Average_Speed: "",
//     Max_Speed: "",
//     Eco_Mode: "",
//     Normal_Mode: "",
//     Sport_Mode: "",
//     SOC_Consumed: "",
//   });

//   const [percentage, setPercentage] = useState(0);
//   const [remainingLife, setRemainingLife] = useState(0);
//   const [recommendations, setRecommendations] = useState({
//     title: '',
//     suggestions: [],
//   });

//   const [showSuggestions, setShowSuggestions] = useState(false); // state to toggle suggestions box
  
//   const parseNumber = (value) => (value ? parseFloat(value) || 0 : 0);

//   const getRecommendations = (health, remainingLife) => {
//     if (health > 75 && remainingLife > 3.5) {
//       return {
//         title: "Good Battery Health (SOH > 75, RUL > 3.5)",
//         suggestions: [
//           "Your battery health is excellent! Keep following these best practices to extend its lifespan.",
//           "Great job on maintaining steady speeds and efficient charging habits!",
//           "Your driving behavior is optimized for long battery life. Keep it up!",
//           "Maintain your current travel distance, ride time, and charging practices."
//         ]
//       };
//     } else if (health >= 70 && health <= 75 && remainingLife >= 2 && remainingLife <= 3.5) {
//       return {
//         title: "Moderate Battery Health (SOH 70-75, RUL 2-3.5)",
//         suggestions: [
//           "Your battery is performing well, but small optimizations can improve longevity.",
//           "Avoid frequent high-speed travel and rapid acceleration to reduce battery strain.",
//           "Consider charging at lower rates and avoiding deep discharges below 20% SOC.",
//           "Try to maintain consistent travel patterns to avoid erratic battery usage."
//         ]
//       };
//     } else if (health < 70 && remainingLife < 1.8) {
//       return {
//         title: "Low Battery Health (SOH < 70, RUL < 1.8)",
//         suggestions: [
//           "Your battery health is declining significantly. Immediate action is needed to prevent further degradation.",
//           "High battery stress detected! Reduce aggressive acceleration and frequent high-speed travel.",
//           "Frequent deep discharges can shorten battery life. Try to charge before reaching 20% SOC.",
//           "Split longer rides into multiple shorter ones to reduce overheating."
//         ]
//       };
//     } else {
//       return { title: "Battery Health", suggestions: ["No recommendations available."] };
//     }
//   };

//   const calculateBatteryHealth = () => {
//     let score = 100;

//     const distanceTravelled = parseNumber(inputs.Distance_Travelled);
//     const rideTime = parseNumber(inputs.RideTime);
//     const avgSpeed = parseNumber(inputs.Average_Speed);
//     const maxSpeed = parseNumber(inputs.Max_Speed);
//     const ecoMode = parseNumber(inputs.Eco_Mode);
//     const normalMode = parseNumber(inputs.Normal_Mode);
//     const sportMode = parseNumber(inputs.Sport_Mode);
//     const socConsumed = parseNumber(inputs.SOC_Consumed);

//     if (distanceTravelled > 5) score -= 5;
//     if (distanceTravelled > 50) score -= 10;
//     if (distanceTravelled > 100) score -= 20;

//     if (rideTime > 15) score -= 5;
//     if (rideTime > 60) score -= 10;
//     if (rideTime > 180) score -= 15;

//     if (avgSpeed > 25) score -= 5;
//     if (avgSpeed > 40) score -= 10;

//     if (maxSpeed > 35) score -= 5;
//     if (maxSpeed > 60) score -= 10;
//     if (maxSpeed > 100) score -= 15;

//     if (ecoMode > 90) score += 3;
//     if (ecoMode < 30) score -= 5;

//     if (sportMode > 0) score -= 5;
//     if (sportMode > 20) score -= 10;

//     if (socConsumed > 50) score -= 10;
//     if (socConsumed > 90) score -= 20;

//     const health = Math.max(10, Math.min(score, 100));
//     setPercentage(health);

//     let lifeSpan = 0;
//     if (health >= 100) lifeSpan = 8.0;
//     else if (health >= 95) lifeSpan = 7.3 + (health - 95) * 0.02;
//     else if (health >= 90) lifeSpan = 6.5 + (health - 90) * 0.03;
//     else if (health >= 85) lifeSpan = 5.5 + (health - 85) * 0.03;
//     else if (health >= 80) lifeSpan = 4.3 + (health - 80) * 0.05;
//     else if (health >= 75) lifeSpan = 3.0 + (health - 75) * 0.06;
//     else if (health >= 70) lifeSpan = 1.8 + (health - 70) * 0.07;
//     else if (health >= 65) lifeSpan = 0.8 + (health - 65) * 0.07;
//     else if (health >= 60) lifeSpan = 0.2 + (health - 60) * 0.05;
//     else if (health >= 50) lifeSpan = 0.0;
//     else lifeSpan = 0.0;

//     setRemainingLife(lifeSpan);

//     const recs = getRecommendations(health, lifeSpan);
//     setRecommendations(recs);
//   };

//   const circumference = 2 * Math.PI * 47;
//   useEffect(() => {
//     gsap.to("#progress", {
//       strokeDashoffset: circumference - (circumference * percentage) / 100,
//       duration: 1.5,
//       ease: "power2.out",
//     });

//     gsap.to("#progress-life", {
//       strokeDashoffset: circumference - (circumference * remainingLife) / 10,
//       duration: 1.5,
//       ease: "power2.out",
//     });
//   }, [percentage, remainingLife, circumference]);

//   const handleChange = (e) => {
//     setInputs({ ...inputs, [e.target.name]: e.target.value });
//   };

//   const handleShowSuggestions = () => {
//     setShowSuggestions(true); // Show the suggestions popup
//   };

//   const handleCloseSuggestions = () => {
//     setShowSuggestions(false); // Close the suggestions popup
//   };

//   return (
//     <div className="flex p-4">
//       {/* 2x2 Grid Layout for Input Fields */}
//       <div className="grid grid-cols-2 gap-5 w-1/2 pl-8 pt-5">
//         {inputs && Object.keys(inputs).length > 0 && Object.keys(inputs).map((key) => (
//           <div key={key} className="relative mb-9">
//             <input
//               name={key}
//               value={inputs[key]}
//               onChange={handleChange}
//               className="peer w-28 p-2 text-sm border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 focus:ring-0 transition-all"
//             />
//             <label
//               htmlFor={key}
//               className="absolute left-0 top-[-9px] text-sm text-black transition-all peer-focus:text-xs peer-focus:text-blue-500"
//             >
//               {key.replace(/_/g, " ")}
//             </label>
//             <div className="absolute left-0 bottom-0 w-32 h-1 bg-transparent peer-focus:bg-blue-500 transition-all"></div>
//           </div>
//         ))}
//         <button
//           onClick={calculateBatteryHealth}
//           className="ml-20 mb-5 px-3 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
//         >
//           Calculate Battery Health
//         </button>
       
//       </div>

//       {/* Battery Health Circles */}
//       <div className="SOH">
//         <div className="flex flex-col w-1/2 h-max">
//           <div className="relative w-39 h-36 mb-8 pt-20">
//             <svg width="200" height="250" viewBox="0 0 100 100">
//               <circle cx="50" cy="50" r="47" fill="none" stroke="#e0e0e0" strokeWidth="6" />
//               <circle
//                 id="progress"
//                 cx="50" cy="50"
//                 r="47"
//                 fill="none"
//                 stroke={percentage > 50 ? "#4CAF50" : "#FFC107"}
//                 strokeWidth="6"
//                 strokeLinecap="round"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={circumference - (circumference * percentage) / 100}
//                 transform="rotate(-90 50 50)"
//               />
//             </svg>
//             <div className="absolute top-48 left-20 w-full h-full flex text-2xl font-bold">
//               {percentage}%
//             </div>
//             <div className=" absolute items-center top-8 left-10 flex font-semibold font-general ">
//             State of Health
//             </div>
//           </div>
//           <div className="relative w-39 h-36 ml-96 bottom-24">
//             <svg width="200" height="250" viewBox="0 0 100 100">
//               <circle cx="50" cy="50" r="47" fill="none" stroke="#e0e0e0" strokeWidth="6" />
//               <circle
//                 id="progress-life"
//                 cx="50" cy="50"
//                 r="47"
//                 fill="none"
//                 stroke={remainingLife > 5 ? "#4CAF50" : "#FF5733"}
//                 strokeWidth="6"
//                 strokeLinecap="round"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={circumference - (circumference * remainingLife) / 10}
//                 transform="rotate(-90 50 50)"
//               />
//             </svg>
//             <div className="absolute top-28 left-16 w-full h-full flex text-2xl font-bold">
//               {remainingLife.toFixed(1)} yrs
//             </div>
//             <div className=" absolute items-center bottom-44  w-52 flex font-semibold font-general ">
//             Remaining Life Of Battery
//             </div>
//           </div>
//         </div>
//         <button
//           onClick={handleShowSuggestions}
//           className="ml-40 mt-16 px-2 py-1 h-14 w-64 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
//         >
//           Look Suggestions
//         </button>
//       </div>

//       {/* Suggestions Message Box */}
//       {showSuggestions && (
//         <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-auto">
//             <h2 className="font-semibold text-lg">{recommendations.title}</h2>
//             <ul className="mt-2 space-y-2 text-left">
//               {recommendations.suggestions && recommendations.suggestions.length > 0 ? (
//                 recommendations.suggestions.map((suggestion, idx) => (
//                   <li key={idx}>- {suggestion}</li>
//                 ))
//               ) : (
//                 <li>No suggestions available.</li>
//               )}
//             </ul>
//             <button
//               onClick={handleCloseSuggestions}
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Predictions;

// import React from 'react'
// import revolt from '../assets/revolt.png';

// const Predictions = () => {
//   return (
//     <div>
      
//       <div className="relative w-32 h-32 flex items-center justify-center">
//         {/* Outer Glow */}
//         <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-xl animate-pulse"></div>
        
//         {/* Inner Circle */}
//         <div className="relative w-24 h-24 bg-white rounded-full shadow-lg"></div>
//       </div>
//     </div>
   
//   )
// }

// export default Predictions



import React from 'react'

const Predictions = () => {
  return (
    <div>
      
    </div>
  )
}

export default Predictions


import "@fortawesome/fontawesome-free/css/all.min.css";
import { gsap } from "gsap";
import { useEffect, useState } from "react";
import MLAPI from "../api/ml";

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
  const [recommendations, setRecommendations] = useState({ title: "", suggestions: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const circumference = 2 * Math.PI * 45;
  const [invalidFields, setInvalidFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvalidFields({ ...invalidFields, [name]: value !== "" && isNaN(value) });
    setInputs({ ...inputs, [name]: value });
  };

  const calculateBatteryHealth = async () => {
    const empty = Object.values(inputs).some(v => v === "");
    if (empty) {
      alert("Please fill all fields");
      return;
    }

    const res = await MLAPI.post("/revolt/predict", inputs);
    setPercentage(res.data.soh);
    setRemainingLife(res.data.rul);

    gsap.to("#progress", {
      strokeDashoffset: circumference - (circumference * res.data.soh) / 100,
      duration: 1.2,
    });
    gsap.to("#progress-life", {
      strokeDashoffset: circumference - (circumference * res.data.rul) / 10,
      duration: 1.2,
    });
  };

  return (
<div className="
  max-w-7xl
  mx-auto
  px-4
  pt-28        /* 📱 mobile: push below navbar */
  sm:pt-48     /* 📲 tablet */
  lg:pt-60     /* 💻 desktop unchanged */
">

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* ===== INPUTS ===== */}
        <div className="
          grid
          grid-cols-2              /* 📱 mobile: 2×2 */
          sm:grid-cols-2
          md:grid-cols-4
          lg:grid-cols-4            /* 💻 desktop unchanged */
          sm:gap-x-8 gap-y-8
          lg:gap-y-16
          lg:gap-10
        ">
          {Object.keys(inputs).map((key) => (
            <div key={key} className="relative">
              <input
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className={`peer
                  w-full
                  max-w-[150px]        /* 📱 compact */
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

          <div className="col-span-2 md:col-span-4 flex justify-center ">
            <button
              onClick={calculateBatteryHealth}
className="
  h-10
  text-white            /* 📱 smaller */
  sm:h-12
  md:mt-0
  md:ml-20
  lg:ml-32
  lg:h-14
  w-44              /* 📱 narrower */
  sm:w-56
  md:w-60
  lg:w-64
  bg-blue-500
  text-sm           /* 📱 smaller text */
  sm:text-base
  font-semibold
  rounded-md
  hover:bg-blue-600
"            >
              Calculate Battery Health
            </button>
          </div>
        </div>

        {/* ===== CIRCLES + BUTTON ===== */}
        <div className="flex flex-col items-center">

          {/* 🔵🔵 CIRCLES GRID */}
 <div
  className="
    grid
    grid-cols-2
    gap-16          /* 📱 very small gap */
    sm:gap-16       /* 📲 tablet */
    lg:gap-20 
    md:mr-14     /* 💻 desktop unchanged */
    ml-28
    w-fit          /* 🔥 removes extra horizontal space */
    mx-auto
  "
>

            {/* SOH */}
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                <circle cx="50" cy="50" r="45" stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle
                  id="progress"
                  cx="50" cy="50" r="45"
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
                <p className="text-[9px] sm:text-xs lg:text-sm ">SOH</p>
              </div>
            </div>

            {/* RUL */}
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                <circle cx="50" cy="50" r="45" stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle
                  id="progress-life"
                  cx="50" cy="50" r="45"
                  stroke="#f97316"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{remainingLife.toFixed(1)}M</p>
                <p className="text-[9px] sm:text-xs lg:text-sm">RUL</p>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-center w-full mt-10 lg:mt-20">
  <button
    className="
      h-10
      sm:h-14
      lg:h-14
      lg:ml-20
      md:ml-16
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
    </div>
  );
};

export default Revoltpredictions;

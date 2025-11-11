import React from "react";
import { BsBatteryCharging } from "react-icons/bs";

const About = ({ percentage = 45 }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-300 transition-colors duration-500">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          {/* Background ring */}
          <circle
  stroke="#facc15"
  strokeDasharray="5,5"
  fill="transparent"
  strokeWidth={stroke}
  strokeOpacity={0.4}
  r={normalizedRadius}
  cx={radius}
  cy={radius}
/>



          {/* Progress ring with glow */}
          <circle
            stroke="#00ffcc"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 0.8s ease",
              filter: "drop-shadow(0 0 8px #00ffcc)",
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />

          {/* Battery Charging Icon */}
          <foreignObject
            x={radius - 16}
            y={radius - 40}
            width="32"
            height="32"
            className="animate-pulse"
          >
            <div className="flex items-center justify-center h-full w-full text-white text-2xl dark:text-black">
              <BsBatteryCharging />
            </div>
          </foreignObject>

          {/* Percentage */}
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="18"
            fontWeight="bold"
            dominantBaseline="middle"
            className="dark:fill-black"
          >
            {percentage}%
          </text>
        </svg>

        {/* Labels */}
        <div className="absolute inset-0 flex justify-between items-center text-xs font-semibold text-white dark:text-black">
          <span className="absolute -left-20 top-1/2 -translate-y-1/2">CHARGE</span>
          <span className="absolute top-0 left-1/2 -translate-x-1/2">ECO</span>
          <span className="absolute -right-20 top-1/2 -translate-y-1/2">POWER</span>
        </div>
      </div>
    </div>
  );
};

export default About;

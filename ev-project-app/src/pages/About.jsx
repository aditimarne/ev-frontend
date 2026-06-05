import React from "react";
import { BsBatteryCharging } from "react-icons/bs";

const About = ({ percentage = 45 }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
<div
  className="
    min-h-screen
    box-border
    flex
    flex-col
    md:flex-row
    items-start
    justify-start
    gap-8
    px-8
    md:px-16
    pt-36          /* 📱 smaller padding */
    pb-20
    md:pt-36       /* 💻 original padding */
    md:pb-36
    bg-gradient-to-br
    text-white
    overflow-x-hidden
    overflow-y-auto
    md:overflow-y-hidden ">

      {/* 🔋 Battery Health Ring */}
      {/* <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#374151"
            fill="transparent"
            strokeWidth={stroke}
            strokeOpacity={0.4}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#22c55e"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 0.8s ease",
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
          <foreignObject x={radius - 16} y={radius - 38} width="32" height="32">
            <div className="flex items-center justify-center text-2xl text-green-400">
              <BsBatteryCharging />
            </div>
          </foreignObject>
          <text
            x="50%"
            y="68%"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="18"
            fontWeight="bold"
            dominantBaseline="middle"
          >
            {percentage}% SOH
          </text>
        </svg>
      </div> */}

      {/* 📘 About Application */}
<div className="w-full max-w-3xl lg:max-w-5xl space-y-5">
        {/* <h1 className="text-3xl font-bold text-green-400">
          EV Battery Health Prediction System
        </h1> */}

        <p className="text-gray-300 leading-relaxed">
          This application is an intelligent <strong>Electric Vehicle Battery Health
          Prediction System</strong> that evaluates battery condition by estimating
          the <strong>State of Health (SOH)</strong> and{" "}
          <strong>Remaining Useful Life (RUL)</strong> using real-world operational
          data.
        </p>

        <p className="text-gray-300 leading-relaxed">
          Instead of relying on static assumptions, the system analyzes actual
          riding behavior, charging habits, and energy consumption patterns to
          model battery degradation realistically over time.
        </p>

        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            🔋 Accurately predicts <strong>Battery SOH (%)</strong>, reflecting
            current battery efficiency and degradation level
          </li>
          <li>
            ⏳ Estimates <strong>Remaining Useful Life (RUL)</strong> to help users
            plan maintenance and battery replacement
          </li>
          <li>
            🚲 Supports multiple EV brands including{" "}
            <strong>Ola Electric</strong> and <strong>Revolt EV</strong>
          </li>
          <li>
            📊 Uses real-world parameters such as distance traveled, speed,
            ride duration, charging cycles, and riding modes
          </li>
          <li>
            💡 Generates smart recommendations to improve charging habits and
            extend battery lifespan
          </li>
        </ul>

        <p className="text-gray-300 leading-relaxed">
          The system is designed with a scalable architecture, allowing future
          expansion to additional EV models, fleet-level analytics, and
          real-time sensor integration.
        </p>

        <p className="text-sm text-gray-400">
          Developed using <strong>React</strong> for a responsive user interface,
          <strong> FastAPI</strong> for high-performance ML inference,
          <strong> Django REST Framework</strong> for secure authentication,
          <strong> MongoDB</strong> for data storage, and machine learning models
          powered by <strong>LSTM (TensorFlow)</strong> and{" "}
          <strong>XGBoost</strong>.
        </p>
      </div>
    </div>
  );
};

export default About;

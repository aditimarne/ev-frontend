import './Home.css';

import { FaBatteryFull, FaChartLine, FaRocket } from 'react-icons/fa';

const Home = () => {
  return (

<div className="w-screen  min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] flex flex-col items-center justify-between text-white font-sans pt-36 pb-10 relative overflow-hidden overflow-x-hidden 
   ">

     <div className="text-center px-6 z-10 ">
    <h1 className=" lg:text-6xl  md:text-4xl text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300 mb-4 animate-pulse">
          Smart EV Battery Health Prediction
        </h1>
    <p className="text-md md:text-lg text-sm  text-gray-300 max-w-xl mx-auto">
      Predict. Prevent. Power Your Ride. Real-time insights into your electric vehicle's battery health using Digital Twin.
    </p>
    {/* <button className="relative px-6 py-2 bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-bold rounded-lg shadow-lg overflow-hidden">
  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-transparent to-blue-400 opacity-40 blur-xl animate-pulse scale-110"></span>
  <span className="relative z-10">Get Started</span>
</button> */}


  </div>

      {/* Feature Cards Section */}

 
  {/* Header Section */}
  

  {/* Cards Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-6xl z-10 md:mt-10 mt-10 lg:mb-8">
    {/* Card 1 */}
    <div className="bg-[#1e2a3a] p-6 rounded-2xl shadow-lg border border-cyan-500 hover:scale-105 transition">
      <FaBatteryFull className="text-4xl text-cyan-300 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Battery SOH Prediction</h3>
      <p className="text-gray-400 text-sm">Know the State of Health of your battery with high precision ML models.</p>
    </div>
    {/* Card 2 */}
    <div className="bg-[#1e2a3a] p-6 rounded-2xl shadow-lg border border-cyan-500 hover:scale-105 transition">
      <FaChartLine className="text-4xl text-cyan-300 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Remaining Life Forecast</h3>
      <p className="text-gray-400 text-sm">Estimate how many months your battery can keep performing at its best.</p>
    </div>
    {/* Card 3 */}
    <div className="bg-[#1e2a3a] p-6 rounded-2xl shadow-lg border border-cyan-500 hover:scale-105 transition">
      <FaRocket className="text-4xl text-cyan-300 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Performance Modes Insight</h3>
      <p className="text-gray-400 text-sm">Visualize impact of Eco, Normal & Sport Modes on your battery performance.</p>
    </div>
  </div>
    <button onClick={() => navigate("/login")}>
  Go Login
</button>

  {/* Decorative Glow Effects */}
  <div className="absolute w-[700px] h-[700px] bg-cyan-400 opacity-10 rounded-full blur-3xl top-[10%] left-[-20%] z-0"></div>
  <div className="absolute w-[500px] h-[500px] bg-teal-300 opacity-10 rounded-full blur-3xl bottom-[10%] right-[-15%] z-0"></div>

</div>

  );
  
};

export default Home;

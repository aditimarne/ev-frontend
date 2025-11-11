import { Outlet, Link } from "react-router-dom";

const History = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-blue-700">Battery History</h2>
      <div className="flex justify-center gap-4 my-4">
        <Link to="/history/revolt" ></Link>
        <Link to="/history/ola" ></Link>
      </div>
      <Outlet /> {/* This will load either Revolt or Ola history */}
    </div>
  );
};

export default History;

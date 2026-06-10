import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation
} from "react-router-dom";

import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Olahistory from "./pages/Olahistory";
import Olapredictions from "./pages/Olapredictions";
import Predictions from "./pages/Predictions";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Revolthistory from "./pages/Revolthistory";
import Revoltpredictions from "./pages/Revoltpredictions";
import Settings from "./pages/Settings";

// Dynamic history component
const DynamicHistory = () => {
  const [historyType, setHistoryType] = useState(null);

  useEffect(() => {
    const lastUsed = localStorage.getItem("lastUsedPrediction");
    setHistoryType(lastUsed);
  }, []);

  if (historyType === "ola") return <Olahistory />;
  return <Revolthistory />; // default
};



const AppRoutes = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const hideNavbarRoutes = ["/register", "/login"];

  return (
    <main className="bg-gradient-to-br from-[#141e30] to-[#243b55] min-h-screen">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={token ? <Settings /> : <Navigate to="/login" />}
        />
                {/* <Route path="/settings" element={<Settings />} /> */}

        <Route path="/olapredictions" element={<Olapredictions />} />
        <Route path="/revoltpredictions" element={<Revoltpredictions />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/history" element={<DynamicHistory />} />
        <Route path="/ola-prediction" element={<Olapredictions />} />
        <Route path="/revolt-prediction" element={<Revoltpredictions />} />
        <Route path="*" element={<Navigate to={token ? "/profile" : "/login"} />} />
      </Routes>
    </main>
  );
};


const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;

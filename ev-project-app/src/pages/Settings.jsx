import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Profile from "./Profile";
import AccountSettings from "./AccountSettings";
import Notifications from "./Notifications";
import FAQ from "./FAQ";
import { useNavigate, useSearchParams } from "react-router-dom";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get tab from URL or default to "profile"
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  // When active tab changes, update URL
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Handles back navigation
  const handleBack = () => {
    navigate("/home"); // or navigate(-1) if you prefer previous page
  };

  // Render tab content
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      case "notifications":
        return <Notifications />;
      case "faq":
        return <FAQ />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r p-8 shadow-sm flex flex-col">
        {/* Top Row: Back Arrow + Title */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-blue-700 transition z-50"
            aria-label="Go back"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <button
            className={`text-left ${
              activeTab === "profile" ? "text-blue-700 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Public Profile
          </button>
          <button
            className={`text-left ${
              activeTab === "account" ? "text-blue-700 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account Settings
          </button>
          <button
            className={`text-left ${
              activeTab === "notifications" ? "text-blue-700 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`text-left ${
              activeTab === "faq" ? "text-blue-700 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 transition-all duration-300 ease-in-out">
        {renderContent()}
      </main>
    </div>
  );
};

export default Settings;

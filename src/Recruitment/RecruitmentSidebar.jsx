// RecruitmentSidebar.jsx

import React from "react";

const RecruitmentSidebar = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: "post",
      label: "Post New Job",
    },
    {
      id: "listings",
      label: "Job Listings",
    },
    {
      id: "applications",
      label: "Applications",
    },
  ];

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-indigo-100 shadow-lg min-h-screen">
      <nav className="p-6 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id
              )
            }
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
              
              ${
                activeTab ===
                tab.id
                  ? "bg-indigo-50 text-indigo-600 shadow-lg scale-105"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105"
              }
            `}
          >
            <span>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default RecruitmentSidebar;
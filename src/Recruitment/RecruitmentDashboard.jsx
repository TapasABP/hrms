import { useState } from "react";
import RecruitmentHeader from "./RecruitmentHeader";
import RecruitmentSidebar from "./RecruitmentSidebar";
import RecruitmentContent from "./RecruitmentContent";

function RecruitmentDashboard() {
  const [
    activeTab,
    setActiveTab,
  ] = useState("applications");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <RecruitmentHeader />

      <div className="flex">
        {/* Sidebar */}
        <RecruitmentSidebar
          activeTab={
            activeTab
          }
          setActiveTab={
            setActiveTab
          }
        />

        {/* Main Content */}
        <RecruitmentContent
          activeTab={
            activeTab
          }
        />
      </div>
    </div>
  );
}

export default RecruitmentDashboard;
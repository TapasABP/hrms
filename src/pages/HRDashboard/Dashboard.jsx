import React, { useEffect, useState } from "react";
import Header from "./Header";

const modules = [
  {
    title: "Recruitment",
    icon: "💼",
    page: "/recruitment",
  },
  {
    title: "Onboarding",
    icon: "👤",
    page: "/onboarding",
  },
  {
    title: "Attendance",
    icon: "📅",
    page: "/attendance",
  },
  {
    title: "Reimbursement History",
    icon: "🧾",
    page: "/reimbursements",
  },
  {
    title: "Analytics",
    icon: "📊",
    page: "/analytics",
  },
];

const Dashboard = () => {
  const [employeeName, setEmployeeName] = useState("User");

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("ZeroUserData") || "{}"
    );

    const empName =
      data?.user?.name ||
      data?.user?.fullname ||
      "User";

    setEmployeeName(empName);
  }, []);

  const openModule = (page) => {
    const data = JSON.parse(
      localStorage.getItem("ZeroUserData") || "{}"
    );

    if (!data?.user?.username || !data?.user?.org_id) {
      alert("Please login again.");
      window.location.href = "/";
      return;
    }

    window.location.href = page;
  };

  const logout = () => {
    localStorage.removeItem("ZeroUserData");
    window.location.href = "/";
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
      {/* Header */}
     <Header/>
      {/* Cards */}
      <main className="flex-grow flex justify-center items-start py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full px-6">
          {modules.map((module, index) => (
            <div
              key={index}
              onClick={() => openModule(module.page)}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition group border border-slate-200"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl group-hover:scale-110 transition">
                  {module.icon}
                </div>

                <h3 className="text-lg font-semibold">
                  {module.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import React, {
  useEffect,
  useState,
} from "react";
import Header from "./Header";

import {
  Briefcase,
  UserPlus,
  CalendarDays,
  Receipt,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    title: "Recruitment",
    icon: Briefcase,
    page: "/recruitment",
    iconColor: "text-blue-500",
  },
  {
    title: "Onboarding",
    icon: UserPlus,
    page: "/onboarding",
    iconColor: "text-green-500",
  },
  {
    title: "Attendance",
    icon: CalendarDays,
    page: "/attendance",
    iconColor: "text-yellow-500",
  },
  {
    title:
      "Reimbursement History",
    icon: Receipt,
    page:
      "/reimbursements",
    iconColor: "text-purple-500",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    page: "/analytics",
    iconColor: "text-pink-500",
  },
];

const Dashboard = () => {
  const [
    employeeName,
    setEmployeeName,
  ] = useState("User");

  useEffect(() => {
    const data =
      JSON.parse(
        localStorage.getItem(
          "ZeroUserData"
        ) || "{}"
      );

    const empName =
      data?.user?.name ||
      data?.user?.fullname ||
      "User";

    setEmployeeName(
      empName
    );
  }, []);

  const openModule = (
    page
  ) => {
    const data =
      JSON.parse(
        localStorage.getItem(
          "ZeroUserData"
        ) || "{}"
      );

    if (
      !data?.user
        ?.username ||
      !data?.user?.org_id
    ) {
      alert(
        "Please login again."
      );
      window.location.href =
        "/";
      return;
    }

    window.location.href =
      page;
  };

  const logout = () => {
    localStorage.removeItem(
      "ZeroUserData"
    );

    window.location.href =
      "/";
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
      {/* Header */}
      <Header
        employeeName={
          employeeName
        }
        logout={logout}
      />

      {/* Cards */}
      <main className="flex-grow flex justify-center items-start py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full px-6">
          {modules.map(
            (
              module,
              index
            ) => {
              const Icon =
                module.icon;

              return (
                <div
                  key={index}
                  onClick={() =>
                    openModule(
                      module.page
                    )
                  }
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition group border border-slate-200"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Icon
                      className={`w-8 h-8 ${module.iconColor} group-hover:scale-110 transition`}
                    />

                    <h3 className="text-lg font-semibold">
                      {
                        module.title
                      }
                    </h3>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
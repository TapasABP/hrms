import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Header from "./Header";
import axios from "axios";
import { MAIN_API_URL } from "../../constants/global-variables";

const Analytics = () => {
  const genderRef = useRef(null);
  const ageRef = useRef(null);
  const experienceRef = useRef(null);
  const departmentRef = useRef(null);
  const exitRef = useRef(null);
 const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = userData?.token;        
  // Keep chart instances so we can destroy them
  const chartInstances = useRef({});

//   const data = {
//     gender: [
//       { gender: "Male", count: 1 },
//       { gender: "Female", count: 2 },
//       { gender: "Other", count: 1 },
//     ],
//     age: [
//       { age_group: "26-35", count: 1 },
//       { age_group: "60+", count: 1 },
//     ],
//     experience: [
//       { exp_group: "<1", count: 1 },
//       { exp_group: "1-3", count: 1 },
//       { exp_group: "3-5", count: 1 },
//     ],
//     department: [
//       { department: "1", count: 1, department_name: "" },
//       { department: "1000001", count: 1, department_name: "HR" },
//       { department: "1000002", count: 6, department_name: "IT" },
//       { department: "1000004", count: 1, department_name: "Sales" },
//       { department: "1000005", count: 1, department_name: "Renewal" },
//     ],
//     exitReasons: [],
//   };
  const [data, setData] = React.useState(null);
  useEffect(() => {
    const fetchData = async () => {
      axios.get(`${MAIN_API_URL}/analytics`, {
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
    };
    fetchData();
  }, []);
  useEffect(() => {
    const createChart = (ref, key, config) => {
      // Destroy previous chart if exists
      if (chartInstances.current[key]) {
        chartInstances.current[key].destroy();
      }
      chartInstances.current[key] = new Chart(ref.current, config);
    };

    createChart(genderRef, "gender", {
      type: "doughnut",
      data: {
        labels: data?.gender.map((d) => d.gender),
        datasets: [
          {
            data: data?.gender.map((d) => d.count),
            backgroundColor: ["#F472B6", "#3B82F6", "#FACC15"],
          },
        ],
      },
    });

    createChart(ageRef, "age", {
      type: "bar",
      data: {
        labels: data?.age.map((d) => d.age_group),
        datasets: [
          {
            label: "Employees",
            data: data?.age.map((d) => d.count),
            backgroundColor: "#60A5FA",
          },
        ],
      },
    });

    createChart(experienceRef, "experience", {
      type: "line",
      data: {
        labels: data?.experience.map((d) => d.exp_group),
        datasets: [
          {
            label: "Employees",
            data: data?.experience.map((d) => d.count),
            backgroundColor: "#A78BFA",
            borderColor: "#A78BFA",
            fill: true,
          },
        ],
      },
    });

    createChart(departmentRef, "department", {
      type: "bar",
      data: {
        labels: data?.department.map((d) =>
          d.department_name || `Dept ${d.department}`
        ),
        datasets: [
          {
            label: "Employees",
            data: data?.department.map((d) => d.count),
            backgroundColor: "#FBBF24",
          },
        ],
      },
    });

    if (data?.exitReasons.length > 0) {
      createChart(exitRef, "exit", {
        type: "bar",
        data: {
          labels: data?.exitReasons.map((d) => d.status),
          datasets: [
            {
              label: "Employees",
              data: data?.exitReasons.map((d) => d.count),
              backgroundColor: "#EF4444",
            },
          ],
        },
        options: { indexAxis: "y" },
      });
    }
  }, [data]); // runs once on mount

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Rich Visual Analytics of Your Workforce
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-2">Gender Ratio</h3>
            <canvas ref={genderRef} />
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-2">Age Distribution</h3>
            <canvas ref={ageRef} />
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              Experience in Organization (Years)
            </h3>
            <canvas ref={experienceRef} />
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-2">Headcount per Department</h3>
            <canvas ref={departmentRef} />
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-2">Exit Reasons</h3>
            {data?.exitReasons.length === 0 ? (
              <p className="text-gray-500">No exit reasons recorded.</p>
            ) : (
              <canvas ref={exitRef} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
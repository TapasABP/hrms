import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { MAIN_API_URL } from "../../constants/global-variables";
import axios from "axios";
import { DEPARTMENTS, LEAVEAPPLYSTATUS, LEAVEDURATION } from "../../contstants/application";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = userData?.token;
  const orgId = userData?.user?.org_id;
  const [showModal, setShowModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [leaveWfhHistory, setLeaveWfhHistory] = useState([
    {
      "id": 8,
      "leave_wfh": "7000001",
      "from_date": "2026-05-28",
      "to_date": "2026-05-29",
      "duration": "6000001",
      "type": "5000002",
      "reason": "Medical emergency",
      "status": "Pending",
      "created_at": "2026-05-29 08:12:38"
    },
    {
      "id": 10,
      "leave_wfh": "7000002",
      "from_date": "2026-05-28",
      "to_date": "2026-05-29",
      "duration": "6000002",
      "type": "5000001",
      "reason": "Medical emergency",
      "status": "Pending",
      "created_at": "2026-05-29 08:12:38"
    }]);
  const [compOffHistory, setCompOffHistory] = useState([
    {
      "id": 12,
      "leave_wfh": "7000001",
      "from_date": "2026-05-28",
      "to_date": "2026-05-29",
      "duration": "6000001",
      "type": "5000002",
      "reason": "Medical emergency",
      "status": "Pending",
      "created_at": "2026-05-29 08:12:38"
    },
    {
      "id": 11,
      "leave_wfh": "7000002",
      "from_date": "2026-05-28",
      "to_date": "2026-05-29",
      "duration": "6000002",
      "type": "5000001",
      "reason": "Medical emergency",
      "status": "Pending",
      "created_at": "2026-05-29 08:12:38"
    }]);
  const formatApiDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 11 },
    (_, index) => currentYear - index
  );

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };
  const loadAttendance = () => {

    setLoading(true);

    const payload = {

      // from_date: formatApiDate(fromDate),
      // to_date: formatApiDate(toDate),
      department: deptFilter || undefined,
      year:year?.toString(),
      month:month
    };

    axios
      .post(
        `${MAIN_API_URL}/attendance/overview`,
        payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      )
      .then((response) => {
        const employees = response.data?.employees || [];

        setAttendanceData(employees);

        const deptSet = new Set();

        employees.forEach((emp) => {
          if (emp.department) {
            deptSet.add(emp.department);
          }
        });

        setDepartments(
          Array.from(deptSet).sort()
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load attendance overview:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong";

        console.error("Error:", message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAttendance();
  }, [orgId]);
  const loadEmployeeDetails = (userId, fullname) => {
    setDetailsLoading(true);

    axios
      .post(
        `${MAIN_API_URL}/attendance/employee-history`,
        {
          user_id: userId,
          from_date: formatApiDate(fromDate),
          to_date: formatApiDate(toDate),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSelectedEmployeeName(fullname);

        setLeaveWfhHistory(
          response.data?.leave_wfh_history || [
            {
              "id": 8,
              "leave_wfh": "7000001",
              "from_date": "2026-05-28",
              "to_date": "2026-05-29",
              "duration": "6000001",
              "type": "5000002",
              "reason": "Medical emergency",
              "status": "Pending",
              "created_at": "2026-05-29 08:12:38"
            },
            {
              "id": 10,
              "leave_wfh": "7000002",
              "from_date": "2026-05-28",
              "to_date": "2026-05-29",
              "duration": "6000002",
              "type": "5000001",
              "reason": "Medical emergency",
              "status": "Pending",
              "created_at": "2026-05-29 08:12:38"
            }]
        );
        setCompOffHistory(
          response.data?.comp_off_history || []
        );
        setShowModal(true);
      })
      .catch((error) => {
        setShowModal(true);
        console.error(
          "Failed to load employee details:",
          error
        );
      })
      .finally(() => {
        setDetailsLoading(false);
      });
  };
  const closeModal = () => {
    setShowModal(false);
    setLeaveWfhHistory([]);
    setSelectedEmployeeName("");
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance Overview</h1>
        <Link to="/hr-dashboard" className="text-sm underline">
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="font-semibold mb-3">Filters</h2>
          <div className="grid md:grid-cols-4 gap-3">

            {/* <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              placeholderText="From Date"
              dateFormat="yyyy-MM-dd"
              className="w-full border rounded p-2 text-sm"
            />
            
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              placeholderText="To Date"
              dateFormat="yyyy-MM-dd"
              className="w-full border rounded p-2 text-sm"
            /> */}
            
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year
                </label>
                <select
                  value={year}
                  onChange={handleYearChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                >
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Month
                </label>
                <select
                  value={month}
                  onChange={handleMonthChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                >
                  <option value="">Select Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department
              </label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-3"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
              onClick={loadAttendance}
              className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold">Employee Attendance Summary</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Leave Requests</th>
                  <th className="p-3">WFH Requests</th>
                  <th className="p-3">Comp Off Requests</th>
                  <th className="p-3">View</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6">
                      Loading...
                    </td>
                  </tr>
                ) : attendanceData.length > 0 ? (
                  attendanceData.map((emp) => (
                    <tr key={emp.user_id} className="border-b hover:bg-slate-50" >
                      <td className="p-3">{emp.user_id}</td>
                      <td className="p-3 font-medium">{emp.fullname}</td>
                      <td className="p-3">{DEPARTMENTS.find(dept => dept.id == emp.department)?.value || "Unknown"}</td>
                      <td className="p-3">{emp.leave_count}</td>
                      <td className="p-3">{emp.wfh_count}</td>
                      <td className="p-3">{emp.comp_off_count}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            loadEmployeeDetails(
                              emp.user_id,
                              emp.fullname
                            )
                          }
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                          title="View Details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-slate-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
        {/* History Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-5xl p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedEmployeeName} - Attendance History
                </h2>
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-slate-700 text-white rounded"
                >
                  Close
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Leave & WFH History */}
                <div>
                  <h3 className="font-medium mb-2">Leave History</h3>
                  <div className="overflow-auto max-h-[400px] border rounded">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 text-left">From</th>
                          <th className="p-2 text-left">To</th>
                          <th className="p-2 text-left">Duration</th>
                          <th className="p-2 text-left">Reason</th>
                          <th className="p-2 text-left">Status</th>
                          <th className="p-2 text-left">Rejection Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveWfhHistory?.length > 0 ? (
                          leaveWfhHistory?.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.from_date}</td>
                              <td className="p-2">{item.to_date}</td>
                              <td className="p-2">{LEAVEDURATION.find(duration => duration.id == item.duration)?.value || "Unknown"}</td>
                              <td className="p-2">{item.reason}</td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${item.status === "9000002"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "9000003"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {LEAVEAPPLYSTATUS.find(status => status.id == item.status)?.value || item.status}
                                </span>
                              </td>
                              <td className="p-2">{item.reject_reason || "N/A"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="p-6 text-center text-slate-500">
                              No Leave/WFH history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <br/>
                <div>
                  <h3 className="font-medium mb-2">WFH History</h3>
                  <div className="overflow-auto max-h-[400px] border rounded">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 text-left">From</th>
                          <th className="p-2 text-left">To</th>
                          <th className="p-2 text-left">Duration</th>
                          <th className="p-2 text-left">Reason</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveWfhHistory?.length > 0 ? (
                          leaveWfhHistory?.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.from_date}</td>
                              <td className="p-2">{item.to_date}</td>
                              <td className="p-2">{LEAVEDURATION.find(duration => duration.id == item.duration)?.value || "Unknown"}</td>
                              <td className="p-2">{item.reason}</td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${item.status === "9000002"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "9000003"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {LEAVEAPPLYSTATUS.find(status => status.id == item.status)?.value || item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="p-6 text-center text-slate-500">
                              No Leave/WFH history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <br/>
                {/* Comp Off History */}
                <div>
                  <h3 className="font-medium mb-2">Comp Off History</h3>
                  <div className="overflow-auto max-h-[400px] border rounded">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 text-left">From</th>
                          <th className="p-2 text-left">To</th>
                          <th className="p-2 text-left">Reason</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compOffHistory?.length > 0 ? (
                          compOffHistory?.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.from_date}</td>
                              <td className="p-2">{item.to_date}</td>
                              <td className="p-2">{item.reason}</td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${item.status === "9000002"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "9000003"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {LEAVEAPPLYSTATUS.find(status => status.id == item.status)?.value || item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="p-6 text-center text-slate-500">
                              No Comp Off history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Attendance;
// Leave.jsx
import React, { useEffect, useState } from "react";
import LeaveHistory from "./LeaveHistory";
import MyAssets from "./MyAssets";
import axios from "axios";
import { MAIN_API_URL } from "../constants/global-variables";

const Leave = () => {
    const [leavedata, setleaveData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [otherData, setOtherData] = useState(null);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    //   useEffect(() => {

    //     if (!storedData?.user || storedData.user.user_type !== 2) {
    //     //   alert("Unauthorized. Please login as an employee.");
    //     //   return;
    //     }

    //     // setData(storedData);
    //   }, []);

    const logout = () => {
        localStorage.removeItem("ZeroUserData");
        window.location.href = "index.html";
    };

    //   if (!data) return null;
    useEffect(() => {
        axios.post(`${MAIN_API_URL}/leave/leave-wfh`, { user_id: 18 }, {
            headers: {
                Authorization: `Bearer ${storedData?.token}`
            }
        })
            .then(response => {
                console.log("Leave Data:", response.data);
                const leaveHistory = response.data.history || [];
                const { remaining_cl, remaining_sl, remaining_el, fy_cl, fy_sl, fy_el } = response.data;
                setOtherData({
                    "remaining_cl": remaining_cl || 0,
                    "remaining_sl": remaining_sl || 0,
                    "remaining_el": remaining_el || 0,
                    "fy_cl": fy_cl || 0,
                    "fy_sl": fy_sl || 0,
                    "fy_el": fy_el || 0,
                })
                setleaveData(leaveHistory);
            })
            .catch(error => {
                console.error("Error fetching leave data:", error);
            });
    }, [])
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Header */}
            <header className="bg-slate-500 text-white px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <img
                        src="logo.png"
                        alt="ZeroHR Logo"
                        className="w-14 h-14 rounded-full object-cover bg-white shadow"
                    />
                    <h1 className="text-lg font-semibold">Employee Dashboard</h1>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="font-medium"
                    >
                        {/* {data?.fullname} */}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-xl shadow-lg overflow-hidden z-50">
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-3 hover:bg-slate-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Summary Cards */}
                <div className="flex-1 min-w-[250px] space-y-6">
                    <SummaryCard
                        title="Total Leaves (FY)"
                    // value={data?.total_leaves}
                    />

                    <SummaryCard
                        title="Total Remaining Leaves"
                    // value={data?.pending_total_leaves}
                    />

                    <SummaryCard
                        title="Remaining CL"
                        value={otherData?.remaining_cl}
                    />

                    <SummaryCard
                        title="Remaining SL"
                        value={otherData?.remaining_sl}
                    />
                </div>

                {/* Leave Form */}
                <div className="flex-[2] min-w-[320px]">
                    {/* <div className="bg-emerald-100 border border-emerald-500 text-emerald-800 rounded-xl px-4 py-3 mb-6">
            ✅ Your leave request has been submitted. It's now with your
            manager.
          </div> */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-semibold mb-6">
                            Apply for Leave
                        </h2>

                        <form className="space-y-5">
                            <div>
                                <label className="block mb-2 font-medium">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Leave Duration
                                </label>
                                <select className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400">
                                    <option>Select Duration</option>
                                    <option>Full Day</option>
                                    <option>Half Day</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Leave Type
                                </label>
                                <select className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400">
                                    <option>Select Type</option>
                                    <option>Casual Leave</option>
                                    <option>Sick Leave</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Reason
                                </label>
                                <textarea
                                    rows="4"
                                    maxLength="1000"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-slate-500 hover:bg-slate-600 transition text-white px-8 py-3 rounded-xl font-medium"
                            >
                                Apply
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <LeaveHistory leavehistory={leavedata} otherData={otherData} />

            <MyAssets />

            {/* Footer */}
            <footer className="bg-slate-100 text-slate-500 text-center py-4 text-sm">
                © 2025 Pratiti Technologies Private Limited
            </footer>
        </div>
    );
};

const SummaryCard = ({ title, value }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-slate-500 text-sm font-medium mb-2">
                {title}
            </h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
};

export const TableHead = ({ children }) => {
    return (
        <th className="text-left px-6 py-4 font-semibold text-slate-700">
            {children}
        </th>
    );
};

export const TableCell = ({ children }) => {
    return (
        <td className="px-6 py-4 text-slate-700">{children}</td>
    );
};

export default Leave;
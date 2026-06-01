// Leave.jsx
import React, { useEffect, useState } from "react";
import LeaveHistory from "./LeaveHistory";
import MyAssets from "./MyAssets";
import axios from "axios";
import { MAIN_API_URL } from "../constants/global-variables";
import { LEAVEDURATION, LEAVETYPES } from "../contstants/application";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/images/logo.png";

const Leave = () => {
    const [leavedata, setleaveData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [otherData, setOtherData] = useState(null);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const [formData, setFormData] = useState({
        from_date: "",
        to_date: "",
        reason: "",
        leave_type: "",
        duration: "",
        leave_wfh: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: Number(value) || value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            from_date: formData.from_date,
            to_date: formData.to_date,
            reason: formData.reason,
            leave_type: formData.leave_type,
            duration: formData.duration,
            leave_wfh: formData.leave_wfh,
        };

        axios
            .post(`${MAIN_API_URL}/leave/apply`, payload ,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData?.token}`
                }       
            })
            .then((response) => {
                console.log("Leave applied successfully:", response.data);
                toast.success("Leave applied successfully!");
                setFormData({
                    from_date: "",
                    to_date: "",
                    reason: "",
                    leave_type: "",
                    duration: "",
                    leave_wfh: "",
                });
                window.location.reload();
            })
            .catch((error) => {
                console.error(
                    "Error applying leave:",
                    error.response?.data || error.message
                );
                alert("Failed to apply leave");
            });
    };
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
                        src={logo}
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
                        <h2 className="text-2xl font-semibold mb-6">Apply for Leave</h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* From Date */}
                            <div>
                                <label className="block mb-2 font-medium">Start Date</label>
                                <input
                                    type="date"
                                    name="from_date"
                                    value={formData.from_date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    required
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="block mb-2 font-medium">End Date</label>
                                <input
                                    type="date"
                                    name="to_date"
                                    value={formData.to_date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    required
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block mb-2 font-medium">Leave Duration</label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    required
                                >
                                    <option value="">Select Duration</option>
                                    {/* <option value={6000001}>Full Day</option>
                                    <option value={6000002}>Half Day</option> */}
                                    {
                                        LEAVEDURATION.map((duration) => (
                                            <option key={duration.id} value={duration.id}>
                                                {duration.value}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Leave Type */}
                            <div>
                                <label className="block mb-2 font-medium">Leave Type</label>
                                <select
                                    name="leave_type"
                                    value={formData.leave_type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {/* <option value={5000001}>Casual Leave</option>
                                    <option value={5000002}>Sick Leave</option> */}\
                                    {
                                        LEAVETYPES.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.value}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* WFH Option */}
                            <div>
                                <label className="block mb-2 font-medium">Leave / WFH</label>
                                <select
                                    name="leave_wfh"
                                    value={formData.leave_wfh}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                                    required
                                >
                                    <option value="">Select Option</option>
                                    <option value={7000001}>Leave</option>
                                    <option value={7000002}>Work From Home</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block mb-2 font-medium">Reason</label>
                                <textarea
                                    rows={4}
                                    maxLength={1000}
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                                    required
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
            <ToastContainer/>
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
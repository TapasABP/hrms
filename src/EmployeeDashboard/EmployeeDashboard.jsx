import React, { useEffect, useState } from "react";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");

  const [showCelebration, setShowCelebration] = useState(false);

  const [userData, setUserData] = useState(null);

  const [leaveBalance, setLeaveBalance] = useState({
    cl: 5,
    sl: 3,
    el: 10,
  });

  const [formData, setFormData] = useState({
    leave_type: "",
    duration: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // ============================
  // LOAD USER
  // ============================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("ZeroUserData"));

    if (!storedUser?.user || storedUser.user.user_type !== 2) {
      alert("Unauthorized");
      return;
    }

    setUserData(storedUser);
  }, []);

  // ============================
  // HANDLERS
  // ============================
  const openPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setShowPopup(false);
    setShowCelebration(true);

    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ================= HEADER ================= */}
      <header className="bg-slate-800 text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="logo.png"
            alt="logo"
            className="w-12 h-12 rounded-full object-cover"
          />

          <h1 className="text-xl font-semibold">
            Employee Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Welcome{" "}
            {userData?.user?.fullname ||
              userData?.user?.username}
          </span>

          <button
            onClick={logout}
            className="text-red-300 hover:text-red-400 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white border-b border-slate-200 px-8 flex gap-6">
        {["home", "profile", "leaves", "team"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 capitalize border-b-2 transition-all ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="p-8">
        {/* ================= HOME ================= */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center gap-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140061.png"
                alt="profile"
                className="w-24 h-24 rounded-full object-cover"
              />

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {userData?.user?.fullname}
                </h2>

                <p className="text-slate-500">
                  {userData?.user?.designation ||
                    "Software Engineer"}
                </p>

                <p className="text-slate-500">
                  {userData?.user?.email}
                </p>
              </div>
            </div>

            {/* LEAVE BALANCE */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-100 text-blue-700 px-6 py-4 rounded-full font-semibold">
                CL: {leaveBalance.cl}
              </div>

              <div className="bg-yellow-100 text-yellow-700 px-6 py-4 rounded-full font-semibold">
                SL: {leaveBalance.sl}
              </div>

              <div className="bg-green-100 text-green-700 px-6 py-4 rounded-full font-semibold">
                EL: {leaveBalance.el}
              </div>
            </div>

            {/* PANELS */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  🎂 Birthdays Today
                </h3>

                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    John Doe
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    Sarah Smith
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  📅 Upcoming Holidays
                </h3>

                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    Independence Day
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    Diwali
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140061.png"
                alt="profile"
                className="w-28 h-28 rounded-full"
              />

              <div>
                <h2 className="text-3xl font-bold">
                  {userData?.user?.fullname}
                </h2>

                <p className="text-slate-500 mt-1">
                  {userData?.user?.designation}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-100 p-5 rounded-xl">
                <h4 className="text-sm text-slate-500">
                  Email
                </h4>

                <p className="font-semibold mt-1">
                  {userData?.user?.email}
                </p>
              </div>

              <div className="bg-slate-100 p-5 rounded-xl">
                <h4 className="text-sm text-slate-500">
                  Username
                </h4>

                <p className="font-semibold mt-1">
                  {userData?.user?.username}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= LEAVES ================= */}
        {activeTab === "leaves" && (
          <div className="space-y-8">
            {/* SUMMARY */}
            <div className="flex flex-wrap gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 w-56">
                <h4 className="text-slate-500">
                  Casual Leaves
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {leaveBalance.cl}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 w-56">
                <h4 className="text-slate-500">
                  Sick Leaves
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {leaveBalance.sl}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 w-56">
                <h4 className="text-slate-500">
                  Earned Leaves
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {leaveBalance.el}
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openPopup("leave")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                + Apply Leave
              </button>

              <button
                onClick={() => openPopup("wfh")}
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl"
              >
                + Apply WFH
              </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-4">From</th>
                    <th className="text-left p-4">To</th>
                    <th className="text-left p-4">Reason</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="p-4">01/06/2026</td>
                    <td className="p-4">02/06/2026</td>
                    <td className="p-4">Vacation</td>
                    <td className="p-4 text-green-600 font-semibold">
                      Approved
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TEAM ================= */}
        {activeTab === "team" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              My Team
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((member) => (
                <div
                  key={member}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4140/4140061.png"
                      alt=""
                      className="w-20 h-20 rounded-full mb-4"
                    />

                    <h3 className="font-bold text-lg">
                      Team Member {member}
                    </h3>

                    <p className="text-slate-500">
                      Frontend Developer
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Apply Form
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {popupType === "leave" && (
                <>
                  <div>
                    <label className="block mb-2 font-medium">
                      Leave Type
                    </label>

                    <select
                      name="leave_type"
                      value={formData.leave_type}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-xl p-3"
                    >
                      <option value="">Select</option>

                      <option>Sick Leave</option>

                      <option>Casual Leave</option>

                      <option>Earned Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Duration
                    </label>

                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-xl p-3"
                    >
                      <option value="">Select</option>

                      <option>Full Day</option>

                      <option>Half Day</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block mb-2 font-medium">
                  From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                  rows="4"
                />
              </div>

              <div className="flex gap-4 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold"
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={closePopup}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-full font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CELEBRATION ================= */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl animate-bounce">
            <h2 className="text-3xl font-bold mb-3">
              🎉 Congratulations!
            </h2>

            <p className="text-slate-600">
              Your request is with your manager.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
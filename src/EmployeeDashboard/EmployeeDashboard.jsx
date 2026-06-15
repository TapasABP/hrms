import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { MAIN_API_URL } from "../constants/global-variables";
import logo from "./../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS, LEAVEAPPLYSTATUS, LEAVEDURATION, LEAVETYPES } from "../contstants/application";
import { toast, ToastContainer } from "react-toastify";
const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const userloginData = JSON.parse(localStorage.getItem("userData"));
  const token = userloginData?.token;
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [leavedata, setleaveData] = useState(null);
  const [otherData, setOtherData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [compOffData, setCompOffData] = useState(null);
  const [reimbursementHistory, setReimbursementHistory] = useState(null);
  const [teammembers, setTeammembers] = useState([])
  const [formData, setFormData] = useState({
    // leave_type: "",
    // duration: "",
    // fromDate: "",
    // toDate: "",
    // reason: "",
  });


  // useEffect(() => {
  //   axios.post(`${MAIN_API_URL}/leave/leave-wfh`, { user_id: userloginData?.user?.id }, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //     .then(response => {
  //       console.log("Leave Data:", response.data);
  //       const leaveHistory = response.data.history || [];
  //       const { remaining_cl, remaining_sl, remaining_el, fy_cl, fy_sl, fy_el } = response.data;
  //       setOtherData({
  //         "remaining_cl": remaining_cl || 0,
  //         "remaining_sl": remaining_sl || 0,
  //         "remaining_el": remaining_el || 0,
  //         "fy_cl": fy_cl || 0,
  //         "fy_sl": fy_sl || 0,
  //         "fy_el": fy_el || 0,
  //       })
  //       setleaveData(leaveHistory);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching leave data:", error);
  //     });

  //   axios.get(`${MAIN_API_URL}/comp/comp-off-list/${userloginData?.user?.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //     .then(response => {
  //       console.log("Comp Off Data:", response.data);
  //       const compOffHistory = response.data.data || [];


  //       setCompOffData(compOffHistory);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching leave data:", error);
  //     });


  //   axios.get(`${MAIN_API_URL}/reimbursements/reimbursements-list/${userloginData?.user?.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //     .then(response => {
  //       console.log("Reimbursement Data:", response.data);
  //       const reimbursementHistory = response.data.data || [];
  //       setReimbursementHistory(reimbursementHistory);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching reimbursement data:", error);
  //     });


  // }, [showCelebration])

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .all([

        axios.post(
          `${MAIN_API_URL}/employee/home-summary`,
          { user_id: userloginData?.user?.id },
          config
        ),

        axios.post(
          `${MAIN_API_URL}/leave/leave-wfh`,
          { user_id: userloginData?.user?.id },
          config
        ),

        axios.get(
          `${MAIN_API_URL}/comp/comp-off-list/${userloginData?.user?.id}`,
          config
        ),

        axios.get(
          `${MAIN_API_URL}/reimbursements/reimbursements-list/${userloginData?.user?.id}`,
          config
        ),
      ])
      .then(
        axios.spread(
          (userResponseData,
            leaveResponse,
            compOffResponse,
            reimbursementResponse
          ) => {
            // User Data
            const userData = userResponseData.data;
            console.log(userData, "User Data from API");
            setUserData(userData);

            // Leave Data
            const leaveData = leaveResponse.data;

            setOtherData({
              remaining_cl: leaveData.remaining_cl || 0,
              remaining_sl: leaveData.remaining_sl || 0,
              remaining_el: leaveData.remaining_el || 0,
              fy_cl: leaveData.fy_cl || 0,
              fy_sl: leaveData.fy_sl || 0,
              fy_el: leaveData.fy_el || 0,
            });

            setleaveData(leaveData.history || []);
        console.log(compOffResponse.data.data,'compOffResponse')
            // Comp Off Data
            setCompOffData(
              compOffResponse.data.data || []
            );

            // Reimbursement Data
            setReimbursementHistory(
              reimbursementResponse.data.data || []
            );
          }
        )
      )
      .catch((error) => {
        console.error("Error loading dashboard data:", error);
      });
  }, [showCelebration])
  useEffect(() => {
    if (activeTab === "team") {
      axios
        .post(
          `${MAIN_API_URL}/manager/employees`,
          { email: userloginData?.user?.email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Employee details response:", response);
          if (response.data) {

            setTeammembers(response.data.employees)
            console.log(data.department, "Department value from API");

          }
        })
        .catch((err) => {
          console.error("Error fetching employee data:", err);

        })
    }
    // else if(activeTab === "leaves"){
    //   axios
    //         .post(
    //             `${MAIN_API_URL}/reimbursements/overview`, { user_id: empId }, {
    //             "Content-Type": "application/json",
    //             headers: { Authorization: `Bearer ${token}` }
    //         }
    //         )
    //         .then((res) => {
    //             const data = res.data;
    //             console.log(data, 'leave wfh history')

    //             setReimbursementHistory(
    //                 data.requests || []
    //             );


    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }

  }, [activeTab])
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
    navigate("/login")
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

    const payload = {
      from_date: formData.fromDate,
      to_date: formData.toDate,
      reason: formData.reason,
      leave_type: formData.leave_type,
      duration: formData.duration,
      leave_wfh: popupType === "leave" ? 7000001 : 7000002,
    };

    axios
      .post(`${MAIN_API_URL}/leave/apply`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log("Leave applied successfully:", response.data);
        toast.success("Leave applied successfully!");
        setShowPopup(false);
        setFormData({
          fromDate: "",
          toDate: "",
          reason: "",
          leaveType: "",
          duration: "",
          leaveWfh: "",
        });
        // window.location.reload();
        setShowCelebration(true);

        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(
          "Error applying leave:",
          error.response?.data || error.message
        );
        toast.error(error.response?.data?.error || "Something went wrong!");
      });



  };
  const handleSubmitReimbursement = async (e) => {
    e.preventDefault();

    const payload = {
      email: userloginData?.user?.email,
      request_for: formData.requestFor,
      amount_inr: formData.amountInr,
      request_date: formData.requestDate,

    };

    axios
      .post(
        `${MAIN_API_URL}/reimbursements/apply-reimbursement`,
        payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message || "Reimbursement request submitted successfully!");
        setFormData({
          requestFor: "",
          amountInr: "",
          requestDate: "",
        });
        closePopup();
       setTimeout(()=>{
         window.location.reload();
       },2000)

        
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message || "Something went wrong!");
        const message =
          error.response?.data?.message ||
          error.message;

        console.error(message);
      });
  };
  const handleSubmitCompOff = (e) => {
    e.preventDefault();
    const payload = {
      "email": userloginData?.user?.email,
      "from_date": formData.fromDate,
      "to_date": formData.toDate,
      "original_from_date": formData.originalFromDate,
      "original_to_date": formData.originalToDate,
      "reason": formData.reason
    }

    axios
      .post(
        `${MAIN_API_URL}/comp/apply-comp-off`,
        payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message || "Comp Off request submitted successfully!");
        setFormData({});
        closePopup();
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message || "Something went wrong!");
        const message =
          error.response?.data?.message ||
          error.message;

        console.error(message);
      });
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ================= HEADER ================= */}
      <header className="bg-slate-800 text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
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

          <button style={{ cursor : 'pointer'}}
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
          <button style={{cursor:'pointer'}}
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 capitalize border-b-2 transition-all ${activeTab === tab
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
                  {userloginData?.user?.name || "John Doe"}
                </h2>

                <p className="text-slate-500">
                  {userData?.position ||
                    "-"}
                </p>

                <p className="text-slate-500">
                  {userloginData?.user?.email}
                </p>
              </div>
            </div>

            {/* LEAVE BALANCE */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-100 text-blue-700 px-6 py-4 rounded-full font-semibold">
                CL: {otherData?.remaining_cl}
              </div>

              <div className="bg-yellow-100 text-yellow-700 px-6 py-4 rounded-full font-semibold">
                SL: {otherData?.remaining_sl}
              </div>

              <div className="bg-green-100 text-green-700 px-6 py-4 rounded-full font-semibold">
                EL: {otherData?.remaining_el}
              </div>
            </div>

            {/* PANELS */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  🎂 Birthdays Today
                </h3>

                <div className="space-y-3">
                  {
                    userData?.birthdays?.length > 0 ? (
                      userData.birthdays?.map((birthday) => (
                        <div key={birthday.id} className="bg-slate-50 rounded-xl p-4">
                          {birthday.fullname} - {DEPARTMENTS.find((dpt,index)=> dpt.id == birthday.department )?.value || "N/A"}
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-4">
                        No Birthdays Today
                      </div>
                    )
                  }
                </div>
              </div>
               <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                 🚪 Who's on Leave Today
                </h3>

                <div className="space-y-3">
                 {
                    userData?.leave_today?.length > 0 ? (
                      userData.leave_today?.map((leave) => (
                        <div key={leave.id} className="bg-slate-50 rounded-xl p-4">
                          {leave.fullname} - {DEPARTMENTS.find((dpt,index)=> dpt.id == leave.department )?.value || "N/A"}
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-4">
                        No One is On Leave Today
                      </div>
                    )
                  }

                  
                </div>
              </div>
              {/* <div className="bg-white rounded-2xl shadow-sm p-6">
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
              </div> */}
            </div>
          </div>
        )}

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140061.png"
                alt="profile"
                className="w-28 h-28 rounded-full"
              />

              <div>
                <h2 className="text-3xl font-bold">
                  {userData?.fullname}
                </h2>

                <p className="text-slate-500 mt-1">
                  {userData?.position}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  {userData?.emp_code} 
                  {/* | Engineering */}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-100 p-5 rounded-xl">
                <h4 className="text-sm text-slate-500">Email</h4>
                <p className="font-semibold mt-1">
                  {userData?.email || "-"}
                </p>
              </div>

              <div className="bg-slate-100 p-5 rounded-xl">
                <h4 className="text-sm text-slate-500">Phone</h4>
                <p className="font-semibold mt-1">
                  {userData?.employee?.mobile || "-"}
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Gender</p>
                  <p className="font-medium">{userData?.employee?.gender}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="font-medium">{userData?.employee?.dob}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Blood Group</p>
                  <p className="font-medium">{userData?.employee?.blood_group || '-'}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Marital Status</p>
                  <p className="font-medium">{userData?.employee?.marital_status || '-'}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl md:col-span-2">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium">{userData?.employee?.address || '-'}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Employment Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Staff No</p>
                  <p className="font-medium">{userData?.employee?.emp_code || '-'}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="font-medium">{DEPARTMENTS.find((dpt,index)=> dpt.id == userData?.employee?.department)?.value || '-'}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Designation</p>
                  <p className="font-medium">{userData?.employee?.position || '-'}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Date of Joining</p>
                  <p className="font-medium">{userData?.joining_date || "N/A"}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl md:col-span-2">
                  <p className="text-sm text-slate-500">Reporting Manager</p>
                  <p className="font-medium">{userData?.reporting_manager || "-"}</p>
                </div>
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
                  {otherData?.remaining_cl}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 w-56">
                <h4 className="text-slate-500">
                  Sick Leaves
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {otherData?.remaining_sl}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 w-56">
                <h4 className="text-slate-500">
                  Earned Leaves
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {otherData?.remaining_el}
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <button style={{cursor:'pointer'}}
                onClick={() => openPopup("leave")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                + Apply Leave
              </button>

              <button style={{cursor:'pointer'}}
                onClick={() => openPopup("wfh")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                + Apply WFH
              </button>
              <button style={{cursor:'pointer'}}
                onClick={() => openPopup("reimbursement")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                + Apply For Reimbursement
              </button>
              <button style={{cursor:'pointer'}}
                onClick={() => openPopup("compOff")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                + Apply for Compensatory Off / Office Duty
              </button>
            </div>
            {/* TABLE FOR LEAVE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  WFH History
                </h3>
              </div>
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-4">From</th>
                    <th className="text-left p-4">To</th>
                    <th className="text-left p-4">Reason</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Rejection Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {/* <tr className="border-t">
                    <td className="p-4">01/06/2026</td>
                    <td className="p-4">02/06/2026</td>
                    <td className="p-4">Vacation</td>
                    <td className="p-4 text-green-600 font-semibold">
                      Approved
                    </td>
                  </tr> */}
                  {
                    leavedata?.filter((leave) => leave.leave_wfh === "7000002").map((leave) => (
                      <tr key={leave.id} className="border-t">
                        <td className="p-4">{new Date(leave.from_date).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(leave.to_date).toLocaleDateString()}</td>
                        <td className="p-4">{leave.reason}</td>
                        {/* <td className={`p-4 font-semibold ${
                          leave.status === 7000001
                            ? "text-blue-600"
                            : leave.status === 7000002
                              ? "text-yellow-600"
                              : leave.status === 7000003
                                ? "text-green-600"
                                : "text-red-600"
                        }`}>
                          {leave.status === 7000001
                            ? "Applied"
                            : leave.status === 7000002
                              ? "Interviewing"
                              : leave.status === 7000003
                                ? "Accepted"
                                : "Rejected"
                            }
                        </td> */}
                        <td className={`p-4 font-semibold ${(leave.status === "9000001" || leave.status === "Pending")
                          ? "text-yellow-600"
                          : leave.status === "9000002"
                            ? "text-green-600"
                            : leave.status === "9000003"
                              ? "text-red-600"
                              : ""
                          }`}>
                          {leave.status === "9000001"
                            ? "Pending"
                            : leave.status === "9000002"
                              ? "Approved"
                              : leave.status === "9000003"
                                ? "Rejected"
                                : leave.status}
                        </td>
                        <td className="p-4">{leave.reject_reason}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            {/* TABLE FOR WFH */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  Leave History
                </h3>
              </div>
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-4">From</th>
                    <th className="text-left p-4">To</th>
                    <th className="text-left p-4">Duration</th>
                    <th className="text-left p-4">Reason</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Rejection Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    leavedata?.filter((leave) => leave.leave_wfh === "7000001").map((leave) => (
                      <tr key={leave.id} className="border-t">
                        <td className="p-4">{new Date(leave.from_date).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(leave.to_date).toLocaleDateString()}</td>
                        <td className="p-4">{LEAVEDURATION.find(item => item.id == leave.duration)?.value || leave.duration}</td>
                        <td className="p-4">{leave.reason}</td>
                        <td className="p-4">{LEAVETYPES.find(item => item.id == leave.type)?.value || leave.type}</td>
                        {/* <td className={`p-4 font-semibold ${
                          leave.status === 7000001
                            ? "text-blue-600"
                            : leave.status === 7000002
                              ? "text-yellow-600"
                              : leave.status === 7000003
                                ? "text-green-600"
                                : "text-red-600"
                        }`}>
                          {leave.status === 7000001
                            ? "Applied"
                            : leave.status === 7000002
                              ? "Interviewing"
                              : leave.status === 7000003
                                ? "Accepted"
                                : "Rejected"
                            }
                        </td> */}
                        <td className={`p-4 font-semibold ${(leave.status === "9000001" || leave.status === "Pending")
                          ? "text-yellow-600"
                          : leave.status === "9000002"
                            ? "text-green-600"
                            : leave.status === "9000003"
                              ? "text-red-600"
                              : ""
                          }`}>
                          {leave.status === "9000001"
                            ? "Pending"
                            : leave.status === "9000002"
                              ? "Approved"
                              : leave.status === "9000003"
                                ? "Rejected"
                                : leave.status}
                        </td>
                        <td className="p-4">{leave.reject_reason}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Table for Comp off */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  Comp Off / Office Duty History
                </h3>
              </div>

              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-4">From</th>
                    <th className="text-left p-4">To</th>
                    <th className="text-left p-4">Original From</th>
                    <th className="text-left p-4">Original To</th>
                    <th className="text-left p-4">Reason</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Rejection Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {compOffData?.length > 0 ? (
                    compOffData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-slate-50 transition"
                      >
                        <td className="p-4">
                          {new Date(item.from_date).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          {new Date(item.to_date).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          {new Date(item.original_from_date).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          {new Date(item.original_to_date).toLocaleDateString()}
                        </td>

                        <td className="p-4">{item.reason}</td>

                        <td
                          className={`p-4 font-semibold ${item.status === "9000001"
                            ? "text-yellow-600"
                            : item.status === "9000002"
                              ? "text-green-600"
                              : item.status === "9000003"
                                ? "text-red-600"
                                : "text-slate-600"
                            }`}
                        >
                          {item.status === "9000001"
                            ? "Pending"
                            : item.status === "9000002"
                              ? "Approved"
                              : item.status === "9000003"
                                ? "Rejected"
                                : item.status}
                        </td>
                        <td className="p-4">{item.reject_reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-slate-500"
                      >
                        No Comp Off / Office Duty requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Table for Reimbursements */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  Reimbursement History
                </h3>
              </div>

              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-4">Request For</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Request Date</th>
                    {/* <th className="text-left p-4">Attachment</th> */}
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Rejection Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {reimbursementHistory?.length > 0 ? (
                    reimbursementHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-slate-50 transition"
                      >
                        <td className="p-4">
                          {item.request_for}
                        </td>

                        <td className="p-4">
                          ₹{Number(item.amount_inr).toLocaleString("en-IN")}
                        </td>

                        <td className="p-4">
                          {new Date(
                            item.request_date
                          ).toLocaleDateString()}
                        </td>

                        {/* <td className="p-4">
                          {item.attachmment ? (
                            <a
                              href={`http://localhost:3000/${item.attachmment}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View File
                            </a>
                          ) : (
                            "-"
                          )}
                        </td> */}

                        <td
                          className={`p-4 font-semibold ${item.status === "9000001"
                            ? "text-yellow-600"
                            : item.status === "9000002"
                              ? "text-green-600"
                              : item.status === "9000003"
                                ? "text-red-600"
                                : "text-slate-600"
                            }`}
                        >
                          {item.status === "9000001"
                            ? "Pending"
                            : item.status === "9000002"
                              ? "Approved"
                              : item.status === "9000003"
                                ? "Rejected"
                                : item.status}
                        </td>

                        <td className="p-4">
                          {item.reject_reason || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-slate-500"
                      >
                        No reimbursement requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TEAM ================= */}
        {activeTab === "team" && (
  <div>
    <h2 className="text-2xl font-bold mb-6">
      { teammembers.length && teammembers[0].id  ? "My Team" : ""} 
    </h2>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      { teammembers.length && teammembers[0].id ?  teammembers?.map((member) => (
        <div
          key={member.id}
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => {
            navigate(`/employee-details/${member.user_id}`);
          }}
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={
                member.gender === "Male"
                  ? "https://cdn-icons-png.flaticon.com/512/4140/4140061.png"
                  : member.gender === "Female"
                  ? "https://cdn-icons-png.flaticon.com/512/4140/4140062.png"
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={member.fullname}
              className="w-20 h-20 rounded-full mb-4"
            />

            <h3 className="font-bold text-lg text-slate-800">
              {member.fullname}
            </h3>

            <p className="text-slate-500 mb-3">
              {member.position}
            </p>

            {/* <div className="text-sm text-slate-600 space-y-1">
              <p>
                <span className="font-semibold">DOB:</span>{" "}
                {member.dob
                  ? new Date(member.dob).toLocaleDateString()
                  : "-"}
              </p>

              <p>
                <span className="font-semibold">Joining Date:</span>{" "}
                {member.joining_date
                  ? new Date(member.joining_date).toLocaleDateString()
                  : "-"}
              </p>
            </div> */}
          </div>
        </div>
      )) :      <h2 className="text-2xl font-bold mb-6">No team members to display.</h2>}
    </div>
  </div>
)}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (popupType === "wfh" || popupType === "leave") && (
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center overflow-y-auto z-50 p-4">
          <div class="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl my-8 max-h-[80vh] overflow-y-auto">
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
                      required
                    >
                      <option value="">Select</option>

                      {
                        LEAVETYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.value}
                          </option>
                        ))
                      }
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
                      required
                    >
                      <option value="">Select</option>

                      {
                        LEAVEDURATION.map((duration) => (
                          <option key={duration.id} value={duration.id}>
                            {duration.value}
                          </option>
                        ))
                      }
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
                  required
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
                  required
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
                  required
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

      {showPopup && (popupType === "reimbursement") && (

        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center overflow-y-auto z-50 p-4">
          <div class="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl my-8 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Apply for Reimbursement
            </h2>


            <form
              onSubmit={handleSubmitReimbursement}
              className="space-y-5"
            >
              <div>
                <label className="block mb-2 font-medium">
                  Request For
                </label>

                <input
                  type="text"
                  name="requestFor"
                  value={formData.requestFor}
                  onChange={handleChange}
                  placeholder="Cab, Mobile Bill etc."
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Amount (INR)
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="amountInr"
                  value={formData.amountInr}
                  onChange={handleChange}
                  placeholder="1000.50"
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Request Date
                </label>

                <input
                  type="date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
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
                  rows="4"
                  placeholder="Provide details for reimbursement request..."
                  className="w-full border border-slate-300 rounded-xl p-3"
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

      {showPopup && popupType === "compOff" && (
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center overflow-y-auto z-50 p-4">
          <div class="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl my-8 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Apply for Comp Off / Office Duty
            </h2>

            <form
              onSubmit={handleSubmitCompOff}
              className="space-y-5"
            >
              <div>
                <label className="block mb-2 font-medium">
                  Comp Off / Office Duty From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Comp Off / Office Duty To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Original Leave From Date
                </label>

                <input
                  type="date"
                  name="originalFromDate"
                  value={formData.originalFromDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Original Leave To Date
                </label>

                <input
                  type="date"
                  name="originalToDate"
                  value={formData.originalToDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
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
                  rows={4}
                  placeholder="Enter reason for Comp Off / Office Duty..."
                  className="w-full border border-slate-300 rounded-xl p-3 resize-none"
                  required
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
      <ToastContainer />
    </div>
  );
};

export default EmployeeDashboard;
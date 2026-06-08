import { useState, useEffect, use } from "react";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { useParams } from "react-router-dom";
import { MAIN_API_URL } from "../constants/global-variables";
import { toast, ToastContainer } from "react-toastify";
import { LEAVEAPPLYSTATUS } from "../contstants/application";

const EmployeeDetails = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const { empId } = useParams()
    console.log(empId, 'empId')
    const [activeTab, setActiveTab] = useState("profile");
    const [reason, setReason] = useState("");
    const [profile, setProfile] = useState(null);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [wfhHistory, setWfhHistory] = useState([]);
    const [reimbursementHistory, setReimbursementHistory] = useState([]);
    const [compOffHistory, setCompOffHistory] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [employee, setEmployee] = useState(null);
    console.log(selectedRow, 'selectedRow')
    const closeAddModal = () => {
        setShowAddModal(false);
        setReason("");
    };
    const openAddModal = (data) => {
        console.log(data, 'dattaaaaaaaa');

        if (data.action === 9000002) {
            handleLeaveWfhAccept({ leave_id: data.leave_id, action: 9000002 })
        } else {
            setShowAddModal(true);
            setSelectedRow(data);
        }
    };
    const openReimbursementModal = (data) => {
        console.log(data, 'dattaaaaaaaa');

        if (data.action === 9000002) {
            handleReimbursementAccept({ leave_id: data.leave_id, action: 9000002 })
        } else {
            setShowAddModal(true);
            setSelectedRow(data);
        }
    };
    const openCompOffModal = (data) => {
        console.log(data, 'dattaaaaaaaa');

        if (data.action === 9000002) {
            handleCompOffAccept({ leave_id: data.leave_id, action: 9000002 })
        } else {
            setShowAddModal(true);
            setSelectedRow(data);
        }
    };
    const formatDate = (date) => {
        if (!date) return "-";

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    useEffect(() => {
        if (!empId) return;


        if (activeTab === "profile") {
            loadEmployeeProfile();
        } else if (activeTab === "leave" || activeTab === "wfh") {
            loadLeaveWFHHistory();
        } else if (activeTab === "reimbursement") {
            loadReimbursementHistory();
        } else if (activeTab === "compOff") {
            loadCompOffHistory();
        }
    }, [activeTab]);

    const loadEmployeeProfile = () => {
        axios
            .post(
                `${MAIN_API_URL}/employee/home-summary`, { user_id: empId }, {
                "Content-Type": "application/json",
                headers: { Authorization: `Bearer ${token}` }
            }
            )
            .then((res) => {
                setEmployee(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    //     axios
    //       .get(
    //         `http://localhost:3000/api/employee/profile/${employee.user_id}`
    //       )
    //       .then((res) => {
    //         setProfile(res.data);
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //       });
    //   };

    const loadLeaveWFHHistory = () => {
        axios
            .post(
                `${MAIN_API_URL}/leave/leave-wfh`, { user_id: empId }, {
                "Content-Type": "application/json",
                headers: { Authorization: `Bearer ${token}` }
            }
            )
            .then((res) => {
                const data = res.data;
                console.log(data, 'leave wfh history')
                setLeaveHistory(
                    data.history?.filter(
                        (item) => item.leave_wfh === "7000001"
                    ) || []
                );

                setWfhHistory(
                    data.history?.filter(
                        (item) => item.leave_wfh === "7000002"
                    ) || []
                );

                setReimbursementHistory(
                    data.reimbursement_history || []
                );

                setCompOffHistory(
                    data.comp_off_history || []
                );
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const loadCompOffHistory = () => {
        axios
            .get(
                `${MAIN_API_URL}/comp/comp-off-list/${empId}`, {
                "Content-Type": "application/json",
                headers: { Authorization: `Bearer ${token}` }
            }
            )
            .then((res) => {
                const data = res.data;
                console.log(data, 'comp-off history')

                setCompOffHistory(
                    data.data || []
                );
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const loadReimbursementHistory = () => {
        axios
            .get(
                `${MAIN_API_URL}/reimbursements/reimbursements-list/${empId}`, {
                "Content-Type": "application/json",
                headers: { Authorization: `Bearer ${token}` }
            }
            )
            .then((res) => {
                const data = res.data.data;
                console.log(data, 'leave wfh history')

                setReimbursementHistory(
                    data || []
                );


            })
            .catch((err) => {
                console.error(err);
            });
    };
    const updateLeaveAction = (
        endpoint,
        payload,
        successMessage
    ) => {
        axios
            .post(endpoint, payload)
            .then((res) => {
                alert(res.data.message || successMessage);
                loadLeaveWFHHistory();
            })
            .catch((err) => {
                alert(
                    err.response?.data?.error ||
                    "Something went wrong"
                );
            });
    };

    const handleLeaveWfhRejection = (e) => {
        e.preventDefault();
        const payload = {
            leave_id: selectedRow.leave_id,
            action: selectedRow.action,
            reject_reason: reason
        };

        axios.post(
            `${MAIN_API_URL}/leave/leave-action`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log("Success:", response.data);
                // toast.success(response.data.message || "Action updated successfully");
                toast.success("Request rejected.")
                closeAddModal();
                loadLeaveWFHHistory();
            })
            .catch((error) => {
                console.error("API Error:", error);

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong";

                toast.error(message);
            });
    };

    const handleReimbursementAccept = ({ leave_id, action }) => {
        const payload = {
            "reimbursement_id": leave_id,
            "action": "Accepted",
            "reject_reason": ""
        }

        axios.post(
            `${MAIN_API_URL}/reimbursements/reimbursement-action`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log("Success:", response.data);
                toast.success(response.data.message || "Action updated successfully");
                closeAddModal();
                loadReimbursementHistory();
            })
            .catch((error) => {
                console.error("API Error:", error);

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong";

                toast.error(message);
            });
    };
    const handleCompOffAccept = ({ leave_id, action }) => {
        const payload = {
            "comp_off_id": leave_id,
            "action": "Accepted",
            "reject_reason": ""
        }

        axios.post(
            `${MAIN_API_URL}/comp/comp-off-action`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log("Success:", response.data);
                // toast.success(response.data.message || "Action updated successfully");
                toast.success("Request accepted.");
                closeAddModal();
                loadCompOffHistory();
            })
            .catch((error) => {
                console.error("API Error:", error);

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong";

                toast.error(message);
            });
    };
    const handleCompOffReject = (e) => {
        e.preventDefault();
        const payload = {
            "comp_off_id": selectedRow.leave_id,
            "action": "Rejected",
            "reject_reason": reason
        }

        axios.post(
            `${MAIN_API_URL}/comp/comp-off-action`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log("Success:", response.data);
                // toast.success(response.data.message || "Action updated successfully");
                toast.success("Request rejected.");
                closeAddModal();
                loadCompOffHistory();
            })
            .catch((error) => {
                console.error("API Error:", error);

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong";

                toast.error(message);
            });
    };
    const handleReimbursementReject = (e) => {
        e.preventDefault();
        const payload = {
            "reimbursement_id": selectedRow?.leave_id,
            "action": "Rejected",
            "reject_reason": reason
        }

        axios.post(
            `${MAIN_API_URL}/reimbursements/reimbursement-action`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log("Success:", response.data);
                toast.success(response.data.message || "Action updated successfully");
                closeAddModal();
                loadReimbursementHistory();
            })
            .catch((error) => {
                console.error("API Error:", error);

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong";

                toast.error(message);
            });
    };

    const handleCompOffAction = (
        id,
        action
    ) => {
        let rejectReason = "";

        if (action === "Rejected") {
            rejectReason =
                prompt("Enter rejection reason") || "";
        }

        updateLeaveAction(
            "http://localhost:3000/api/employee/comp-off-action",
            {
                comp_off_id: id,
                action,
                reject_reason: rejectReason,
            },
            "Comp Off updated"
        );
    };
    const handleLeaveWfhAccept = ({ leave_id, action }) => {
        const payload = {
            leave_id: leave_id,
            action: action,
            reject_reason: ''
        };

        axios.post(
            `${MAIN_API_URL}/leave/leave-action`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log("Success:", response.data);
                // toast.success(response.data.message || "Action updated successfully");
                toast.success("Request accepted.")
                // closeAddModal();
                loadLeaveWFHHistory();
            })
            .catch((error) => {
                console.error("API Error:", error);

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong";

                toast.error(message);
            });
    };
    const StatusChip = ({ status }) => {
        console.log(status, 'statusss')
        const styles = {
            "9000001":
                "bg-yellow-100 text-yellow-700",
            "9000002":
                "bg-green-100 text-green-700",
            "9000003":
                "bg-red-100 text-red-700",
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
            >
                {LEAVEAPPLYSTATUS.find((s) => s.id == status)?.value || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-slate-800 text-white px-8 py-5">
                <h2 className="text-2xl font-semibold">
                    Employee Details
                </h2>
            </div>

            <div className="bg-white border-b flex flex-wrap">
                {[
                    ["profile", "Profile"],
                    ["leave", "Leave Requests"],
                    ["wfh", "WFH Requests"],
                    ["reimbursement", "Reimbursement"],
                    ["compOff", "Comp Off / Office Duty"],
                ].map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-6 py-4 font-medium border-b-2 transition ${activeTab === key
                            ? "border-slate-800 text-slate-800"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="p-8">
                {activeTab === "profile" && (
                    // <>Profile</>
                    <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col lg:flex-row gap-8">
                        <div className="w-60 text-center">
                            <img
                                src={
                                    employee?.profile_photo ||
                                    (employee?.gender?.toLowerCase() ===
                                        "female"
                                        ? "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
                                        : "https://cdn-icons-png.flaticon.com/512/4140/4140061.png")
                                }
                                alt=""
                                className="w-40 h-40 rounded-xl object-cover border mx-auto"
                            />

                            <h3 className="text-xl font-semibold mt-4">
                                {employee?.fullname}
                            </h3>

                            <p className="text-slate-600">
                                {employee?.position}
                            </p>

                            <p className="text-slate-500">
                                {employee?.department}
                            </p>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="font-medium">
                                        Email
                                    </p>
                                    <p>{employee?.email}</p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Mobile
                                    </p>
                                    <p>{employee?.mobile}</p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        DOB
                                    </p>
                                    <p>
                                        {formatDate(employee?.dob)}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Joining Date
                                    </p>
                                    <p>
                                        {formatDate(
                                            employee?.joining_date
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border rounded-xl p-4">
                                <h4 className="font-semibold mb-2">
                                    About
                                </h4>
                                <p>{employee?.about || "-"}</p>
                            </div>

                            <div className="bg-slate-50 border rounded-xl p-4">
                                <h4 className="font-semibold mb-2">
                                    Hobbies
                                </h4>
                                <p>{employee?.hobbies || "-"}</p>
                            </div>
                        </div>
                    </div>
                )
                }

                {activeTab === "leave" && (
                    <HistoryTable
                        data={leaveHistory}
                        type="leave"
                        onAction={openAddModal}
                        formatDate={formatDate}
                        StatusChip={StatusChip}
                    />
                )}

                {activeTab === "wfh" && (
                    <HistoryTable
                        data={wfhHistory}
                        type="wfh"
                        onAction={openAddModal}
                        formatDate={formatDate}
                        StatusChip={StatusChip}
                    />
                )}

                {activeTab === "reimbursement" && (
                    <HistoryTable
                        data={reimbursementHistory}
                        type="reimbursement"
                        onAction={openReimbursementModal}
                        formatDate={formatDate}
                        StatusChip={StatusChip}
                    />
                )}

                {activeTab === "compOff" && (
                    <HistoryTable
                        data={compOffHistory}
                        type="compOff"
                        onAction={openCompOffModal}
                        formatDate={formatDate}
                        StatusChip={StatusChip}
                    />
                )}
            </div>
            <ToastContainer />
            {/* Reject leave/wfh Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex bg-black/50 justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {activeTab === "leave" || activeTab === "wfh"
                                ? "Reject Leave/WFH"
                                : (activeTab === "reimbursement") ? "Reject Reimbursement" : ""
                            }
                        </h2>

                        <form
                            onSubmit={
                                (activeTab === "leave" || activeTab === "wfh") ? handleLeaveWfhRejection : (activeTab === "reimbursement") ? handleReimbursementReject : handleCompOffReject
                            }
                        >


                            <input
                                type="text"
                                name="type_reason"
                                placeholder="Type Reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            />




                            <div className="flex justify-end gap-2">
                                <button style={{ cursor: "pointer" }}
                                    type="button"
                                    onClick={
                                        closeAddModal
                                    }
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button style={{ cursor: "pointer" }}
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Reject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetails;
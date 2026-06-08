import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MAIN_API_URL } from "../../constants/global-variables";
import axios from "axios";
import { DEPARTMENTS, LEAVEAPPLYSTATUS } from "../../contstants/application";

const Reimbursements = () => {
  const [reimbursements, setReimbursements] = useState();
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([])
  const userData = JSON.parse(
    localStorage.getItem("userData") || "{}"
  );
  const token = userData?.token;

  const orgId = userData?.user?.org_id;

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

  const fmtDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString(
      "en-GB"
    );
  };

  const fmtDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString(
      "en-GB"
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "9000001":
        return "Pending";
      case "9000002":
        return "Approved";
      case "9000003":
        return "Rejected";
      default:
        return status;
    }
  };
 const closeModal = () => {
    setShowModal(false);
    setRequests([])
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "9000001":
        return "bg-yellow-100 text-yellow-700";
      case "9000002":
        return "bg-green-100 text-green-700";
      case "9000003":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
console.log(showModal,'showModal')
  const loadReimbursements = () => {
    setLoading(true);





    const payload = {
      "month": month,
      "year": year?.toString(),
      "department": deptFilter
    }
    axios
      .post(`${MAIN_API_URL}/reimbursements/overview`, payload, {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const requests =
          response?.data?.requests ||
          response?.data ||
          [];

        setReimbursements(requests);

        const deptSet = new Set();

        requests.forEach((item) => {
          if (item.department) {
            deptSet.add(item.department);
          }
        });

        setDepartments(
          Array.from(deptSet).sort()
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load reimbursements:",
          error?.response?.data || error.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const employeeReimbursementDetails = (userId) => {
    setDetailsLoading(true);

    axios
      .get(
        `${MAIN_API_URL}/reimbursements/reimbursements-list/${userId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {

        setRequests(response.data.data)
        setShowModal(true);
      })
      .catch((error) => {
        console.error(
          "Failed to load employee details:",
          error
        );
      })
      .finally(() => {
        setDetailsLoading(false);
      });
  };
  useEffect(() => {

    loadReimbursements();

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Reimbursement History
        </h1>

        <Link
          to="/hr-dashboard"
          className="underline text-sm"
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Department */}
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Department
              </label>

              <select
                value={deptFilter}
                onChange={(e) =>
                  setDeptFilter(
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">
                  All Departments
                </option>

                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Year
              </label>

              <select
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-2 text-sm"
              >
                {years.map((yr) => (
                  <option
                    key={yr}
                    value={yr}
                  >
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Month
              </label>

              <select
                value={month}
                onChange={(e) =>
                  setMonth(
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">
                  All Months
                </option>

                {months.map((m) => (
                  <option
                    key={m.value}
                    value={m.value}
                  >
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply */}
            <div>
              <button
                onClick={
                  loadReimbursements
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3 text-left">
                    Employee
                  </th>

                  <th className="p-3 text-left">
                    Department
                  </th>

                  <th className="p-3 text-left">
                    Request For
                  </th>

                  <th className="p-3 text-left">
                    Amount
                  </th>

                  <th className="p-3 text-left">
                    Request Date
                  </th>

                  <th className="p-3 text-left">
                    Status
                  </th>

                  <th className="p-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-6"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : reimbursements?.length >
                  0 ? (
                  reimbursements?.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-3 font-medium">
                          {
                            item.fullname
                          }
                        </td>

                        <td className="p-3">
                          {
                            item.department
                          }
                        </td>

                        <td className="p-3">
                          {
                            item.request_for
                          }
                        </td>

                        <td className="p-3 font-semibold">
                          ₹
                          {
                            item.amount_inr
                          }
                        </td>

                        <td className="p-3">
                          {fmtDate(
                            item.request_date
                          )}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {getStatusLabel(
                              item.status
                            )}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              employeeReimbursementDetails(
                                item.user_id
                              )
                            }
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-6 text-slate-500"
                    >
                      No reimbursement
                      records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {
        showModal && 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Request History</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <div className="overflow-auto max-h-[60vh] border rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">Request For</th>
                  <th className="p-2 text-left">Amount (INR)</th>
                  <th className="p-2 text-left">Request Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Reject Reason</th>
                </tr>
              </thead>
              <tbody>
                {requests?.length > 0 ? (
                  requests.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.request_for}</td>
                      <td className="p-2">{item.amount_inr}</td>
                      <td className="p-2">{new Date(item.request_date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.status === "9000002"
                              ? "bg-green-100 text-green-700"
                              : item.status === "9000003"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {LEAVEAPPLYSTATUS.find((status) => status.id == item.status)?.value || item.status}
                        </span>
                      </td>
                      <td className="p-2">{item.reject_reason || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500">
                      No request history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
      }
    </div>
  );
};

export default Reimbursements;
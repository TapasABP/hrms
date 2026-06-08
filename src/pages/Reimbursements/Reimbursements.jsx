import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MAIN_API_URL } from "../../constants/global-variables";
import axios from "axios";
import { DEPARTMENTS } from "../../contstants/application";

const Reimbursements = () => {
  const [reimbursements, setReimbursements] = useState([
    {
      "id": 22,
      "user_id": 4,
      "fullname": "Pappu Da",
      "department": "1000002",
      "request_for": "Internet bill 2121",
      "amount_inr": "1222.00",
      "request_date": "2026-06-19",
      "status": "9000003",
      "reject_reason": "not possible",
      "created_at": "2026-06-04 08:19:07"
    },
    {
      "id": 21,
      "user_id": 4,
      "fullname": "Pappu Da",
      "department": "1000002",
      "request_for": "Internet bill 2344",
      "amount_inr": "670.00",
      "request_date": "2026-06-18",
      "status": "9000003",
      "reject_reason": "Not logical for now.",
      "created_at": "2026-06-04 08:08:44"
    }]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedReimbursement, setSelectedReimbursement] =
    useState(null);

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
                ) : reimbursements.length >
                  0 ? (
                  reimbursements.map(
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
                              setSelectedReimbursement(
                                item
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

      {/* View Modal */}
      {selectedReimbursement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-semibold">
                Reimbursement Details
              </h2>

              <button
                onClick={() =>
                  setSelectedReimbursement(
                    null
                  )
                }
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="font-semibold">
                  Employee:
                </span>{" "}
                {
                  selectedReimbursement.fullname
                }
              </div>

              <div>
                <span className="font-semibold">
                  Department:
                </span>{" "}
                {
                  selectedReimbursement.department
                }
              </div>

              <div>
                <span className="font-semibold">
                  Request For:
                </span>{" "}
                {
                  selectedReimbursement.request_for
                }
              </div>

              <div>
                <span className="font-semibold">
                  Amount:
                </span>{" "}
                ₹
                {
                  selectedReimbursement.amount_inr
                }
              </div>

              <div>
                <span className="font-semibold">
                  Request Date:
                </span>{" "}
                {fmtDate(
                  selectedReimbursement.request_date
                )}
              </div>

              <div>
                <span className="font-semibold">
                  Status:
                </span>{" "}
                {getStatusLabel(
                  selectedReimbursement.status
                )}
              </div>

              {selectedReimbursement.reject_reason && (
                <div>
                  <span className="font-semibold">
                    Reject Reason:
                  </span>

                  <div className="mt-1 p-3 bg-red-50 rounded-lg text-red-700">
                    {
                      selectedReimbursement.reject_reason
                    }
                  </div>
                </div>
              )}

              <div>
                <span className="font-semibold">
                  Created At:
                </span>{" "}
                {fmtDateTime(
                  selectedReimbursement.created_at
                )}
              </div>
            </div>

            <div className="p-5 border-t flex justify-end">
              <button
                onClick={() =>
                  setSelectedReimbursement(
                    null
                  )
                }
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reimbursements;
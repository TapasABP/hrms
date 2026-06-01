import React, {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

const Reimbursements = () => {
  const [reimbursements, setReimbursements] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [deptFilter, setDeptFilter] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==================================
  // USER DATA
  // ==================================

  const userData = JSON.parse(
    localStorage.getItem(
      "ZeroUserData"
    ) || "{}"
  );

  const orgId =
    userData?.user?.org_id;

  // ==================================
  // FORMAT DATE
  // ==================================

  const fmtDate = (value) => {
    return value
      ? new Date(
          value
        ).toLocaleDateString(
          "en-GB"
        )
      : "-";
  };

  // ==================================
  // FETCH REIMBURSEMENTS
  // ==================================

  const loadReimbursements =
    async () => {
      try {
        setLoading(true);

        const params =
          new URLSearchParams({
            org_id: orgId,
          });

        if (deptFilter) {
          params.set(
            "department",
            deptFilter
          );
        }

        const res =
          await fetch(
            `http://localhost:3000/api/reimbursements/overview?${params.toString()}`
          );

        const data =
          await res.json();

        const requests =
          data?.requests || [];

        setReimbursements(
          requests
        );

        // Extract departments
        const deptSet =
          new Set();

        requests.forEach(
          (r) => {
            if (
              r.department
            ) {
              deptSet.add(
                r.department
              );
            }
          }
        );

        setDepartments(
          Array.from(
            deptSet
          ).sort()
        );
      } catch (err) {
        console.error(
          "Failed to load reimbursements:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  // ==================================
  // INITIAL LOAD
  // ==================================

  useEffect(() => {
    if (orgId) {
      loadReimbursements();
    }
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          Reimbursement History
        </h1>

        <Link
          to="/hr-dashboard"
          className="text-sm underline"
        >
          Back to Dashboard
        </Link>
      </header>

      {/* Main */}
      <main className="p-6 max-w-6xl mx-auto">
        {/* Filter Card */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-xs text-slate-600">
                Department
              </label>

              <select
                value={
                  deptFilter
                }
                onChange={(e) =>
                  setDeptFilter(
                    e.target.value
                  )
                }
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">
                  All Departments
                </option>

                {departments.map(
                  (dept) => (
                    <option
                      key={dept}
                      value={dept}
                    >
                      {dept}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <button
                onClick={
                  loadReimbursements
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3">
                  Employee
                </th>

                <th className="p-3">
                  Department
                </th>

                <th className="p-3">
                  Request For
                </th>

                <th className="p-3">
                  Amount (INR)
                </th>

                <th className="p-3">
                  Date
                </th>

                <th className="p-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : reimbursements.length >
                0 ? (
                reimbursements.map(
                  (
                    reimbursement,
                    index
                  ) => (
                    <tr
                      key={
                        reimbursement.id ||
                        index
                      }
                      className="border-b"
                    >
                      <td className="p-3">
                        {reimbursement.fullname ||
                          "-"}
                      </td>

                      <td className="p-3">
                        {reimbursement.department ||
                          "-"}
                      </td>

                      <td className="p-3">
                        {reimbursement.request_for ||
                          "-"}
                      </td>

                      <td className="p-3">
                        ₹
                        {reimbursement.amount_inr ||
                          0}
                      </td>

                      <td className="p-3">
                        {fmtDate(
                          reimbursement.request_date
                        )}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium
                          ${
                            reimbursement.status ===
                            "Approved"
                              ? "bg-green-100 text-green-700"
                              : reimbursement.status ===
                                "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            reimbursement.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6 text-slate-500"
                  >
                    No reimbursement
                    history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Reimbursements;
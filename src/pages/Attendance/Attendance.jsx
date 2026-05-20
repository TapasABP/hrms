import React, {
  useEffect,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const Attendance = () => {
  // =====================================
  // STATES
  // =====================================

  const [attendanceData, setAttendanceData] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [deptFilter, setDeptFilter] =
    useState("");

  const [fromDate, setFromDate] =
    useState(null);

  const [toDate, setToDate] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedEmployeeName, setSelectedEmployeeName] =
    useState("");

  const [leaveWfhHistory, setLeaveWfhHistory] =
    useState([]);

  const [compOffHistory, setCompOffHistory] =
    useState([]);

  // =====================================
  // USER DATA
  // =====================================

  const userData = JSON.parse(
    localStorage.getItem(
      "ZeroUserData"
    ) || "{}"
  );

  const orgId =
    userData?.user?.org_id;

  // =====================================
  // FORMAT DATE
  // =====================================

  const fmtDate = (value) => {
    if (!value) return "-";

    return new Date(
      value
    ).toLocaleDateString(
      "en-GB"
    );
  };

  const formatApiDate = (
    date
  ) => {
    if (!date) return "";

    return date
      .toISOString()
      .split("T")[0];
  };

  // =====================================
  // LOAD OVERVIEW
  // =====================================

  const loadOverview =
    async () => {
      try {
        setLoading(true);

        const params =
          new URLSearchParams({
            org_id: orgId,
          });

        if (fromDate) {
          params.set(
            "from_date",
            formatApiDate(
              fromDate
            )
          );
        }

        if (toDate) {
          params.set(
            "to_date",
            formatApiDate(
              toDate
            )
          );
        }

        if (deptFilter) {
          params.set(
            "department",
            deptFilter
          );
        }

        const res =
          await fetch(
            `http://localhost:3000/api/attendance/overview?${params.toString()}`
          );

        const data =
          await res.json();

        const employees =
          data?.employees ||
          [];

        setAttendanceData(
          employees
        );

        // Department list
        const deptSet =
          new Set();

        employees.forEach(
          (emp) => {
            if (
              emp.department
            ) {
              deptSet.add(
                emp.department
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
          "Failed to fetch attendance overview:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================
  // LOAD EMPLOYEE HISTORY
  // =====================================

  const loadEmployeeHistory =
    async (
      userId,
      fullname
    ) => {
      try {
        const params =
          new URLSearchParams(
            {
              user_id:
                userId,
            }
          );

        if (fromDate) {
          params.set(
            "from_date",
            formatApiDate(
              fromDate
            )
          );
        }

        if (toDate) {
          params.set(
            "to_date",
            formatApiDate(
              toDate
            )
          );
        }

        const res =
          await fetch(
            `http://localhost:3000/api/attendance/employee-history?${params.toString()}`
          );

        const data =
          await res.json();

        setSelectedEmployeeName(
          fullname
        );

        setLeaveWfhHistory(
          data?.leave_wfh_history ||
            []
        );

        setCompOffHistory(
          data?.comp_off_history ||
            []
        );

        setShowModal(
          true
        );
      } catch (err) {
        console.error(
          "Failed to load employee history:",
          err
        );
      }
    };

  // =====================================
  // CLOSE MODAL
  // =====================================

  const closeHistory =
    () => {
      setShowModal(
        false
      );

      setLeaveWfhHistory(
        []
      );

      setCompOffHistory(
        []
      );
    };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    if (orgId) {
      loadOverview();
    }
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          Attendance
          Overview
        </h1>

        <Link
          to="/dashboard"
          className="text-sm underline"
        >
          Back to
          Dashboard
        </Link>
      </header>

      {/* Main */}
      <main className="p-6 max-w-6xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h2 className="font-semibold mb-3">
            Filters
          </h2>

          <div className="grid md:grid-cols-4 gap-3">
            {/* From Date */}
            <div>
              {/* <label className="text-xs text-slate-600">
                From Date
              </label> */}

              <DatePicker
                selected={
                  fromDate
                }
                onChange={(
                  date
                ) =>
                  setFromDate(
                    date
                  )
                }
                placeholderText="Select Date"
                dateFormat="dd/MM/yyyy"
                className="w-full border rounded p-2 text-sm"
              />
            </div>

            {/* To Date */}
            <div>
              {/* <label className="text-xs text-slate-600">
                To Date
              </label> */}

              <DatePicker
                selected={
                  toDate
                }
                onChange={(
                  date
                ) =>
                  setToDate(
                    date
                  )
                }
                placeholderText="Select Date"
                dateFormat="dd/MM/yyyy"
                className="w-full border rounded p-2 text-sm"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-xs text-slate-600">
                Department
              </label>

              <select
                value={
                  deptFilter
                }
                onChange={(
                  e
                ) =>
                  setDeptFilter(
                    e
                      .target
                      .value
                  )
                }
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">
                  All
                  Departments
                </option>

                {departments.map(
                  (
                    dept
                  ) => (
                    <option
                      key={
                        dept
                      }
                      value={
                        dept
                      }
                    >
                      {dept}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Apply */}
            <div className="flex items-end">
              <button
                onClick={
                  loadOverview
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <h2 className="font-semibold mb-3">
            All Employees
            Attendance
            Snapshot
          </h2>

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
                  Leave
                  Requests
                </th>
                <th className="p-3">
                  WFH
                  Requests
                </th>
                <th className="p-3">
                  Comp Off
                  / Office
                  Duty
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : attendanceData.length >
                0 ? (
                attendanceData.map(
                  (
                    row,
                    index
                  ) => (
                    <tr
                      key={
                        row.user_id ||
                        index
                      }
                      className="border-b hover:bg-slate-50 cursor-pointer"
                      onClick={() =>
                        loadEmployeeHistory(
                          row.user_id,
                          row.fullname
                        )
                      }
                    >
                      <td className="p-3">
                        {row.fullname ||
                          "-"}
                      </td>

                      <td className="p-3">
                        {row.department ||
                          "-"}
                      </td>

                      <td className="p-3">
                        {row.leave_count ||
                          0}
                      </td>

                      <td className="p-3">
                        {row.wfh_count ||
                          0}
                      </td>

                      <td className="p-3">
                        {row.comp_off_count ||
                          0}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-slate-500"
                  >
                    No
                    attendance
                    records
                    found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* History Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-5xl rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                {
                  selectedEmployeeName
                }{" "}
                - Full
                Attendance
                History
              </h3>

              <button
                onClick={
                  closeHistory
                }
                className="px-3 py-1 bg-slate-700 text-white rounded"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Leave WFH */}
              <div>
                <h4 className="font-medium mb-2">
                  Leave &
                  WFH
                </h4>

                <div className="max-h-72 overflow-auto border rounded">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2">
                          Type
                        </th>
                        <th className="p-2">
                          From
                        </th>
                        <th className="p-2">
                          To
                        </th>
                        <th className="p-2">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaveWfhHistory.map(
                        (
                          item,
                          index
                        ) => (
                          <tr
                            key={
                              index
                            }
                            className="border-b"
                          >
                            <td className="p-2">
                              {
                                item.leave_wfh
                              }
                            </td>

                            <td className="p-2">
                              {fmtDate(
                                item.from_date
                              )}
                            </td>

                            <td className="p-2">
                              {fmtDate(
                                item.to_date
                              )}
                            </td>

                            <td className="p-2">
                              {
                                item.status
                              }
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comp Off */}
              <div>
                <h4 className="font-medium mb-2">
                  Comp Off
                  / Office
                  Duty
                </h4>

                <div className="max-h-72 overflow-auto border rounded">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2">
                          From
                        </th>
                        <th className="p-2">
                          To
                        </th>
                        <th className="p-2">
                          Original
                        </th>
                        <th className="p-2">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {compOffHistory.map(
                        (
                          item,
                          index
                        ) => (
                          <tr
                            key={
                              index
                            }
                            className="border-b"
                          >
                            <td className="p-2">
                              {fmtDate(
                                item.from_date
                              )}
                            </td>

                            <td className="p-2">
                              {fmtDate(
                                item.to_date
                              )}
                            </td>

                            <td className="p-2">
                              {fmtDate(
                                item.original_from_date
                              )}{" "}
                              -
                              {" "}
                              {fmtDate(
                                item.original_to_date
                              )}
                            </td>

                            <td className="p-2">
                              {
                                item.status
                              }
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
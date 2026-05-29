import React from "react";
import { TableHead, TableCell } from "./Leave";
import { LEAVEDURATION, LEAVETYPES } from "../contstants/application";

const LeaveHistory = ({leavehistory , otherData}) => {
    console.log(leavehistory,'leavehistory')
  // API Response
  
  return (
    <>
      {/* Leave History */}
      <section className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              My Leave History
            </h2>

            <div className="flex gap-4 text-sm">
              <span className="bg-slate-100 px-3 py-1 rounded-lg">
                CL: {otherData?.fy_cl}
              </span>

              <span className="bg-slate-100 px-3 py-1 rounded-lg">
                SL: {otherData?.fy_sl}
              </span>

              <span className="bg-slate-100 px-3 py-1 rounded-lg">
                EL: {otherData?.fy_el}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                </tr>
              </thead>

              <tbody>
                {leavehistory?.length > 0 ? (
                  leavehistory.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b last:border-none"
                    >
                      <TableCell>
                        {entry.from_date}
                      </TableCell>

                      <TableCell>
                        {entry.to_date}
                      </TableCell>

                      <TableCell>
                        {LEAVEDURATION.find(
                          (duration) =>
                            duration.id.toString() ===
                            entry.duration.toString()
                        )?.value || entry.duration}
                      </TableCell>

                      <TableCell>
                        {LEAVETYPES.find(
                          (type) =>
                            type.id.toString() ===
                            entry.type.toString()
                        )?.value || entry.type}
                      </TableCell>

                      <TableCell>
                        {entry.reason}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-semibold ${
                            entry.status.toLowerCase() ===
                            "accepted"
                              ? "text-green-600"
                              : entry.status.toLowerCase() ===
                                "rejected"
                              ? "text-red-600"
                              : "text-amber-500"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        {entry.created_at}
                      </TableCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-slate-500"
                    >
                      No leave history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default LeaveHistory;
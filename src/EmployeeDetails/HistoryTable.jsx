import { LEAVEDURATION, LEAVETYPES } from "../contstants/application";

function HistoryTable  ({
  data,
  type,
  onAction,
  formatDate,
  StatusChip,
})  {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              {type === "leave" && (
                <>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </>
              )}

              {type === "wfh" && (
                <>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </>
              )}

              {type === "reimbursement" && (
                <>
                  <th className="px-4 py-3 text-left">
                    Request For
                  </th>
                  <th className="px-4 py-3 text-left">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left">
                    Action
                  </th>
                </>
              )}

              {type === "compOff" && (
                <>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-left">
                    Original From
                  </th>
                  <th className="px-4 py-3 text-left">
                    Original To
                  </th>
                  <th className="px-4 py-3 text-left">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left">
                    Action
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-6 text-slate-500"
                >
                  No Records Found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t"
                >
                  {type === "leave" && (
                    <>
                      <td className="px-4 py-3">
                        {formatDate(item.from_date)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(item.to_date)}
                      </td>
                      <td className="px-4 py-3">
                        
                        {LEAVETYPES.find(
                          (lt) =>
                            lt.id ==
                            item.type
                        )?.value || item.type}
                      </td>
                      <td className="px-4 py-3">
                        {LEAVEDURATION.find(
                          (lt) =>
                            lt.id ==
                            item.duration
                        )?.value || item.duration}
                      </td>
                      <td className="px-4 py-3">
                        {item.reason}
                      </td>
                    </>
                  )}

                  {type === "wfh" && (
                    <>
                      <td className="px-4 py-3">
                        {formatDate(item.from_date)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(item.to_date)}
                      </td>
                      <td className="px-4 py-3">
                        {item.reason}
                      </td>
                    </>
                  )}

                  {type === "reimbursement" && (
                    <>
                      <td className="px-4 py-3">
                        {item.request_for}
                      </td>
                      <td className="px-4 py-3">
                        ₹{item.amount_inr}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(item.request_date)}
                      </td>
                    </>
                  )}

                  {type === "compOff" && (
                    <>
                      <td className="px-4 py-3">
                        {formatDate(item.from_date)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(item.to_date)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(
                          item.original_from_date
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(
                          item.original_to_date
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.reason}
                      </td>
                    </>
                  )}

                  <td className="px-4 py-3">
                    <StatusChip
                      status={item.status}
                    />
                  </td>

                  <td className="px-4 py-3">
                    {item.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            onAction(
                              {leave_id: item.id, action: 9000001}
                            )
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded-lg"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            onAction(
                             {leave_id: item.id, action: 9000002}
                            )
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default HistoryTable;
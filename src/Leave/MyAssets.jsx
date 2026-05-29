import React from "react";
import { TableHead, TableCell } from "./Leave";

const MyAssets = () => {
  // Mock Data
  const data = {
    assets: [
      {
        asset_name: "Dell Laptop",
        asset_id: "DL-1024",
        issued_on: "2025-01-15",
        condition: "Good",
        remarks: "Office use only",
      },
      {
        asset_name: "Wireless Mouse",
        asset_id: "WM-2048",
        issued_on: "2025-02-10",
        condition: "Excellent",
        remarks: "Logitech MX Master",
      },
      {
        asset_name: "Monitor",
        asset_id: "MN-3096",
        issued_on: "2025-03-01",
        condition: "Fair",
        remarks: "Minor scratches",
      },
    ],
  };

  return (
    <>
      {/* Assets */}
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-16">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="text-2xl font-semibold">
              My Assets
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Issued On</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Remarks</TableHead>
                </tr>
              </thead>

              <tbody>
                {data?.assets?.map((asset, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-none"
                  >
                    <TableCell>{asset.asset_name}</TableCell>

                    <TableCell>{asset.asset_id}</TableCell>

                    <TableCell>{asset.issued_on}</TableCell>

                    <TableCell>{asset.condition}</TableCell>

                    <TableCell>{asset.remarks}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAssets;
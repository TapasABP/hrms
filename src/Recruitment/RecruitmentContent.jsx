import { useState } from "react";

function RecruitmentMain({ activeTab }) {
  const [selectedMode, setSelectedMode] =
    useState("");

  return (
    <main className="flex-1 p-6">
      {/* Post Job Tab */}
      {activeTab === "post" && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <h2 className="text-2xl font-semibold">
                Create Amazing Job Opportunity
              </h2>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>

                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50"
                  />
                </div>

                {/* Location + Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📍 Location
                    </label>

                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏢 Department/Team
                    </label>

                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50"
                    />
                  </div>
                </div>

                {/* Work Type + Job Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ⏰ Work Type
                    </label>

                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50">
                      <option value="">
                        Select Work Type
                      </option>
                      <option>
                        Full Time
                      </option>
                      <option>
                        Part Time
                      </option>
                      <option>
                        Contractual
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🌐 Job Mode
                    </label>

                    <div className="flex gap-2 mt-2">
                      {[
                        "On-Site",
                        "Remote",
                        "Hybrid",
                      ].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            setSelectedMode(
                              mode
                            )
                          }
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedMode ===
                            mode
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💰 Salary Min
                    </label>

                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💎 Salary Max
                    </label>

                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50"
                    />
                  </div>
                </div>

                {/* Textareas */}
                {[
                  "📝 Job Summary",
                  "👥 About the Team",
                  "👔 Reporting To",
                  "🎯 Key Responsibilities",
                  "⚡ Skills & Attributes for Success",
                  "🎓 Preferred Education & Experience",
                  "🏢 About Us",
                ].map((label, index) => (
                  <div key={index}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {label}
                    </label>

                    {label ===
                    "👔 Reporting To" ? (
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50"
                      />
                    ) : (
                      <textarea
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
              >
                🚀 Create Amazing Job
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Job Listings Tab */}
      {activeTab ===
        "listings" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-semibold mb-8">
              Job Listings
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                    {[
                      "Job Title",
                      "Department",
                      "Status",
                      "Posted On",
                      "Applications",
                      "Actions",
                      "Share",
                    ].map(
                      (
                        heading
                      ) => (
                        <th
                          key={
                            heading
                          }
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                        >
                          {
                            heading
                          }
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-gray-500"
                    >
                      No jobs
                      found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab ===
        "applications" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-semibold mb-8">
              Job Applications
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    {[
                      "Name",
                      "Job Title",
                      "Department",
                      "Applied On",
                      "Status",
                      "Actions",
                    ].map(
                      (
                        heading
                      ) => (
                        <th
                          key={
                            heading
                          }
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                        >
                          {
                            heading
                          }
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500"
                    >
                      No
                      applications
                      found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RecruitmentMain;
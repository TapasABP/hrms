import { useState } from "react";

import axios from "axios";
import { MAIN_API_URL } from "../constants/global-variables";
import { DEPARTMENTS, JOBTYPES } from "../contstants/application";
import { toast, ToastContainer } from "react-toastify";


// Department List Constant


function RecruitmentMain({ activeTab }) {
  // Retrieve logged-in user context safely for payload author parameters
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  // const lo = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = userData?.token;

  // Main Form State Setup
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    department: "",
    work_type: "",
    job_mode: "",
    salary_min: "",
    salary_max: "",
    job_summary: "",
    team_info: "",
    reporting_to: "",
    responsibilities: "",
    skills: "",
    education: "",
    about_us: ""
  });

  // Standard input text modification tracker
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Direct state binding wrapper for Custom Selection Buttons
  const handleModeSelection = (modeValue) => {
    setFormData((prev) => ({
      ...prev,
      job_mode: modeValue
    }));
  };

  // SAVE/SUBMIT AXIOS FUNCTION
  const handleSave = (e) => {
    e.preventDefault(); // Blocks default form page reloading layout behavior
     if(!formData.title || !formData.location || !formData.department || !formData.work_type || !formData.job_mode) {
      toast.error("Please fill in all required fields before submitting the job post.");
      return;
    }
    // Maps explicit key strings matching backend payload model exactly
    const payload = {
      username: userData?.user?.email, // Fallback text value
      title: formData.title,
      location: formData.location,
      department: String(formData.department), // Transformed explicitly into a string structure
      work_type: formData.work_type,
      job_mode: formData.job_mode,
      salary_min: Number(formData.salary_min) || 0, // Numbers sanitization 
      salary_max: Number(formData.salary_max) || 0,
      job_summary: formData.job_summary,
      team_info: formData.team_info,
      reporting_to: formData.reporting_to,
      responsibilities: formData.responsibilities,
      skills: formData.skills,
      education: formData.education,
      about_us: formData.about_us
    };
   console.log("Submitting Job Post Payload:", payload); // Debug log for payload structure
    axios.post(`${MAIN_API_URL}/job-postings`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      alert("Job Opportunity Created Successfully!");
      console.log("Create Success Response:", response.data);
      
      // Clear form data inputs after safe creation
      setFormData({
        title: "", location: "", department: "", work_type: "", job_mode: "",
        salary_min: "", salary_max: "", job_summary: "", team_info: "",
        reporting_to: "", responsibilities: "", skills: "", education: "", about_us: ""
      });
    })
    .catch((err) => {
      console.error("Error creating job post:", err);
      alert(err.response?.data?.error || "Failed to submit new opportunity listing details.");
    });
  };

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

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
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
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏢 Department/Team
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
                    >
                      <option value="" disabled>Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Work Type + Job Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ⏰ Work Type
                    </label>
                    <select 
                      name="work_type"
                      value={formData.work_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
                    >
                      <option value="" disabled>Select Work Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contractual">Contractual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🌐 Job Mode
                    </label>
                    <div className="flex gap-2 mt-2">
                      {JOBTYPES.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => handleModeSelection(mode.value)}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.job_mode === mode.value
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700"
                          }`}
                        >
                          {mode.value}
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
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💎 Salary Max
                    </label>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
                    />
                  </div>
                </div>

                {/* Individual Textareas & Inputs */}
                
                {/* Job Summary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Job Summary
                  </label>
                  <textarea
                    rows="4"
                    name="job_summary"
                    value={formData.job_summary}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none text-gray-800"
                  />
                </div>

                {/* About the Team */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👥 About the Team
                  </label>
                  <textarea
                    rows="4"
                    name="team_info"
                    value={formData.team_info}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none text-gray-800"
                  />
                </div>

                {/* Reporting To */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👔 Reporting To
                  </label>
                  <input
                    type="text"
                    name="reporting_to"
                    value={formData.reporting_to}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 text-gray-800"
                  />
                </div>

                {/* Key Responsibilities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🎯 Key Responsibilities
                  </label>
                  <textarea
                    rows="4"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none text-gray-800"
                  />
                </div>

                {/* Skills & Attributes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ⚡ Skills & Attributes for Success
                  </label>
                  <textarea
                    rows="4"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none text-gray-800"
                  />
                </div>

                {/* Preferred Education */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🎓 Preferred Education & Experience
                  </label>
                  <textarea
                    rows="4"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none text-gray-800"
                  />
                </div>

                {/* About Us */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🏢 About Us
                  </label>
                  <textarea
                    rows="4"
                    name="about_us"
                    value={formData.about_us}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white/50 resize-none text-gray-800"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
              >
                🚀 Create Amazing Job Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Job Listings Tab */}
      {activeTab === "listings" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-semibold mb-8">Job Listings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                    {["Job Title", "Department", "Status", "Posted On", "Applications", "Actions", "Share"].map((heading) => (
                      <th key={heading} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No jobs found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-semibold mb-8">Job Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    {["Name", "Job Title", "Department", "Applied On", "Status", "Actions"].map((heading) => (
                      <th key={heading} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No applications found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </main>
  );
}

export default RecruitmentMain;
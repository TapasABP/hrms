import { act, useEffect, useState } from "react";

import axios from "axios";
import { MAIN_API_URL } from "../constants/global-variables";
import { DEPARTMENTS, JOBTYPES } from "../contstants/application";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";





function RecruitmentMain({ activeTab }) {

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const navigate = useNavigate()
  const token = userData?.token;
  const [joblisting, setJoblisting] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
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
    if (!formData.title || !formData.location || !formData.department || !formData.work_type || !formData.job_mode) {
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
  useEffect(() => {
    if (activeTab === "listings") {
      axios
        .get(
          `${MAIN_API_URL}/job-postings/user/${userData?.user?.email}`,

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Employee details response:", response);
          if (response.data) {

            setJoblisting(response.data)
            console.log(data.department, "Department value from API");

          }
        })
        .catch((err) => {
          console.error("Error fetching employee data:", err);

        })
    } else if (activeTab === "applications") {
      axios
        .get(
          `${MAIN_API_URL}/job-applications/org/${userData?.user?.org_id}`,

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("application response:", response);
          if (response.data) {

            setApplications(response.data)

          }
        })
        .catch((err) => {
          console.error("Error fetching employee data:", err);

        })
    }
  }, [activeTab])

  const getApplicationDetails = (applicationId) => {
    axios
      .get(`${MAIN_API_URL}/job-applications/${applicationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSelectedApplication(response.data);
        console.log("Application details response:", response);
      })
      .catch((err) => {
        console.error("Error fetching application details:", err);
      });
  };

  const changeApplicationStatus = (applicationId, newStatus) => {
    axios
      .post(`${MAIN_API_URL}/job-applications/update-status`, { id: applicationId, status: newStatus }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Application status updated successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        console.log("Application status change response:", response);
        // toast.success("Application accepted!");
      })
      .catch((err) => {
        console.error("Error changing application status:", err);
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
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${formData.job_mode === mode.value
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

            {/* HEADING */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Job Listings
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage and monitor all posted job openings
                </p>
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-medium shadow-md transition-all">
                + Create Job
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
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
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {
                    joblisting?.map((job) => (
                      <tr
                        key={job.id}
                        className="bg-white shadow-sm hover:shadow-lg transition-all rounded-2xl"
                      >
                        {/* JOB TITLE */}
                        <td className="px-6 py-5 rounded-l-2xl">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {job.title}
                            </span>

                            <span className="text-xs text-gray-500 mt-1">
                              {job.location} • {job.job_mode}
                            </span>
                          </div>
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-6 py-5 text-gray-600">
                          {job.department}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : job.status === "Closed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {job.status}
                          </span>
                        </td>

                        {/* POSTED DATE */}
                        <td className="px-6 py-5 text-gray-600">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>

                        {/* APPLICATIONS */}
                        <td className="px-6 py-5">
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {job.applications}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-all" onClick={() => navigate(`/job-view/${job.id}`)}>
                            View
                          </button>
                        </td>

                        {/* SHARE */}
                        <td className="px-6 py-5 rounded-r-2xl">
                          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-all" onClick={() => {
                            const jobLink = `${window.location.origin}/apply?job_id=${job.id}&job_title=${job.title}`;
                            navigator.clipboard.writeText(jobLink)
                              .then(() => {
                                toast.success("Job link copied to clipboard!");
                              })
                              .catch((err) => {
                                console.error("Failed to copy job link:", err);
                                toast.error("Failed to copy job link. Please try again.");
                              });
                          }}>
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
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
                  {applications?.map((application) => (
                    <tr
                      key={application.id}
                      className="bg-white shadow-sm hover:shadow-md transition-all rounded-xl"
                    >
                      {/* NAME */}
                      <td className="px-6 py-5 rounded-l-xl">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {application.full_name}
                          </span>

                          <span className="text-xs text-gray-500 mt-1">
                            {application.email}
                          </span>
                        </div>
                      </td>

                      {/* JOB TITLE */}
                      <td className="px-6 py-5 text-gray-700 font-medium">
                        {application.title}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="px-6 py-5 text-gray-600">
                        {application.department}
                      </td>

                      {/* APPLIED ON */}
                      <td className="px-6 py-5 text-gray-600">
                        {new Date(application.created_at).toLocaleDateString()}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${application.status === 3000001
                            ? "bg-yellow-100 text-yellow-700"
                            : application.status === 3000002
                              ? "bg-blue-100 text-blue-700"
                              : application.status === 3000003
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {application.status === 3000001
                            ? "Applied"
                            : application.status === 3000002
                              ? "Interviewing"
                              : application.status === 3000003
                                ? "Accepted"
                                : "Rejected"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5 rounded-r-xl">
                        <div className="flex flex-wrap gap-2">

                          {/* VIEW */}
                          <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                            onClick={() => getApplicationDetails(application.id)}
                          >
                            View
                          </button>

                          <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            defaultValue=""
                            onChange={(e) => {
                              if (!e.target.value) return;

                              changeApplicationStatus(
                                application.id,
                                Number(e.target.value)
                              );
                            }}
                          >
                            <option value="" disabled>
                              Change Status
                            </option>

                            <option value="3000003">
                              ✅ Accept
                            </option>

                            <option value="3000002">
                              🟡 Schedule Interview
                            </option>

                            <option value="3000004">
                              ❌ Reject
                            </option>
                          </select>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* ================= APPLICATION DETAILS MODAL ================= */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          {/* MODAL CONTAINER */}
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Application Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Candidate information & application details
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedApplication(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <span className="text-2xl text-gray-500">&times;</span>
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">

              {/* PROFILE SECTION */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">

                {/* AVATAR */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {selectedApplication.full_name?.charAt(0)}
                </div>

                {/* BASIC INFO */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedApplication.full_name}
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      Applicant
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${selectedApplication.status === 3000001
                        ? "bg-yellow-100 text-yellow-700"
                        : selectedApplication.status === 3000002
                          ? "bg-blue-100 text-blue-700"
                          : selectedApplication.status === 3000003
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {selectedApplication.status === 3000001
                        ? "Pending"
                        : selectedApplication.status === 3000002
                          ? "Reviewed"
                          : selectedApplication.status === 3000003
                            ? "Interview Scheduled"
                            : "Rejected"}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm">
                    Applied on{" "}
                    {new Date(
                      selectedApplication.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid md:grid-cols-2 gap-5">

                {/* EMAIL */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">
                    Email Address
                  </p>

                  <p className="font-semibold text-gray-800 break-all">
                    {selectedApplication.email}
                  </p>
                </div>

                {/* PHONE */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">
                    Phone Number
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedApplication.phone}
                  </p>
                </div>

                {/* LOCATION */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">
                    Current Location
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedApplication.current_location}
                  </p>
                </div>

                {/* COMPANY */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">
                    Current Company
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedApplication.current_company}
                  </p>
                </div>
              </div>

              {/* LINKS */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Professional Links
                </h4>

                <div className="grid md:grid-cols-3 gap-4">

                  {/* LINKEDIN */}
                  <a
                    href={selectedApplication.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-5 transition-all"
                  >
                    <p className="text-sm text-blue-600 font-medium">
                      LinkedIn
                    </p>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      View Profile
                    </p>
                  </a>

                  {/* PORTFOLIO */}
                  <a
                    href={selectedApplication.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-2xl p-5 transition-all"
                  >
                    <p className="text-sm text-purple-600 font-medium">
                      Portfolio
                    </p>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Visit Website
                    </p>
                  </a>

                  {/* RESUME */}
                  <a
                    href={selectedApplication.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl p-5 transition-all"
                  >
                    <p className="text-sm text-emerald-600 font-medium">
                      Resume
                    </p>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Download Resume
                    </p>
                  </a>
                </div>
              </div>

              {/* ADDITIONAL INFO */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Information
                </h4>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedApplication.additional_info ||
                      "No additional information provided."}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {/* <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">

                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm">
                  Accept Application
                </button>

                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm">
                  Reject
                </button>

                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm">
                  Schedule Interview
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </main>
  );
}

export default RecruitmentMain;
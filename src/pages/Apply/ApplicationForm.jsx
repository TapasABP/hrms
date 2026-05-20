import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [searchParams] =
    useSearchParams();

  const job_id =
    searchParams.get("job_id");

  // ==========================
  // STATES
  // ==========================

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [showPopup, setShowPopup] =
    useState(false);

  const [resumeFile, setResumeFile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      phone: "",
      current_location: "",
      current_company: "",
      linkedin: "",
      portfolio: "",
      cover_letter: "",
      additional_info: "",
    });

  // ==========================
  // FORMAT SALARY
  // ==========================

  const formatLakh = (num) => {
    if (!num) return "₹0";

    return (
      "₹" +
      num
        .toString()
        .replace(
          /\B(?=(\d{2})+(?!\d))/g,
          ","
        )
    );
  };

  // ==========================
  // LOAD JOB DETAILS
  // ==========================

  const loadJobDetails =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `http://localhost:3000/api/job-postings/${job_id}`
          );

        if (!res.ok)
          throw new Error(
            "Failed to fetch"
          );

        const data =
          await res.json();

        setJob(data);
      } catch (err) {
        console.error(
          "Error loading job:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!job_id) {
    //   alert("Missing Job ID");
    //   navigate("/jobs");
      return;
    }

    loadJobDetails();
  }, [job_id]);

  // ==========================
  // INPUT CHANGE
  // ==========================

  const handleChange = (
    e
  ) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // SUCCESS POPUP
  // ==========================

  const showSuccessPopup =
    () => {
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    };

  // ==========================
  // SUBMIT FORM
  // ==========================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!resumeFile) {
        alert(
          "Please upload your resume."
        );
        return;
      }

      try {
        const submitData =
          new FormData();

        submitData.append(
          "resume",
          resumeFile
        );

        submitData.append(
          "job_id",
          job_id
        );

        Object.entries(
          formData
        ).forEach(
          ([key, value]) => {
            submitData.append(
              key,
              value
            );
          }
        );

        const res =
          await fetch(
            "http://localhost:3000/api/apply",
            {
              method: "POST",
              body: submitData,
            }
          );

        if (res.ok) {
          showSuccessPopup();

          // Reset form
          setFormData({
            full_name: "",
            email: "",
            phone: "",
            current_location:
              "",
            current_company:
              "",
            linkedin: "",
            portfolio: "",
            cover_letter:
              "",
            additional_info:
              "",
          });

          setResumeFile(
            null
          );
        } else {
          alert(
            "❌ Failed to apply. Try again."
          );
        }
      } catch (err) {
        console.error(err);
        alert(
          "Something went wrong."
        );
      }
    };

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Job Title */}
        <div className="text-2xl font-semibold mb-1">
          {loading
            ? "Loading role..."
            : job?.title ||
              "Role details unavailable"}
        </div>

        {/* Job Meta */}
        <div className="text-sm text-slate-500 mb-6">
          {!loading &&
            job && (
              <>
                {
                  job.location
                }{" "}
                •{" "}
                {
                  job.work_type
                }{" "}
                (
                {
                  job.job_mode
                }
                ) •{" "}
                {formatLakh(
                  job.salary_min
                )}{" "}
                -{" "}
                {formatLakh(
                  job.salary_max
                )}
              </>
            )}
        </div>

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              required
              value={
                formData.full_name
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              required
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Current Location */}
          <div>
            <label className="block font-medium">
              Current
              Location
            </label>

            <input
              type="text"
              name="current_location"
              required
              value={
                formData.current_location
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block font-medium">
              Current
              Company
            </label>

            <input
              type="text"
              name="current_company"
              required
              value={
                formData.current_company
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Linkedin */}
          <div>
            <label className="block font-medium">
              LinkedIn
              Profile
              (optional)
            </label>

            <input
              type="url"
              name="linkedin"
              value={
                formData.linkedin
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block font-medium">
              Portfolio /
              Website
              (optional)
            </label>

            <input
              type="url"
              name="portfolio"
              value={
                formData.portfolio
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block font-medium">
              Why do you
              want to
              join us?
            </label>

            <textarea
              rows="5"
              name="cover_letter"
              required
              value={
                formData.cover_letter
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50 resize-y"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block font-medium">
              Additional
              Information
              (optional)
            </label>

            <textarea
              rows="5"
              name="additional_info"
              value={
                formData.additional_info
              }
              onChange={
                handleChange
              }
              className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-md bg-slate-50 resize-y"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block font-medium">
              Upload
              Resume
              (PDF/DOC)
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) =>
                setResumeFile(
                  e.target
                    .files[0]
                )
              }
              className="mt-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Submit
            application →
          </button>
        </form>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-40" />

          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg text-center z-50">
            <div className="text-4xl mb-2">
              🎉
            </div>

            <h3 className="text-xl font-semibold">
              Application
              submitted!
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              Thank you
              for
              applying.
              Our HR
              team will
              get back
              to you if
              you are
              shortlisted.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationForm;
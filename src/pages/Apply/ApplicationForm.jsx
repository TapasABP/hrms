import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { MAIN_API_URL } from "../../constants/global-variables";

const ApplicationForm = () => {
  const navigate = useNavigate();
const userData = JSON.parse(localStorage.getItem("userData") || "{}");
 const token = userData?.token;
  const [searchParams] =
    useSearchParams();

  const job_id =
    searchParams.get("job_id");
  const job_title =
    searchParams.get("job_title");

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

  // const loadJobDetails =
  //   () => {
  //     setLoading(true);

  //     axios
  //       .get(
  //         `${MAIN_API_URL}/job-apply`
  //       )
  //       .then((res) => {
  //         setJob(res.data);
  //       })
  //       .catch((err) => {
  //         console.error(
  //           "Error loading job:",
  //           err
  //         );
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   };

  // useEffect(() => {
  //   if (!job_id) return;

  //   loadJobDetails();
  // }, [job_id]);

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
    (e) => {
      e.preventDefault();

      if (!resumeFile) {
        alert(
          "Please upload your resume."
        );
        return;
      }

      // ==========================
      // FORM DATA PAYLOAD
      // ==========================

      const payload =
        new FormData();

      payload.append(
        "job_id",
        job_id
      );

      payload.append(
        "full_name",
        formData.full_name
      );

      payload.append(
        "email",
        formData.email
      );

      payload.append(
        "phone",
        formData.phone
      );

      payload.append(
        "current_location",
        formData.current_location
      );

      payload.append(
        "current_company",
        formData.current_company
      );

      payload.append(
        "linkedin",
        formData.linkedin
      );

      payload.append(
        "portfolio",
        formData.portfolio
      );

      payload.append(
        "cover_letter",
        formData.cover_letter
      );

      payload.append(
        "additional_info",
        formData.additional_info
      );

      payload.append(
        "resume",
        resumeFile
      );

      // ==========================
      // API CALL
      // ==========================

      axios
        .post(
          `${MAIN_API_URL}/job-apply`,
          payload,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",

                Authorization: `Bearer ${token}`
            },
          }
        )
        .then((res) => {
          console.log(
            "Application Submitted:",
            res.data
          );

          showSuccessPopup();

          // RESET FORM
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
        })
        .catch((err) => {
          console.error(
            "Application Error:",
            err
          );

          alert(
            err?.response?.data
              ?.message ||
              "Failed to submit application."
          );
        });
    };

  return (
    <div className="bg-slate-100 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">

        {/* JOB TITLE */}
        <div className="text-2xl font-semibold mb-1">
          {job_title || "Loading Job..."}
        </div>

        {/* JOB META */}
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

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          {/* FULL NAME */}
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* EMAIL */}
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* PHONE */}
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* CURRENT LOCATION */}
          <div>
            <label className="block font-medium">
              Current Location
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* CURRENT COMPANY */}
          <div>
            <label className="block font-medium">
              Current Company
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* LINKEDIN */}
          <div>
            <label className="block font-medium">
              LinkedIn
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* PORTFOLIO */}
          <div>
            <label className="block font-medium">
              Portfolio
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* COVER LETTER */}
          <div>
            <label className="block font-medium">
              Cover Letter
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* ADDITIONAL INFO */}
          <div>
            <label className="block font-medium">
              Additional Information
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
              className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
            />
          </div>

          {/* RESUME */}
          <div>
            <label className="block font-medium">
              Upload Resume
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

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all font-medium"
          >
            Submit Application →
          </button>
        </form>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />

          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl text-center z-50 max-w-md">
            <div className="text-5xl mb-3">
              🎉
            </div>

            <h3 className="text-2xl font-bold text-gray-800">
              Application Submitted!
            </h3>

            <p className="text-gray-500 mt-3">
              Thank you for applying.
              Our HR team will contact
              you if shortlisted.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationForm;
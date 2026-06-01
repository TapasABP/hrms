import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useParams,
} from "react-router-dom";
import { MAIN_API_URL } from "../../constants/global-variables";
import { DEPARTMENTS } from "../../contstants/application";

const Jobview = () => {

  // ==========================
  // ROUTE PARAMS
  // ==========================

  const { id } =
    useParams();

  // ==========================
  // STATES
  // ==========================
 const userData = JSON.parse(localStorage.getItem("userData") || "{}");

//  const navigate = useNavigate()
  const token = userData?.token;
  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================
  // FETCH JOB DETAILS
  // ==========================

  const fetchJobDetails =
    () => {

      setLoading(true);

      axios
        .get(
          `${MAIN_API_URL}/job-postings/${id}`,
          {
            headers: {
              "Content-Type":
                "application/json",
                Authorization : `Bearer ${token}`
            },
          }
        )
        .then((res) => {

          setJob(
            res.data
          );

          setError("");

        })
        .catch((err) => {

          console.error(
            "Job fetch error:",
            err
          );

          setError(
            "Job not found."
          );

        })
        .finally(() => {

          setLoading(false);

        });
    };

  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {

    if (!id) {

      setError(
        "Invalid Job ID"
      );

      setLoading(false);

      return;
    }

    fetchJobDetails();

  }, [id]);

  // ==========================
  // FORMAT SALARY
  // ==========================

  const formatSalary = (
    amount
  ) => {

    if (!amount)
      return "₹0";

    return (
      "₹" +
      amount.toLocaleString(
        "en-IN"
      )
    );
  };

  // ==========================
  // LOADING UI
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 text-lg">
          Loading Job Details...
        </p>
      </div>
    );
  }

  // ==========================
  // ERROR UI
  // ==========================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-600 text-lg font-medium">
          {error}
        </p>
      </div>
    );
  }

  // ==========================
  // MAIN UI
  // ==========================

  return (
    <div className="bg-slate-100 min-h-screen py-10 px-4">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

          <h1 className="text-3xl font-bold">
            {job?.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">

            <span className="bg-white/20 px-3 py-1 rounded-full">
              📍 {job?.location}
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              💼 {job?.work_type}
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              🏢 {job?.job_mode}
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              👥 {job?.applications} Applications
            </span>

          </div>

          <div className="mt-5 text-2xl font-semibold">
            {formatSalary(
              job?.salary_min
            )}{" "}
            -{" "}
            {formatSalary(
              job?.salary_max
            )}
          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">

          {/* JOB SUMMARY */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Job Summary
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.job_summary
              }
            </p>
          </div>

          {/* RESPONSIBILITIES */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Key Responsibilities
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.responsibilities
              }
            </p>
          </div>

          {/* SKILLS */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Skills & Requirements
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.skills
              }
            </p>
          </div>

          {/* EDUCATION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Education & Experience
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.education_experience
              }
            </p>
          </div>

          {/* TEAM */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              About the Team
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.about_team
              }
            </p>
          </div>

          {/* REPORTING */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Reporting To
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.reporting_to
              }
            </p>
          </div>

          {/* ABOUT US */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              About Us
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                job?.about_us
              }
            </p>
          </div>

          {/* EXTRA INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">
                Department
              </p>

              <h3 className="font-semibold text-slate-800">
                {
                  DEPARTMENTS.find((dept) => dept.id === Number(job?.department)
                  )?.value || "N/A"
                }
              </h3>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">
                Posted On
              </p>

              <h3 className="font-semibold text-slate-800">
                {new Date(
                  job?.created_at
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </h3>
            </div>

          </div>

          {/* APPLY BUTTON */}
          <div className="pt-4">

            <Link
              to={`/apply?job_id=${job?.id}&job_title=${job?.title}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Apply Now →
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Jobview;
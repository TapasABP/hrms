import React, {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Jobview = () => {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const jobId =
    searchParams.get(
      "id"
    );

  // ==========================
  // STATES
  // ==========================

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================
  // FETCH JOB DETAILS
  // ==========================

  const fetchJobDetails =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `http://localhost:3000/api/job-postings/${jobId}`
          );

        if (!res.ok) {
          throw new Error(
            "Job not found"
          );
        }

        const data =
          await res.json();

        setJob(data);
      } catch (err) {
        console.error(
          err
        );

        setError(
          "Job not found."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================
  // INITIAL LOAD
  // ==========================

  // useEffect(() => {
  //   if (!jobId) {
  //     setError(
  //       "Invalid job link."
  //     );
  //     return;
  //   }

  //   fetchJobDetails();
  // }, [jobId]);

  // ==========================
  // FORMAT SALARY
  // ==========================

  const formatLakh = (
    amount
  ) => {
    if (!amount)
      return "";

    return `INR ${(
      amount / 100000
    ).toFixed(
      1
    )} lakh`;
  };

  // ==========================
  // SECTION UI
  // ==========================

  const renderSection = (
    title,
    content
  ) => {
    if (!content)
      return null;

    return (
      <div className="mb-6">
        <h3 className="text-blue-600 font-semibold mb-1">
          {title}
        </h3>

        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    );
  };

  // ==========================
  // LOADING STATE
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  // ==========================
  // ERROR STATE
  // ==========================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-slate-800 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        {/* Job Title */}
        <h1 className="text-2xl font-semibold mb-1">
          {job?.title}
        </h1>

        {/* Meta */}
        <div className="text-sm text-slate-500 mb-6">
          {
            job?.location
          }{" "}
          •{" "}
          {
            job?.work_type
          }{" "}
          (
          {
            job?.job_mode
          }
          ) •{" "}
          {formatLakh(
            job?.salary_min
          )}{" "}
          -{" "}
          {formatLakh(
            job?.salary_max
          )}
        </div>

        {/* Sections */}
        {renderSection(
          "Job Summary",
          job?.job_summary
        )}

        {renderSection(
          "Key Responsibilities",
          job?.responsibilities
        )}

        {renderSection(
          "Skills & Attributes for Success",
          job?.skills
        )}

        {renderSection(
          "Preferred Education & Experience",
          job?.education_experience
        )}

        {renderSection(
          "About the Team",
          job?.about_team
        )}

        {renderSection(
          "About Us",
          job?.about_us
        )}

        {/* Apply Button */}
        <Link
          to={`/apply-job?job_id=${job?.id}`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition"
        >
          Apply Now →
        </Link>
      </div>
    </div>
  );
};

export default Jobview;
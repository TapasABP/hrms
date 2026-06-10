// RecruitmentHeader.jsx

import React from "react";

const RecruitmentHeader = () => {
  return (
    <header className="bg-slate-800 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        Recruitment Hub
      </h1>

      <button style={{ cursor : 'pointer'}}
        onClick={() =>
          window.history.back()
        }
        className="text-sm bg-gray-600 px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        ← Back to Dashboard
      </button>
    </header>
  );
};

export default RecruitmentHeader;
import React from 'react'
import Header from './Header'

const Analytics = () => {
    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            <Header />
            <main className="p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Rich Visual Analytics of Your Workforce
                </h2>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {/* Gender Ratio */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Gender Ratio</h3>
                        <canvas id="genderChart" />
                    </div>
                    {/* Age Distribution */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Age Distribution</h3>
                        <canvas id="ageChart" />
                    </div>
                    {/* Experience in Org */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Experience in Organization (Years)</h3>
                        <canvas id="experienceChart" />
                    </div>
                    {/* Department Headcount */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Headcount per Department</h3>
                        <canvas id="departmentChart" />
                    </div>
                    {/* Exit Reasons */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Exit Reasons</h3>
                        <canvas id="exitReasonChart" />
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Analytics
import { useEffect, useState } from 'react'
import Login from './pages/Login/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/HRDashboard/Dashboard'
import Analytics from './pages/Analytics/Analytics'
import EmployeeOnboarding from './pages/Onboarding/Onboarding'
import Reimbursements from './pages/Reimbursements/Reimbursements'
import ApplicationForm from './pages/Apply/ApplicationForm'
import Attendance from './pages/Attendance/Attendance'
import Jobview from './pages/JobView/Jobview'
import RecruitmentDashboard from './Recruitment/RecruitmentDashboard'
import ViewEmployee from './pages/ViewEmployee/ViewEmployee'
import EmployeeDashboard from './EmployeeDashboard/EmployeeDashboard'
import Leave from './Leave/Leave'
import PublicRoute from './components/Routemanager/PublicRoute'
import PrivateRoute from './components/Routemanager/PrivateRoute'
import EmployeeDetails from './EmployeeDetails/EmployeeDetails'
function App() {

  let path = window.location.pathname.slice(1);
  console.log(path, 'path')
  useEffect(() => {

    document.title = path ? `${path} - HRMS` : "HRMS";
    if (path === "") {
      window.location.href = "/login";
    }

  }, [path])
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Only HR routes */}


          <Route element={<PrivateRoute allowedRoles={[20001]} />}>
            <Route path="/hr-dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/onboarding" element={<EmployeeOnboarding />} />
            <Route path="/reimbursements" element={<Reimbursements />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/job-view/:id" element={<Jobview />} />
            <Route path="/recruitment" element={<RecruitmentDashboard />} />
            <Route path="/view-employee" element={<ViewEmployee />} />
            
            
          </Route>



         {/* All employee routes */}
          <Route element={<PrivateRoute allowedRoles={[20001, 20002]} />}>
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/leave-history" element={<Leave />} />
           <Route path="/apply" element={<ApplicationForm />} />
            <Route path="/employee-details/:empId" element={<EmployeeDetails />} />
          </Route>
         {/* Only Employee routes */}
          <Route element={<PrivateRoute allowedRoles={[20002]} />}>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

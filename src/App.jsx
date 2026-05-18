import { useState } from 'react'
import Login from './pages/Login/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/HRDashboard/Dashboard'
import Analytics from './pages/Analytics/Analytics'
function App() {
  
  return (
    <>
      <BrowserRouter>
       
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/hr-dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

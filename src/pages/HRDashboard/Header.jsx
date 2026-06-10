import React from 'react'
import logo from "../../assets/images/logo.png";
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
  const logout = ()=>{
    localStorage.removeItem("userData");
    navigate("/login");
  }
  return (
     <header className="bg-slate-800 text-white flex items-center justify-between px-6 py-4 shadow">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />

          <h1 className="text-xl font-semibold tracking-wide">
            HR Dashboard
          </h1>
        </div>

        <div className="text-sm flex items-center gap-2">
          <span>
            Welcome, User
          </span>

          <span style={{ cursor : 'pointer'}}
            onClick={logout}
            className="text-red-300 hover:text-red-100 underline cursor-pointer"
          >
            Logout
          </span>
        </div>
      </header>

  )
}

export default Header
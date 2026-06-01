import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  return !userData?.token ? <Outlet /> : <Navigate to="/hr-dashboard" replace />;
};

export default PublicRoute;
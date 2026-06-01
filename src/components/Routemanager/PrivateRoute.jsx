import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles = [] }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const role = userData?.user?.user_type;
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/employee-dashboard" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
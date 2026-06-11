import React, { useState } from "react";
import login_lhs from "../../assets/images/login_lhs.mp4";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import { MAIN_API_URL } from "../../constants/global-variables";
import styles from "../../assets/css/login.module.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
    const [showReset, setShowReset] = useState(false);
    const [loginCredentials, setLoginCredentials] = useState({
        username: "", password: "",
    })
    const [resetCredentials, setResetCredentials] = useState({
        username: "", current_password: "", new_password: "",
    })
    const onResetPasswordChange = (e) => {
        const { name, value } = e.target;
        setResetCredentials((prev) => ({ ...prev, [name]: value }));
    };
    const navigate = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault();

        axios.post(`${MAIN_API_URL}/login`, { username: loginCredentials.username, password: loginCredentials.password })
            .then((response) => {
                console.log("Login successful:", response.data);
                if (response.data.status) {
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    navigate("/hr-dashboard");
                } else {
                    toast.error(response.data.message || "Login failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Login error:", error.response.data.message);
                toast.error(error.response.data.message || "Login failed. Please try again.");
            });
    };

    const handleResetPassword = () => {
        console.log("Password reset submitted");
        const payload = {
            "username": resetCredentials.username,
            "current_password": resetCredentials.current_password,
            "new_password": resetCredentials.new_password
        }
        axios.post(`${MAIN_API_URL}/reset-password`, payload)
            .then((response) => {
                console.log("Password reset successful:", response.data);
                if (response.data.status) {
                    toast.success(response.data.message || "Password reset successful.");
                    setShowReset(false);
                } else {
                    toast.error(response.data.message || "Password reset failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Password reset error:", error);
            });

    };
    const inputStyle = {
        width: "100%",
        height: "58px",
        padding: "0 20px",
        marginBottom: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        fontSize: "18px",
        outline: "none",
        boxSizing: "border-box",
        background: "#fafafa",
    };
    return (
        <>
            <div className={styles['login-wrapper']}>
                {/* Left Side Video */}
                <div className={styles['login-left']}>
                    <video autoPlay muted loop playsInline className={styles['bg-video']}>
                        <source src={login_lhs} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Right Side Login */}
                <div className={styles['login-right']}>
                    <div className={styles['login-box']}>
                        <div className={styles['logo']}>
                            <img src={logo} style={{margin:'auto'}} alt="ZeroHR Logo" />
                        </div>

                        <h2>Welcome Back!</h2>

                        <form onSubmit={handleLogin}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                value={loginCredentials.username}
                                onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                                id="username"
                                placeholder="Enter your username"
                                required
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                value={loginCredentials.password}
                                onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                                id="password"
                                placeholder="••••••••"
                                required
                            />

                            <button type="submit">Login</button>
                        </form>

                        <button
                            type="button"
                            className={styles['reset-btn']}
                            onClick={() => {
                                const resetOverlay = document.getElementById("resetOverlay");
                                resetOverlay.style.display = "flex";
                                setShowReset(true);
                            }}
                        >
                            Reset Password
                        </button>
                        
                        <div className={styles['footer-text']}>
                            © 2026 ABP eVentures. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Password Modal */}


            <div
                id="resetOverlay"
                style={{
                    display: showReset ? "flex" : "none",
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.25)",
                    backdropFilter: "blur(2px)",
                    zIndex: 999,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "24px",
                        width: "420px",
                        maxWidth: "92%",
                        padding: "30px",
                        boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
                    }}
                >
                    {/* Heading */}
                    <h2
                        style={{
                            margin: 0,
                            marginBottom: "22px",
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#111827",
                        }}
                    >
                        Reset Password
                    </h2>

                    {/* Username */}
                    <input
                        type="text"
                        placeholder="Username"
                        style={inputStyle}
                        name="username"
                        value={resetCredentials.username}
                        onChange={onResetPasswordChange}
                    />

                    {/* Current Password */}
                    <input
                        type="password"
                        placeholder="Current password"
                        style={inputStyle}
                        name="current_password"
                        value={resetCredentials.current_password}
                        onChange={onResetPasswordChange}
                    />

                    {/* New Password */}
                    <input
                        type="password"
                        placeholder="New password"
                        style={inputStyle}
                        name="new_password"
                        value={resetCredentials.new_password}
                        onChange={onResetPasswordChange}
                    />

                    {/* Confirm Password */}
                    <input
                        type="password"
                        placeholder="Confirm password"
                        style={{
                            ...inputStyle,
                            marginBottom: "24px",
                        }}
                        name="confirm_password"
                        value={resetCredentials.confirm_password}
                        onChange={onResetPasswordChange}
                    />

                    {/* Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: "14px",
                        }}
                    >
                        <button
                            type="button"
                            style={{
                                flex: 1,
                                height: "48px",
                                background: "#64748b",
                                color: "#fff",
                                border: "none",
                                borderRadius: "16px",
                                fontSize: "18px",
                                fontWeight: "500",
                                cursor: "pointer",
                            }}
                            onClick={handleResetPassword}
                        >
                            Update Password
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowReset(false)}
                            style={{
                                flex: 1,
                                height: "48px",
                                background: "#64748b",
                                color: "#fff",
                                border: "none",
                                borderRadius: "16px",
                                fontSize: "18px",
                                fontWeight: "500",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </div>

          <ToastContainer />
        </>
    );

};

export default Login;
import React, { useState } from "react";
import login_lhs from "../../assets/images/login_lhs.mp4";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import { MAIN_API_URL } from "../../constants/global-variables";
import "../../assets/css/login.module.css";
const Login = () => {
    const [showReset, setShowReset] = useState(false);
    const [loginCredentials, setLoginCredentials] = useState({
        username: "",
        password: "",   
    })
    // username, current_password, new_password 
    const [resetCredentials, setResetCredentials] = useState({
        username: "",
        current_password: "",
        new_password: "",
    })
    const onResetPasswordChange = (e) => {
        const { name, value } = e.target;
        setResetCredentials((prev) => ({ ...prev, [name]: value }));
    };  
    const handleLogin = (e) => {
        e.preventDefault();

        axios.post(`${MAIN_API_URL}/auth/login`, loginCredentials)
            .then((response) => {
                console.log("Login successful:", response.data);
            })
            .catch((error) => {
                console.error("Login error:", error);
            });
    };

    const handleResetPassword = () => {
        console.log("Password reset submitted");
        
    };

    return (
        <>
            <div className="login-wrapper">
                {/* Left Side Video */}
                <div className="login-left">
                    <video autoPlay muted loop playsInline className="bg-video">
                        <source src={login_lhs} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Right Side Login */}
                <div className="login-right">
                    <div className="login-box">
                        <div className="logo">
                            <img src={logo} alt="ZeroHR Logo" />
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
                            className="reset-btn"
                            onClick={() => {
                                const resetOverlay = document.getElementById("resetOverlay");
                                resetOverlay.style.display = "flex";
                                
                            }
                            }
                        >
                            Reset Password
                        </button>

                        <div className="footer-text">
                            © 2026 ABP eVentures. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Password Modal */}

            <div
                id="resetOverlay"
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15,23,42,0.45)",
                    zIndex: 999,
                    display: showReset ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "16px",
                        maxWidth: "420px",
                        width: "92%",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    }}
                >
                    <h3 style={{ marginBottom: "12px" }}>
                        Reset Password
                    </h3>

                    <input type="text" placeholder="Username" value={resetCredentials.username} onChange={onResetPasswordChange}/>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={resetCredentials.current_password} onChange={onResetPasswordChange}
                    />
                    <input
                        type="password"
                        placeholder="New password (min 8 chars)"
                        value={resetCredentials.new_password} onChange={onResetPasswordChange}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={resetCredentials.confirm_password} onChange={onResetPasswordChange}
                    />

                    <div style={{ display: "flex", gap: "8px" }}>
                        <button type="button">
                            Update Password
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                const resetOverlay = document.getElementById("resetOverlay");
                                resetOverlay.style.display = "none";
                                setShowReset(false);
                            }}
                            style={{ background: "#64748b" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Login;
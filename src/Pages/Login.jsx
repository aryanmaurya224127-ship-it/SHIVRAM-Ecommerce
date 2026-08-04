import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import "../Style/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <MainLayout>
    <div className="login-container">
      <div className="login-box">

        <h1 className="logo">SHIVRAM</h1>
        <h2>Welcome Back 👋</h2>
        <p>Login to continue shopping</p>

        <form>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>

          <button
            type="button"
            className="show-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>
        </form>

      </div>
    </div>
    </MainLayout>
  );
}

export default Login;
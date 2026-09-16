
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout.jsx";
import "../Style/Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check identifier
    if (!formData.identifier.trim()) {
      setError("Please enter your email or phone number");
      return;
    }

    // Check password
    if (!formData.newPassword) {
      setError("Please enter your new password");
      return;
    }

    // Password length
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Confirm password
    if (!formData.confirmPassword) {
      setError("Please confirm your new password");
      return;
    }

    // Password match
    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.identifier.trim(),
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Forgot Password Status:",
        response.status
      );

      console.log(
        "Forgot Password Response:",
        data
      );

      if (!response.ok) {
        setError(
          data.message || "Password reset failed"
        );
        return;
      }

      setMessage(
        "Password reset successful! Redirecting to login..."
      );

      setFormData({
        identifier: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Go to login
      setTimeout(() => {
        navigate("/Login");
      }, 1500);

    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      setError(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="login-container">
        <div className="login-box">

          {/* Logo */}
          <div
            className="logo-name"
            style={{ textAlign: "center" }}
          >
            <Link
              to="/"
              className="Logo"
              style={{ color: "blue" }}
            >
              SHIV
              <span
                id="ANAND"
                style={{
                  color:
                    "lch(51.09% 96.03 40.51)",
                }}
              >
                RAM
              </span>
            </Link>
          </div>

          <h2>Forgot Password</h2>

          <p>
            Enter your email or phone number and set
            a new password.
          </p>

          {/* Success Message */}
          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email / Phone */}
            <div className="input-group">
              <label>Email or Phone</label>

              <input
                type="text"
                name="identifier"
                placeholder="Enter email or phone number"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>

            {/* New Password */}
            <div className="input-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

            {/* Back to Login */}
            <p className="signup-text">
              Remember your password?{" "}
              <Link to="/Login">
                Login
              </Link>
            </p>

          </form>

        </div>
      </div>
    </MainLayout>
  );
}

export default ForgotPassword;


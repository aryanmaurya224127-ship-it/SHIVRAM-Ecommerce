import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import "../Style/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
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

    if (!formData.identifier.trim()) {
      setError("Please enter your email or phone number");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.identifier.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Status:", response.status);
      console.log("Login Response:", data);

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // AuthContext me login information save karo
      login(data.user, data.token);

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error("Login Error:", error);

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

          <div
            className="logo-name"
            style={{ textAlign: "center" }}
          >
            <NavLink
              to="/"
              className="Logo"
              style={{ color: "blue" }}
            >
              SHIV
              <span
                id="ANAND"
                style={{
                  color: "lch(51.09% 96.03 40.51)",
                }}
              >
                RAM
              </span>
            </NavLink>
          </div>

          <h2>Welcome Back</h2>

          <p>Login to continue shopping</p>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

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

            <div className="input-group">
              <label>Password</label>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    paddingRight: "45px",
                  }}
                />

                  
                  
                
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
                marginBottom: "15px",
              }}
            >
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/Register">
                Create an acount
              </Link>
            </p>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout.jsx";
import "../Style/login.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    houseAreaStreet: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove previous messages while typing
    setError("");
    setMessage("");
  };

  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // PIN code validation
    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setError("PIN Code must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            houseAreaStreet: formData.houseAreaStreet.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
          }),
        }
      );

      console.log("Register Status:", response.status);

      const data = await response.json();

      console.log("Register Response:", data);

      // Backend error
      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // Registration successful
      setMessage("Registration successful!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        houseAreaStreet: "",
        city: "",
        state: "",
        pincode: "",
      });

      // Redirect to Login
      setTimeout(() => {
        navigate("/Login");
      }, 1500);
    } catch (error) {
      console.error("Registration Error:", error);

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

          <h2>Create Account</h2>

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

            {/* Full Name */}
            <div className="input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="input-group">
              <label>Phone No.</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* House / Area / Street */}
            <div className="input-group">
              <label>House No. / Area / Street</label>

              <input
                type="text"
                name="houseAreaStreet"
                placeholder="Enter house no., area or street"
                value={formData.houseAreaStreet}
                onChange={handleChange}
                required
              />
            </div>

            {/* City */}
            <div className="input-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            {/* State */}
            <div className="input-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            {/* PIN Code */}
            <div className="input-group">
              <label>PIN Code</label>

              <input
                type="text"
                name="pincode"
                placeholder="Enter 6-digit PIN code"
                value={formData.pincode}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                required
              />
            </div>

              {/* Password */}
            <div className="input-group">
              <label>Create Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>

          </form>

          {/* Login Link */}
          <p className="register-link">
            Already have an account?{" "}
            <Link to="/Login">
              Login
            </Link>
          </p>

        </div>
      </div>
    </MainLayout>
  );
}

export default Register;

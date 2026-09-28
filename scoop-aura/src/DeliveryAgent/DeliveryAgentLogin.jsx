import React, { useState } from "react";
import "./DeliveryAgentLogin.css";

const DeliveryAgentLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");

    console.log("Login Data:", formData);

    // Backend API will be connected here later.
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Header */}
        <div className="login-header">

          <h1 className="brand-name">
            Scoop Aura
          </h1>
          <br></br>
          <h1>
            Delivery Agent Login
          </h1>

          <div className="title-line"></div>

        </div>


        {/* Login Card */}
        <div className="login-card">

          <form onSubmit={handleSubmit}>

            {/* Message */}
            {message && (
              <div className="login-message">
                {message}
              </div>
            )}


            {/* Welcome */}
            <div className="welcome-section">

              <h1>
                Welcome back
              </h1>

              <p>
                Please enter your details to sign in
              </p>

            </div>


            {/* Email */}
            <div className="form-group">

              <label>
                Email Address
                <span className="required">*</span>
              </label>

              <div className="input-wrapper">

                <i className="ri-mail-line"></i>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="form-group">

              <label>
                Password
                <span className="required">*</span>
              </label>

              <div className="input-wrapper">

                <i className="ri-lock-line"></i>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <i
                  className={
                    showPassword
                      ? "ri-eye-line password-eye"
                      : "ri-eye-off-line password-eye"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                ></i>

              </div>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>


            {/* Bottom Links */}
            <div className="login-links">

              <a href="#">
                Forgot Password?
              </a>

              <a href="/DeliveryAgent/DeliveryAgentSignup">
                Sign Up
              </a>

            </div>

          </form>

        </div>


        {/* Footer */}
        <div className="footer">
          © 2025 Delivero. All rights reserved.
        </div>

      </div>

    </div>
  );
};

export default DeliveryAgentLogin;
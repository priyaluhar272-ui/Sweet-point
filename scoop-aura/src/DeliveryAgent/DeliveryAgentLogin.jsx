
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DeliveryAgentLogin.css";

const API_URL = "http://127.0.0.1:8000";

const DeliveryAgentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(
    location.state?.message || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/delivery-agent/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : data.message || "Login failed."
        );
      }

      if (!data.success || !data.agent || !data.agent.id) {
        throw new Error(data.message || "Login failed.");
      }

      // Save logged-in delivery agent details
      localStorage.setItem(
        "deliveryAgent",
        JSON.stringify(data.agent)
      );

      // Remove any stale session copy
      sessionStorage.removeItem("deliveryAgent");

      // Open delivery agent dashboard
      navigate("/delivery-agent/dashboard", {
        replace: true,
        state: {
          agent: data.agent,
        },
      });
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="brand-name">Scoop Aura</h1>
          <br />
          <h1>Delivery Agent Login</h1>
          <div className="title-line"></div>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {message && (
              <div
                className="login-message"
                role="alert"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <div className="welcome-section">
              <h1>Welcome back</h1>
              <p>Please enter your details to sign in</p>
            </div>

            <div className="form-group">
              <label>
                Email Address <span className="required">*</span>
              </label>

              <div className="input-wrapper">
                <i className="ri-mail-line"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password <span className="required">*</span>
              </label>

              <div className="input-wrapper">
                <i className="ri-lock-line"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <i
                  className={
                    showPassword
                      ? "ri-eye-line password-eye"
                      : "ri-eye-off-line password-eye"
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }
                  }}
                ></i>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="login-links">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>

              <Link to="/delivery-agent/register">
                Not Registered? Register Here
              </Link>
            </div>
          </form>
        </div>

        <div className="footer">
          © 2025 Delivero. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentLogin
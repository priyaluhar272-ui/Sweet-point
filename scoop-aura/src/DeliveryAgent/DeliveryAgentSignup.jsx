
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DeliveryAgentSignup.css";

const API_URL = "http://127.0.0.1:8000";

const DeliveryAgentSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    status: "",
    workingArea: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const phoneNumber = formData.phoneNumber.trim();

    if (!firstName || !lastName || !phoneNumber) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/delivery-agent/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email,
            contact_number: phoneNumber,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : data.message || "Registration failed."
        );
      }

      setMessage("Registration successful!");

      navigate("/delivery-agent/login", {
        replace: true,
        state: {
          message: data.message || "Registration successful. Please log in.",
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
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="brand-name">Scoop Aura</h1>
          <div>
            <br />
          </div>
          <h2>Delivery Agent Sign Up</h2>
          <div className="title-line"></div>
        </div>

        <div className="signup-card">
          <form onSubmit={handleSubmit}>
            {message && (
              <div
                className="message"
                role="alert"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <div className="two-column">
              <div className="form-group">
                <label>
                  First Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="ri-user-line"></i>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Last Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="ri-user-line"></i>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
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

            <div className="two-column">
              <div className="form-group">
                <label>
                  Password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="ri-lock-line"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                      }
                    }}
                  ></i>
                </div>
                <p className="password-help">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="form-group">
                <label>
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="ri-lock-line"></i>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="two-column">
              <div className="form-group">
                <label>
                  Phone Number <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="ri-phone-line"></i>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Status <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <i className="ri-user-settings-line"></i>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                Address <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="ri-map-pin-line"></i>
                <select
                  name="workingArea"
                  value={formData.workingArea}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select area --</option>
                  <option value="Katargam, Surat">Katargam, Surat</option>
                  <option value="Adajan, Surat">Adajan, Surat</option>
                  <option value="Varachha, Surat">Varachha, Surat</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="create-account-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="login-section">
              <p>
                Already have an account?{" "}
                <Link to="/delivery-agent/login">
                  Login
                </Link>
              </p>
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

export default DeliveryAgentSignup;

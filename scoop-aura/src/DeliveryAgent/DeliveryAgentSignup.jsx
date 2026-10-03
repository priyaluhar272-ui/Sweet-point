import React, { useState } from "react";
import "./DeliveryAgentSignup.css";

const DeliveryAgentSignup = () => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setMessage(
        "Please accept Terms of Service and Privacy Policy."
      );
      return;
    }

    console.log("Delivery Agent Data:", formData);
  };

  return (
    <div className="signup-page">

      <div className="signup-container">

        {/* Header */}
        <div className="signup-header">

          <h1 className="brand-name">
            Scoop Aura
          </h1>
          <div>
            <br></br>
          </div>
          <h2>
            Delivery Agent Sign Up
          </h2>

          <div className="title-line"></div>

        </div>


        {/* Signup Card */}
        <div className="signup-card">

          <form onSubmit={handleSubmit}>

            {/* Message */}
            {message && (
              <div className="message">
                {message}
              </div>
            )}


            {/* First Name + Last Name */}
            <div className="two-column">

              {/* First Name */}
              <div className="form-group">

                <label>
                  First Name
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">

                  <i className="ri-user-line"></i>

                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* Last Name */}
              <div className="form-group">

                <label>
                  Last Name
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">

                  <i className="ri-user-line"></i>

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

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


            {/* Password + Confirm Password */}
            <div className="two-column">

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
                    placeholder="Create password"
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

                <p className="password-help">
                  Must be at least 8 characters with letters and numbers
                </p>

              </div>


              {/* Confirm Password */}
              <div className="form-group">

                <label>
                  Confirm Password
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">

                  <i className="ri-lock-line"></i>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>


            {/* Phone + Status */}
            <div className="two-column">

              {/* Phone */}
              <div className="form-group">

                <label>
                  Phone Number
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">

                  <i className="ri-phone-line"></i>

                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* Status */}
              <div className="form-group">

                <label>
                  Status
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">

                  <i className="ri-user-settings-line"></i>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      -- Select --
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* Working Area */}
            <div className="form-group">

              <label>
                Address
                <span className="required">*</span>
              </label>

              <div className="input-wrapper">

                <i className="ri-map-pin-line"></i>

                <select
                  name="workingArea"
                  value={formData.workingArea}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    -- Select area --
                  </option>

                  <option>
                    Katargam, Surat
                  </option>

                  <option>
                    Adajan, Surat
                  </option>

                  <option>
                    Varachha, Surat
                  </option>

                  <option>
                    Nana Varachha, Surat
                  </option>

                  <option>
                    Mota Varachha, Surat
                  </option>

                  <option>
                    Kamrej, Surat
                  </option>

                  <option>
                    Vesu, Surat
                  </option>

                  <option>
                    New Katargam, Surat
                  </option>

                </select>

              </div>

            </div>


            {/* Terms */}
            <div className="terms-section">

              <label>

                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />

                <span>
                  I agree to the{" "}

                  <a href="#">
                    Terms of Service
                  </a>

                  {" "}and{" "}

                  <a href="#">
                    Privacy Policy
                  </a>

                </span>

              </label>

            </div>


            {/* Create Account */}
            <button
              type="submit"
              className="create-account-button"
            >
              Create Account
            </button>


            {/* Login */}
            <div className="login-section">

              <p>
                Already have an account?{" "}

                <a href="/DeliveryAgent/DeliveryAgentLogin">
                  Login
                </a>
              </p>

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

export default DeliveryAgentSignup;
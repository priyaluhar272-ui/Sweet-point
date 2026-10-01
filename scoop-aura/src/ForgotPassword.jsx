```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setMessage("");

    // Email validation
    if (!email) {
      setEmailError("Please Enter Your Email Address");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setEmailError("Please Enter Valid Email Address");
      return;
    }

    try {
      setLoading(true);

      // Call FastAPI backend
      const response = await fetch(
        "http://127.0.0.1:8000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      // Email not registered
      if (!data.success) {
        setEmailError(data.message);
        return;
      }

      // OTP successfully sent
      setMessage("OTP has been sent to your email.");

      // Later we will navigate to Verify OTP page
      // navigate("/verify-otp");

    } catch (error) {
      console.error("Forgot Password Error:", error);

      setEmailError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">

        <div className="forgot-card">

          {/* TITLE */}
          <div className="forgot-title-section">
            <h2>Forgot Password?</h2>

            <p>
              No worries! Enter your email and we'll send you reset
              instructions.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* MESSAGE */}
            {message && (
              <div className="forgot-success">
                <div className="success-icon">
                  <i className="ri-checkbox-circle-line"></i>
                </div>

                <p>{message}</p>
              </div>
            )}

            {/* EMAIL */}
            <div className="forgot-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="forgot-input-wrapper">

                <div className="forgot-input-icon">
                  <i className="ri-mail-line"></i>
                </div>

                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

              {emailError && (
                <p className="email-error">
                  {emailError}
                </p>
              )}

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="verify-button"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Verify OTP"}
            </button>

          </form>

          {/* BACK TO LOGIN */}
          <div className="back-login">
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

```

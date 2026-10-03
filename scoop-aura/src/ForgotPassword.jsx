import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import scoopimg from "./IMAGE/Scoop.png";

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

    if (!email) {
      setEmailError("Please Enter Your Email Address");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please Enter Valid Email Address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        navigate("/OTPverification", { state: { email: email } });
      } else {
        setMessage(data.detail || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Unable to connect to server.");
    }
  };

  return (
    <div className="forgot-page">
      
      {/* FLOATING BOUNCING ICE CREAM SCOOPS ON LEFT & RIGHT */}
      <div className="floating-scoop left-scoop-1">🍦</div>
      <div className="floating-scoop left-scoop-2">🍧</div>
      <div className="floating-scoop right-scoop-1">🍨</div>
      <div className="floating-scoop right-scoop-2">🍦</div>

      <div className="forgot-container">
        
        {/* BRAND HEADER WITH STRAWBERRY ICE CREAM CUP */}
        <div className="forgot-brand-header">
          <div className="strawberry-cup-wrapper">
            <img 
              src={scoopimg}
              alt="Strawberry Ice Cream Cup" 
              className="brand-strawberry-img"
            />
            <span className="scoop-sparkle"></span>
          </div>
          <h1>Scoop Aura</h1>
        </div>

        <div className="forgot-card">
          <div className="forgot-title-section">
            <h2>Forgot Password?</h2>
            <p>
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {message && (
              <div className="forgot-success">
                <div className="success-icon">
                  <i className="ri-error-warning-line"></i>
                </div>
                <p>{message}</p>
              </div>
            )}

            <div className="forgot-input-group">
              <label htmlFor="email">Email Address</label>
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

            <button
              type="submit"
              className="verify-button"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="back-login">
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              <i className="ri-arrow-left-line"></i> Back to Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
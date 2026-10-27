
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // OTP verification page se email receive hoga
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage("");
    setSuccessMessage("");

    // ---------------------------------------------------
    // EMAIL CHECK
    // ---------------------------------------------------

    if (!email) {
      setMessage(
        "Email information is missing. Please verify OTP again."
      );
      return;
    }

    // ---------------------------------------------------
    // PASSWORD CHECK
    // ---------------------------------------------------

    if (!password) {
      setMessage("Please enter new password.");
      return;
    }

    // ---------------------------------------------------
    // PASSWORD LENGTH
    // ---------------------------------------------------

    if (password.length < 8) {
      setMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    // ---------------------------------------------------
    // CONFIRM PASSWORD
    // ---------------------------------------------------

    if (!confirmPassword) {
      setMessage("Please confirm your password.");
      return;
    }

    // ---------------------------------------------------
    // PASSWORD MATCH
    // ---------------------------------------------------

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // ---------------------------------------------------
    // CALL BACKEND
    // ---------------------------------------------------

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            new_password: password,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Reset password response:",
        data
      );

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      if (data.success === true) {
        setPassword("");
        setConfirmPassword("");

        setMessage("");

        setSuccessMessage(
          "Password reset successfully! You can now login with your new password."
        );

      } else {
        // ------------------------------------------------
        // BACKEND ERROR
        // ------------------------------------------------

        setSuccessMessage("");

        setMessage(
          data.message ||
            "Failed to reset password."
        );
      }

    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );

      setSuccessMessage("");

      setMessage(
        "Unable to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      <div className="reset-container">

        <div className="reset-card">

          {/* =========================================
              TITLE
          ========================================== */}

          <div className="reset-title-section">

            <h1>
              Reset Password
            </h1>

            <p>
              Please enter your new password
            </p>

          </div>


          {/* =========================================
              SUCCESS MESSAGE
          ========================================== */}

          {successMessage && (
            <div className="reset-success-message">

              <div className="success-check">
                ✓
              </div>

              <div>
                {successMessage}
              </div>

            </div>
          )}


          {/* =========================================
              ERROR MESSAGE
          ========================================== */}

          {message && (
            <div className="reset-error-message">

              {message}

            </div>
          )}


          {/* =========================================
              FORM
          ========================================== */}

          <form onSubmit={handleResetPassword}>

            {/* =====================================
                NEW PASSWORD
            ====================================== */}

            <div className="reset-input-group">

              <label htmlFor="password">
                New Password
              </label>

              <div className="reset-input-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("");
                  }}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  <i
                    className={
                      showPassword
                        ? "ri-eye-off-line"
                        : "ri-eye-line"
                    }
                  ></i>

                </button>

              </div>


              {/* Password validation */}

              {password.length > 0 &&
                password.length < 8 && (
                  <p className="password-error">
                    Password must be at least 8 characters
                  </p>
                )}

            </div>


            {/* =====================================
                CONFIRM PASSWORD
            ====================================== */}

            <div className="reset-input-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="reset-input-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setMessage("");
                  }}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  <i
                    className={
                      showConfirmPassword
                        ? "ri-eye-off-line"
                        : "ri-eye-line"
                    }
                  ></i>

                </button>

              </div>


              {/* Confirm password validation */}

              {confirmPassword.length > 0 &&
                password !== confirmPassword && (
                  <p className="password-error">
                    Passwords do not match
                  </p>
                )}

            </div>


            {/* =====================================
                RESET BUTTON
            ====================================== */}

            <button
              type="submit"
              className="reset-button"
              disabled={loading}
            >

              {loading
                ? "Resetting..."
                : "Reset Password"}

            </button>

          </form>


          {/* =========================================
              BACK TO LOGIN
          ========================================== */}

          <div className="back-login">

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Back to Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;

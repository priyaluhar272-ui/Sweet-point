import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    console.log("Password reset successful");

    // Backend connect karne ke baad yaha API call aayegi
  };

  return (
    <div className="reset-page">
      <div className="reset-container">

        <div className="reset-card">

          {/* TITLE */}
          <div className="reset-title-section">
            <h1>Reset Password</h1>
            <p>Please enter your new password</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* NEW PASSWORD */}
            <div className="reset-input-group">

              <label htmlFor="password">
                New Password
              </label>

              <div className="reset-input-wrapper">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={handlePasswordChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

              {passwordError && (
                <p className="password-error">
                  {passwordError}
                </p>
              )}

            </div>


            {/* CONFIRM PASSWORD */}
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
                  onChange={handleConfirmPasswordChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
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

              {confirmError && (
                <p className="confirm-error">
                  {confirmError}
                </p>
              )}

            </div>


            {/* RESET BUTTON */}
            <button
              type="submit"
              className="reset-button"
            >
              Reset Password
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

export default ResetPassword;
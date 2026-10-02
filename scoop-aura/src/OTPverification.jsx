
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OTPverification.css";

function OTPverification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Forgot Password page se email receive karne ke liye
  const email = location.state?.email || "your email";

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendEnabled(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // OTP input change
  const handleChange = (value, index) => {
    // Sirf number allow
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage("");

    // Automatically next box par jaana
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace handling
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // OTP paste handling
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pastedData) return;

    const newOtp = ["", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 4) {
      setMessage("Please enter the complete 4-digit OTP.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: enteredOTP,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // OTP correct -> Reset Password page
        navigate("/reset-password", {
          state: {
            email: email,
          },
        });
      } else {
        setMessage(data.detail || "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage("Unable to connect to server.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!resendEnabled) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtp(["", "", "", ""]);
        setMessage("OTP has been resent to your email.");

        setTimeLeft(60);
        setResendEnabled(false);

        inputRefs.current[0]?.focus();
      } else {
        setMessage(data.detail || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage("Unable to connect to server.");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">

        {/* TITLE */}
        <div className="otp-title-section">
          <h1>Enter OTP</h1>

          <p>
            Please enter the 4-digit code sent to{" "}
            <strong>{email}</strong>

            <button
              type="button"
              className="change-email"
              onClick={() => navigate("/forgot-password")}
            >
              Change
            </button>
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="otp-message">
            {message}
          </div>
        )}

        {/* 4 DIGIT OTP */}
        <div className="otp-input-container">

          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              className="otp-input"
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={otp[index]}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
            />
          ))}

        </div>

        {/* VERIFY BUTTON */}
        <button
          type="button"
          className="verify-otp-button"
          disabled={otp.join("").length !== 4}
          onClick={handleVerify}
        >
          Verify
        </button>

        {/* RESEND */}
        <div className="resend-section">

          <button
            type="button"
            className="resend-button"
            disabled={!resendEnabled}
            onClick={handleResend}
          >
            Resend OTP
          </button>

          {!resendEnabled && (
            <span className="timer">
              in {timeLeft}s
            </span>
          )}

        </div>

      </div>
    </div>
  );
}

export default OTPverification;

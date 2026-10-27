
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setShake(false);

    // EMAIL VALIDATION
    if (email.trim() === "") {
      setError("Please enter your email.");
      setShake(true);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email.");
      setShake(true);
      return;
    }

    // PASSWORD VALIDATION
    if (password.trim() === "") {
      setError("Please enter your password.");
      setShake(true);
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      setShake(true);
      return;
    }

    // LOGIN API
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      // EMAIL NOT REGISTERED
      if (response.status === 404) {
        setError("Email id is not registered !");
        setShake(true);
        return;
      }

      // WRONG PASSWORD
      if (response.status === 401) {
        setError("Invalid credentials");
        setShake(true);
        return;
      }

      // OTHER BACKEND ERROR
      if (!response.ok) {
        setError(
          data.detail || "Something went wrong. Please try again."
        );
        setShake(true);
        return;
      }

      // VERIFY RESPONSE
      if (!data.success || !data.role) {
        setError("Invalid login response from server.");
        setShake(true);
        return;
      }

      // ADMIN LOGIN
      if (data.role === "admin") {
        if (!data.access_token) {
          setError("Admin authentication token was not received.");
          setShake(true);
          return;
        }

        // Clear any previous customer session
        localStorage.removeItem("user");

        // Store admin authentication token
        sessionStorage.setItem(
          "adminToken",
          data.access_token
        );

        setSuccess("Admin Login Successful! 🍦");

        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 800);

        return;
      }

      // CUSTOMER LOGIN
      if (data.role === "customer") {
        if (!data.user) {
          setError("Customer information was not received.");
          setShake(true);
          return;
        }

        // Clear any previous admin session
        sessionStorage.removeItem("adminToken");

        // Store customer information
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setSuccess("Login Successful! 🍦");

        setTimeout(() => {
          navigate("/flavormenu", { replace: true });
        }, 800);

        return;
      }

      // UNKNOWN ROLE
      setError("Unable to identify account type.");
      setShake(true);

    } catch (error) {
      console.error("Login Error:", error);

      setError(
        "Unable to connect to server. Please make sure backend is running."
      );

      setShake(true);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-decoration decoration1">
        🍦
      </div>

      <div className="login-decoration decoration2">
        🍓
      </div>

      <div className={`login-box ${shake ? "shake" : ""}`}>

        <div className="login-icon">
          🍦
        </div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to your ScoopAura account
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
                setShake(false);
              }}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
                setShake(false);
              }}
              autoComplete="current-password"
              required
            />

            <div className="forgot-password">
              <button
                type="button"
                onClick={() => navigate("/ForgotPassword")}
              >
                Forgot Password ?
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="success-message" role="status">
              ✅ {success}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Login 🍨"}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
        </p>

        <button
          type="button"
          className="create-account"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>

        <button
          type="button"
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
        <button
          type="button"
          className="delivery-agent-link"
          onClick={() => navigate("/delivery-agent/login")}
        >
          Delivery Agent? Login Here
        </button>
      </div>
    </div>
  );
}

export default Login

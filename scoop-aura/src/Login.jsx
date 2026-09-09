import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {

    e.preventDefault();

    setError("");

    setShake(false);

    if (email.trim() === "") {
      setError("Please enter your email.");
      setShake(true);
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email.");
      setShake(true);
      return;
    }

    if (password.trim() === "") {
      setError("Please enter your password.");
      setShake(true);
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      setShake(true);
      return;
    }

    alert("Login Successful! 🍦");

    navigate("/dashboard");
  };


  return (
    <div className="login-page">

      <div className="login-decoration decoration1">
        🍦
      </div>

      <div className="login-decoration decoration2">
        🍓
      </div>

      <div
        className={`login-box ${
          shake ? "shake" : ""
        }`}
      >

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
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}


          <button
            type="submit"
            className="login-submit"
          >
            Login 🍨
          </button>

        </form>


        <p className="register-text">
          Don't have an account?
        </p>

        <button
          className="create-account"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>


        <button
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Login;
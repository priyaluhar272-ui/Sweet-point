import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const [shake, setShake] = useState(false);


  const handleRegister = (e) => {

    e.preventDefault();

    setError("");
    setShake(false);


    if (name.trim() === "") {

      setError("Please enter your name.");
      setShake(true);

      return;
    }


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


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      setShake(true);

      return;
    }


    if (password !== confirmPassword) {

      setError("Passwords do not match.");
      setShake(true);

      return;
    }


    alert("Registration Successful! 🎉");

    navigate("/login");

  };


  return (
    <div className="register-page">

      <div className="register-decoration">
        🍨
      </div>

      <div
        className={`register-box ${
          shake ? "register-shake" : ""
        }`}
      >

        <div className="register-icon">
          🍦
        </div>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join the ScoopAura family
        </p>


        <form onSubmit={handleRegister}>

          {/* NAME */}

          <div className="register-input">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* EMAIL */}

          <div className="register-input">

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


          {/* PASSWORD */}

          <div className="register-input">

            <label>Password</label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          {/* CONFIRM */}

          <div className="register-input">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

          </div>


          {/* ERROR */}

          {error && (

            <div className="register-error">

              ⚠️ {error}

            </div>

          )}


          <button
            type="submit"
            className="register-submit"
          >
            Create Account 🎉
          </button>

        </form>


        <p className="already-account">
          Already have an account?
        </p>


        <button
          className="login-link"
          onClick={() => navigate("/login")}
        >
          Login
        </button>


        <button
          className="register-home"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Register;
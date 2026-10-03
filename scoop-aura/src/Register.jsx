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
  const [success, setSuccess] = useState("");

  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setShake(false);


    // NAME VALIDATION

    if (name.trim() === "") {

      setError("Please enter your name.");
      setShake(true);

      return;
    }


    // EMAIL VALIDATION

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


    // PASSWORD VALIDATION

    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      setShake(true);

      return;
    }


    // CONFIRM PASSWORD

    if (password !== confirmPassword) {

      setError("Passwords do not match.");
      setShake(true);

      return;
    }


    // SEND DATA TO FASTAPI

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password
          })
        }
      );


      const data = await response.json();


      // REGISTRATION SUCCESS

      if (response.ok && data.success) {

        setSuccess(
          "Registered Successfully! 🎉"
        );

        // Go to login after 2 seconds

        setTimeout(() => {
          navigate("/login");
        }, 2000);

      }


      // REGISTRATION FAILED

      else {

        setError(
          data.message || "Registration failed."
        );

        setShake(true);
      }

    }


    // SERVER CONNECTION ERROR

    catch (error) {

      console.error(
        "Registration Error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );

      setShake(true);

    }


    finally {

      setLoading(false);

    }

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="register-input">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={loading}
            />

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <div className="register-error">

              ⚠️ {error}

            </div>

          )}


          {/* SUCCESS MESSAGE */}

          {success && (

            <div className="register-success">

              ✅ {success}

              <div className="success-subtext">
                Redirecting to login...
              </div>

            </div>

          )}


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="register-submit"
            disabled={loading || success}
          >

            {loading
              ? "Creating Account..."
              : "Create Account 🎉"
            }

          </button>

        </form>


        <p className="already-account">
          Already have an account?
        </p>


        <button
          className="login-link"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Login
        </button>


        <button
          className="register-home"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          ← Back to Home
        </button>

      </div>

    </div>

  );
}

export default Register;
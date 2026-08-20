import React, { useState } from "react";

function Login({ goHome, goRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    alert("Login Successful! 🍦");
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        {/* LOGO */}
        <div className="login-logo">

          <div className="logo-icon">
            🍦
          </div>

          <div>
            <h1>ScoopAura</h1>
            <p>Moments of Sweetness</p>
          </div>

        </div>


        {/* ICE CREAM */}
        <div className="big-icecream">
          🍨
        </div>


        <h2>Welcome Back!</h2>

        <p className="description">
          Login to continue your sweet journey with
          delicious ice creams, special offers and
          exciting rewards.
        </p>


        {/* FEATURES */}
        <div className="features">

          <div className="feature">
            <span>🍨</span>
            <p>Explore Delicious Flavors</p>
          </div>

          <div className="feature">
            <span>💗</span>
            <p>Enjoy Couple Offers</p>
          </div>

          <div className="feature">
            <span>🎁</span>
            <p>Get Special Rewards</p>
          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          {/* BACK HOME */}
          <button
            type="button"
            className="back-home"
            onClick={goHome}
          >
            ← Back to Home
          </button>


          {/* LOGIN TITLE */}
          <div className="login-title">

            <div className="small-icon">
              🍦
            </div>

            <h2>Welcome Back!</h2>

            <p>
              Login to your ScoopAura account
            </p>

          </div>


          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="form-group">

              <label>Email Address</label>

              <div className="input-box">

                <span>✉️</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="form-group">

              <div className="password-header">

                <label>Password</label>

                <button
                  type="button"
                  className="forgot-btn"
                >
                  Forgot Password?
                </button>

              </div>


              <div className="input-box">

                <span>🔒</span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* REMEMBER ME */}
            <div className="remember">

              <input
                type="checkbox"
                id="remember"
              />

              <label htmlFor="remember">
                Remember me
              </label>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
            >
              Login →
            </button>

          </form>


          {/* REGISTER LINK */}
          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={goRegister}
            >
              Create Account
            </button>

          </div>

        </div>

      </div>


      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }


        .login-page {
          width: 100%;
          min-height: 100vh;

          display: flex;

          background:
            linear-gradient(
              135deg,
              #fff3f7,
              #f1e7ff
            );
        }


        /* =========================
           LEFT SIDE
        ========================= */

        .login-left {
          width: 50%;
          min-height: 100vh;

          padding: 50px 8%;

          display: flex;
          flex-direction: column;

          justify-content: center;

          background:
            linear-gradient(
              145deg,
              #ffe3ee,
              #eadcff
            );
        }


        .login-logo {
          display: flex;
          align-items: center;

          gap: 12px;
        }


        .logo-icon {
          font-size: 55px;
        }


        .login-logo h1 {
          color: #c82766;

          font-size: 38px;

          font-style: italic;
        }


        .login-logo p {
          font-size: 11px;

          letter-spacing: 2px;

          text-align: center;

          margin-top: 4px;
        }


        /* ICE CREAM */

        .big-icecream {
          text-align: center;

          font-size: 150px;

          margin: 25px 0;

          animation:
            floating 3s
            ease-in-out
            infinite;
        }


        @keyframes floating {

          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-15px);
          }

          100% {
            transform: translateY(0);
          }

        }


        .login-left h2 {
          text-align: center;

          font-size: 32px;

          margin-bottom: 12px;
        }


        .description {
          max-width: 500px;

          margin: auto;

          text-align: center;

          color: #625b70;

          font-size: 15px;

          line-height: 1.7;
        }


        /* FEATURES */

        .features {
          margin-top: 28px;

          display: flex;
          flex-direction: column;

          gap: 12px;
        }


        .feature {
          display: flex;

          align-items: center;

          gap: 15px;

          padding: 13px 18px;

          border-radius: 13px;

          background:
            rgba(
              255,
              255,
              255,
              0.65
            );
        }


        .feature span {
          font-size: 25px;
        }


        .feature p {
          font-size: 13px;

          font-weight: bold;

          color: #40394c;
        }


        /* =========================
           RIGHT SIDE
        ========================= */

        .login-right {
          width: 50%;
          min-height: 100vh;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 40px;
        }


        .login-card {
          width: 100%;
          max-width: 480px;

          padding: 35px 40px;

          border-radius: 25px;

          background: white;

          box-shadow:
            0 20px 55px
            rgba(
              50,
              20,
              60,
              0.12
            );
        }


        /* BACK BUTTON */

        .back-home {
          border: none;

          background: transparent;

          color: #ed286e;

          font-size: 13px;

          font-weight: bold;

          cursor: pointer;

          margin-bottom: 18px;
        }


        /* TITLE */

        .login-title {
          text-align: center;

          margin-bottom: 30px;
        }


        .small-icon {
          font-size: 40px;

          margin-bottom: 5px;
        }


        .login-title h2 {
          font-size: 29px;

          margin-bottom: 8px;
        }


        .login-title p {
          color: #85808e;

          font-size: 13px;
        }


        /* FORM */

        .form-group {
          margin-bottom: 20px;
        }


        .form-group label {
          display: block;

          margin-bottom: 7px;

          font-size: 13px;

          font-weight: bold;
        }


        /* PASSWORD HEADER */

        .password-header {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 7px;
        }


        .password-header label {
          margin-bottom: 0;
        }


        .forgot-btn {
          border: none;

          background: transparent;

          color: #ed286e;

          font-size: 11px;

          font-weight: bold;

          cursor: pointer;
        }


        /* INPUT */

        .input-box {
          width: 100%;

          height: 50px;

          display: flex;

          align-items: center;

          gap: 10px;

          padding: 0 14px;

          border: 1px solid #ded9e4;

          border-radius: 10px;

          transition: 0.2s;
        }


        .input-box:focus-within {
          border-color: #ed286e;

          box-shadow:
            0 0 0 3px
            rgba(
              237,
              40,
              110,
              0.08
            );
        }


        .input-box input {
          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          font-size: 13px;
        }


        /* EYE */

        .eye-btn {
          border: none;

          background: transparent;

          cursor: pointer;

          font-size: 16px;
        }


        /* REMEMBER */

        .remember {
          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 20px;

          color: #777;

          font-size: 12px;
        }


        .remember input {
          accent-color: #ed286e;
        }


        /* LOGIN BUTTON */

        .login-button {
          width: 100%;

          height: 52px;

          border: none;

          border-radius: 11px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #ed286e,
              #ff5590
            );

          font-size: 15px;

          font-weight: bold;

          cursor: pointer;

          transition: 0.3s;
        }


        .login-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 25px
            rgba(
              237,
              40,
              110,
              0.25
            );
        }


        /* REGISTER */

        .register-link {
          margin-top: 25px;

          text-align: center;

          font-size: 13px;

          color: #777;
        }


        .register-link button {
          border: none;

          background: transparent;

          color: #ed286e;

          font-weight: bold;

          cursor: pointer;

          margin-left: 5px;
        }


        .register-link button:hover {
          text-decoration: underline;
        }


        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 850px) {

          .login-page {
            flex-direction: column;
          }


          .login-left {
            width: 100%;

            min-height: auto;

            padding: 40px 20px;
          }


          .big-icecream {
            font-size: 100px;

            margin: 15px 0;
          }


          .features {
            display: none;
          }


          .login-right {
            width: 100%;

            min-height: auto;

            padding: 25px 15px;
          }

        }


        @media (max-width: 500px) {

          .login-card {
            padding: 25px 20px;
          }


          .login-logo h1 {
            font-size: 28px;
          }

        }

      `}</style>

    </div>
  );
}

export default Login;
function Register({ goHome }) {

  const handleSubmit = (event) => {

    event.preventDefault();

    alert(
      "🎉 Registration Successful! Welcome to ScoopAura!"
    );

  };


  return (

    <div className="register-page">


      {/* =================================
          LEFT SIDE
      ================================= */}

      <div className="register-left">


        {/* LOGO */}

        <div className="register-logo">

          <div className="register-logo-icon">
            🍦
          </div>

          <div>

            <h1>
              ScoopAura
            </h1>

            <p>
              Moments of Sweetness
            </p>

          </div>

        </div>


        {/* ICE CREAM */}

        <div className="big-icecream">
          🍨
        </div>


        <h2>
          Join the Sweetest Family!
        </h2>


        <p className="register-description">

          Create your ScoopAura account and enjoy
          delicious ice creams, special offers,
          table booking and exciting rewards.

        </p>


        {/* BENEFITS */}

        <div className="benefits">


          <div className="benefit">

            <span className="benefit-icon">
              🎁
            </span>

            <div>

              <b>
                Special Offers
              </b>

              <small>
                Exclusive discounts for members
              </small>

            </div>

          </div>


          <div className="benefit">

            <span className="benefit-icon">
              🪑
            </span>

            <div>

              <b>
                Easy Table Booking
              </b>

              <small>
                Book your favorite table easily
              </small>

            </div>

          </div>


          <div className="benefit">

            <span className="benefit-icon">
              💗
            </span>

            <div>

              <b>
                Couple Offers
              </b>

              <small>
                Make your moments sweeter
              </small>

            </div>

          </div>


        </div>

      </div>


      {/* =================================
          RIGHT SIDE
      ================================= */}

      <div className="register-right">


        <div className="register-card">


          {/* BACK BUTTON */}

          <button
            className="back-home"
            onClick={goHome}
          >

            ← Back to Home

          </button>


          {/* HEADING */}

          <div className="register-heading">

            <div className="register-small-icon">
              🍦
            </div>

            <h2>
              Create Account
            </h2>

            <p>
              Sign up to start your sweet journey 🍨
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>


            {/* FULL NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <span>
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span>
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <div className="input-wrapper">

                <span>
                  📱
                </span>

                <input
                  type="tel"
                  placeholder="Enter 10 digit number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  type="password"
                  placeholder="Create a password"
                  minLength="6"
                  required
                />

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span>
                  🔐
                </span>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  minLength="6"
                  required
                />

              </div>

            </div>


            {/* TERMS */}

            <div className="terms">

              <input
                type="checkbox"
                required
              />

              <p>

                I agree to the{" "}

                <a href="#">
                  Terms & Conditions
                </a>

                {" "}and{" "}

                <a href="#">
                  Privacy Policy
                </a>

              </p>

            </div>


            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="create-account"
            >

              Create Account →

            </button>


          </form>


          {/* LOGIN */}

          <div className="login-text">

            Already have an account?

            <a href="Login.jsx">
              Login
            </a>

          </div>


        </div>

      </div>


      {/* =================================
          CSS
      ================================= */}

      <style>{`

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }


        body {
          font-family: Arial, sans-serif;
        }


        .register-page {
          width: 100%;

          min-height: 100vh;

          display: flex;

          background:
            linear-gradient(
              135deg,
              #fff3f7,
              #f4e8ff
            );
        }


        /* =================================
           LEFT
        ================================= */

        .register-left {
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


        .register-logo {
          display: flex;

          align-items: center;

          gap: 12px;
        }


        .register-logo-icon {
          font-size: 55px;
        }


        .register-logo h1 {
          color: #c82766;

          font-size: 38px;

          font-style: italic;
        }


        .register-logo p {
          font-size: 11px;

          letter-spacing: 2px;

          text-align: center;
        }


        .big-icecream {
          text-align: center;

          font-size: 155px;

          margin: 20px 0;

          animation:
            registerFloat
            3s ease-in-out
            infinite;
        }


        @keyframes registerFloat {

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


        .register-left h2 {
          text-align: center;

          font-size: 31px;

          margin-bottom: 14px;
        }


        .register-description {
          max-width: 520px;

          margin: auto;

          text-align: center;

          color: #625b70;

          font-size: 15px;

          line-height: 1.7;
        }


        /* BENEFITS */

        .benefits {
          margin-top: 28px;

          display: flex;

          flex-direction: column;

          gap: 12px;
        }


        .benefit {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 13px 17px;

          border-radius: 13px;

          background:
            rgba(
              255,
              255,
              255,
              .65
            );
        }


        .benefit-icon {
          font-size: 28px;
        }


        .benefit div {
          display: flex;

          flex-direction: column;

          gap: 4px;
        }


        .benefit small {
          color: #777;

          font-size: 11px;
        }


        /* =================================
           RIGHT
        ================================= */

        .register-right {
          width: 50%;

          min-height: 100vh;

          display: flex;

          justify-content: center;

          align-items: center;

          padding: 40px;
        }


        .register-card {
          width: 100%;

          max-width: 510px;

          padding: 32px 40px;

          border-radius: 25px;

          background: white;

          box-shadow:
            0 20px 55px
            rgba(
              50,
              20,
              60,
              .12
            );
        }


        /* BACK */

        .back-home {
          border: none;

          background: transparent;

          color: #ed286e;

          font-size: 13px;

          font-weight: bold;

          cursor: pointer;

          margin-bottom: 10px;
        }


        /* HEADING */

        .register-heading {
          text-align: center;

          margin-bottom: 22px;
        }


        .register-small-icon {
          font-size: 38px;

          margin-bottom: 5px;
        }


        .register-heading h2 {
          font-size: 29px;

          margin-bottom: 7px;
        }


        .register-heading p {
          color: #85808e;

          font-size: 13px;
        }


        /* FORM */

        .form-group {
          margin-bottom: 14px;
        }


        .form-group label {
          display: block;

          margin-bottom: 6px;

          font-size: 13px;

          font-weight: bold;
        }


        .input-wrapper {
          width: 100%;

          height: 47px;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 0 13px;

          border: 1px solid #ded9e4;

          border-radius: 10px;

          transition: .2s;
        }


        .input-wrapper:focus-within {
          border-color: #ed286e;

          box-shadow:
            0 0 0 3px
            rgba(
              237,
              40,
              110,
              .08
            );
        }


        .input-wrapper input {
          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          font-size: 13px;
        }


        /* TERMS */

        .terms {
          display: flex;

          align-items: flex-start;

          gap: 8px;

          margin: 8px 0 18px;
        }


        .terms input {
          margin-top: 2px;

          accent-color: #ed286e;
        }


        .terms p {
          color: #777;

          font-size: 11px;

          line-height: 1.5;
        }


        .terms a {
          color: #ed286e;

          font-weight: bold;

          text-decoration: none;
        }


        /* BUTTON */

        .create-account {
          width: 100%;

          height: 50px;

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

          transition: .3s;
        }


        .create-account:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 25px
            rgba(
              237,
              40,
              110,
              .25
            );
        }


        /* LOGIN */

        .login-text {
          margin-top: 20px;

          text-align: center;

          color: #777;

          font-size: 13px;
        }


        .login-text a {
          margin-left: 5px;

          color: #ed286e;

          font-weight: bold;

          text-decoration: none;
        }


        /* =================================
           RESPONSIVE
        ================================= */

        @media (max-width: 850px) {

          .register-page {
            flex-direction: column;
          }


          .register-left {
            width: 100%;

            min-height: auto;

            padding: 40px 20px;
          }


          .big-icecream {
            font-size: 100px;
          }


          .benefits {
            display: none;
          }


          .register-right {
            width: 100%;

            min-height: auto;

            padding: 25px 15px;
          }

        }


        @media (max-width: 500px) {

          .register-card {
            padding: 25px 20px;
          }

        }

      `}</style>

    </div>

  );
}

export default Register;
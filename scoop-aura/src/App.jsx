import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("home");

  // =========================
  // LOGIN PAGE
  // =========================
  if (page === "login") {
    return (
      <Login
        goHome={() => setPage("home")}
        goRegister={() => setPage("register")}
      />
    );
  }

  // =========================
  // REGISTER PAGE
  // =========================
  if (page === "register") {
    return (
      <Register
        goHome={() => setPage("home")}
        goLogin={() => setPage("login")}
      />
    );
  }


  // DASHBOARD
  if (page === "dashboard") {
    return <Dashboard />;
  }
  

  // =========================
  // HOME PAGE
  // =========================
  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        {/* LOGO */}
        <div className="logo">

          <div className="logo-icon">
            🍦
          </div>

          <div>
            <h2>ScoopAura</h2>
            <p>Moments of Sweetness</p>
          </div>

        </div>


        {/* NAVIGATION */}
        <nav>

          <a href="#home">
            Home
          </a>

          <a href="#flavors">
            Flavors
          </a>

          <a href="#couple">
            Couple Offer
          </a>

          <a href="#table">
            Table Booking
          </a>

          <a href="#order">
            Order Online
          </a>

          <a href="#about">
            About Us
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>


        {/* BUTTONS */}
        <div className="nav-buttons">

          <button
            className="login-btn"
            onClick={() => setPage("login")}
          >
            Login
          </button>


          <button
            className="register-btn"
            onClick={() => setPage("register")}
          >
            Register
          </button>

          <button onClick={() => setPage("dashboard")}>
        Go to Dashboard
      </button>


        </div>

      </header>


      {/* ================= HERO ================= */}

      <section
        className="home-hero"
        id="home"
      >

        <div className="hero-content">

          <div className="sweet-label">
            🍦 Sweet Moments, Made for You
          </div>


          <h1>
            Life is Better with
            <br />

            <span>
              Ice Cream
            </span>{" "}
            ❤️
          </h1>


          <p>
            Indulge in creamy delights, exciting flavors
            and unforgettable moments with your loved one.
          </p>


          <div className="hero-buttons">

            <button className="order-btn">
              🍨 Order Now
            </button>


            <button className="table-btn">
              🪑 Book a Table
            </button>

          </div>

        </div>


        {/* BIG ICE CREAM */}

        <div className="hero-icecream">
          🍨
        </div>


        {/* TODAY SPECIAL */}

        <div className="offer-card">

          <div className="special">
            Today's Special
          </div>


          <div className="offer-image">
            🍓
          </div>


          <h3>
            Strawberry
            <br />
            Cheesecake
          </h3>


          <strong>
            Flat 20% OFF
          </strong>


          <button>
            Grab Now
          </button>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="feature-item">

          <div className="feature-icon">
            🛵
          </div>

          <h3>
            Fast Delivery
          </h3>

          <p>
            Quick & safe delivery
          </p>

        </div>


        <div className="feature-item">

          <div className="feature-icon">
            🪑
          </div>

          <h3>
            Table Booking
          </h3>

          <p>
            Book your perfect table
          </p>

        </div>


        <div className="feature-item">

          <div className="feature-icon">
            💗
          </div>

          <h3>
            Couple Offers
          </h3>

          <p>
            Special moments
          </p>

        </div>


        <div className="feature-item">

          <div className="feature-icon">
            🏆
          </div>

          <h3>
            Loyalty Points
          </h3>

          <p>
            Earn exciting rewards
          </p>

        </div>


        <div className="feature-item">

          <div className="feature-icon">
            🎁
          </div>

          <h3>
            Exciting Offers
          </h3>

          <p>
            Amazing deals everyday
          </p>

        </div>

      </section>


      {/* ================= POPULAR FLAVORS ================= */}

      <section
        className="flavors"
        id="flavors"
      >

        <h2>
          Popular Flavors 🍦
        </h2>


        <div className="flavor-grid">

          {/* CARD 1 */}

          <div className="flavor-card">

            <div className="flavor-img">
              🍫
            </div>

            <h3>
              Chocolate Bliss
            </h3>

            <p>
              ⭐ 4.8 (120)
            </p>

            <b>
              ₹120
            </b>

          </div>


          {/* CARD 2 */}

          <div className="flavor-card">

            <div className="flavor-img">
              🍓
            </div>

            <h3>
              Strawberry Delight
            </h3>

            <p>
              ⭐ 4.7 (98)
            </p>

            <b>
              ₹110
            </b>

          </div>


          {/* CARD 3 */}

          <div className="flavor-card">

            <div className="flavor-img">
              🥭
            </div>

            <h3>
              Mango Magic
            </h3>

            <p>
              ⭐ 4.6 (87)
            </p>

            <b>
              ₹115
            </b>

          </div>


          {/* CARD 4 */}

          <div className="flavor-card">

            <div className="flavor-img">
              🍃
            </div>

            <h3>
              Mint Choco Chip
            </h3>

            <p>
              ⭐ 4.8 (105)
            </p>

            <b>
              ₹120
            </b>

          </div>

        </div>

      </section>


      {/* ================= COUPLE OFFER ================= */}

      <section
        className="couple-offer"
        id="couple"
      >

        <div className="couple-icon">
          🎁
        </div>


        <div className="couple-text">

          <b>
            New Couple Offer:
          </b>

          {" "}
          Book a table and get up to
          {" "}

          <b>
            20% OFF
          </b>

        </div>


        <button>
          Explore Now →
        </button>

      </section>


      {/* ================= CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }


        body {
          font-family: Arial, sans-serif;
          color: #17142d;
          background: #ffffff;
        }


        button {
          cursor: pointer;
          font-family: inherit;
        }


        /* ================= NAVBAR ================= */

        .navbar {

          width: 96%;

          min-height: 82px;

          margin: 15px auto;

          padding: 12px 25px;

          display: flex;

          align-items: center;

          gap: 20px;

          background: white;

          border-radius: 20px;

          box-shadow:
            0 8px 30px
            rgba(0, 0, 0, 0.08);

        }


        /* LOGO */

        .logo {

          display: flex;

          align-items: center;

          gap: 10px;

          min-width: 205px;

        }


        .logo-icon {

          font-size: 45px;

        }


        .logo h2 {

          color: #c82766;

          font-size: 29px;

          font-style: italic;

        }


        .logo p {

          font-size: 10px;

          letter-spacing: 2px;

          margin-top: 3px;

        }


        /* NAV */

        nav {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 18px;

          flex: 1;

        }


        nav a {

          color: #17142d;

          text-decoration: none;

          font-size: 13px;

          white-space: nowrap;

          transition: 0.2s;

        }


        nav a:hover {

          color: #ed286e;

        }


        /* NAV BUTTONS */

        .nav-buttons {

          display: flex;

          gap: 8px;

        }


        .login-btn {

          padding: 11px 17px;

          border: 2px solid #ed286e;

          border-radius: 9px;

          color: #ed286e;

          background: white;

          font-weight: bold;

        }


        .login-btn:hover {

          background: #fff0f5;

        }


        .register-btn {

          padding: 12px 17px;

          border: none;

          border-radius: 9px;

          color: white;

          background: #ed286e;

          font-weight: bold;

        }


        .register-btn:hover {

          background: #d91e5f;

        }


        /* ================= HERO ================= */

        .home-hero {

          min-height: 580px;

          position: relative;

          overflow: hidden;

          display: flex;

          align-items: center;

          padding: 50px 10%;

          background:

            linear-gradient(

              110deg,

              #fff2f6,

              #ffdce9,

              #eadcff

            );

        }


        .hero-content {

          width: 55%;

          position: relative;

          z-index: 2;

        }


        .sweet-label {

          display: inline-block;

          padding: 12px 20px;

          border-radius: 30px;

          color: #d92768;

          background: #ffe5ef;

          font-weight: bold;

          margin-bottom: 20px;

        }


        .hero-content h1 {

          font-size: 58px;

          line-height: 1.1;

          margin-bottom: 20px;

        }


        .hero-content h1 span {

          color: #ed286e;

          font-style: italic;

        }


        .hero-content p {

          max-width: 560px;

          color: #514b5c;

          font-size: 17px;

          line-height: 1.6;

          margin-bottom: 25px;

        }


        /* HERO BUTTONS */

        .hero-buttons {

          display: flex;

          gap: 15px;

        }


        .order-btn {

          padding: 15px 28px;

          border: none;

          border-radius: 10px;

          color: white;

          background: #ed286e;

          font-weight: bold;

          font-size: 15px;

        }


        .table-btn {

          padding: 13px 27px;

          border: 2px solid #ed286e;

          border-radius: 10px;

          color: #ed286e;

          background: white;

          font-weight: bold;

          font-size: 15px;

        }


        /* BIG ICE CREAM */

        .hero-icecream {

          position: absolute;

          right: 27%;

          top: 105px;

          font-size: 180px;

          animation:

            floatIce 3s

            ease-in-out

            infinite;

        }


        @keyframes floatIce {

          0% {

            transform:
              translateY(0);

          }

          50% {

            transform:
              translateY(-18px);

          }

          100% {

            transform:
              translateY(0);

          }

        }


        /* OFFER CARD */

        .offer-card {

          position: absolute;

          right: 6%;

          top: 125px;

          width: 220px;

          padding: 23px;

          text-align: center;

          border-radius: 25px;

          background: white;

          box-shadow:

            0 15px 40px

            rgba(

              0,

              0,

              0,

              0.12

            );

        }


        .special {

          display: inline-block;

          padding: 9px 14px;

          border-radius: 20px;

          color: white;

          background: #ed286e;

          font-size: 12px;

          font-weight: bold;

        }


        .offer-image {

          font-size: 60px;

          margin: 12px 0;

        }


        .offer-card h3 {

          font-size: 18px;

          margin-bottom: 10px;

        }


        .offer-card strong {

          display: block;

          color: #ed286e;

          margin-bottom: 15px;

        }


        .offer-card button {

          padding: 10px 23px;

          border: none;

          border-radius: 8px;

          color: white;

          background: #ed286e;

          font-weight: bold;

        }


        /* ================= FEATURES ================= */

        .features {

          width: 88%;

          margin: -30px auto 40px;

          padding: 24px;

          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 15px;

          position: relative;

          z-index: 5;

          background: white;

          border-radius: 20px;

          box-shadow:

            0 10px 35px

            rgba(

              0,

              0,

              0,

              0.12

            );

        }


        .feature-item {

          text-align: center;

          padding: 5px;

          border-right:

            1px solid #eeeeee;

        }


        .feature-item:last-child {

          border-right: none;

        }


        .feature-icon {

          font-size: 30px;

        }


        .feature-item h3 {

          margin: 7px 0;

          font-size: 15px;

        }


        .feature-item p {

          color: #777;

          font-size: 12px;

        }


        /* ================= FLAVORS ================= */

        .flavors {

          width: 88%;

          margin: auto;

          padding-bottom: 45px;

        }


        .flavors > h2 {

          margin-bottom: 20px;

          font-size: 27px;

        }


        .flavor-grid {

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 20px;

        }


        .flavor-card {

          overflow: hidden;

          padding-bottom: 18px;

          border:

            1px solid #eeeeee;

          border-radius: 15px;

          background: white;

          transition: 0.3s;

        }


        .flavor-card:hover {

          transform:
            translateY(-5px);

          box-shadow:

            0 12px 30px

            rgba(

              0,

              0,

              0,

              0.08

            );

        }


        .flavor-img {

          height: 160px;

          display: grid;

          place-items: center;

          font-size: 80px;

          background: #ffe5ef;

        }


        .flavor-card h3 {

          margin:

            13px 15px 6px;

          font-size: 16px;

        }


        .flavor-card p {

          margin:

            0 15px 8px;

          color: #e6a000;

          font-size: 13px;

        }


        .flavor-card b {

          margin-left: 15px;

          color: #ed286e;

          font-size: 16px;

        }


        /* ================= COUPLE OFFER ================= */

        .couple-offer {

          width: 88%;

          margin:

            20px auto 50px;

          padding:

            18px 25px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 15px;

          border-radius: 25px;

          color: white;

          background:

            linear-gradient(

              90deg,

              #792bd5,

              #ed286e

            );

        }


        .couple-icon {

          font-size: 25px;

        }


        .couple-text {

          font-size: 14px;

        }


        .couple-offer button {

          padding:

            10px 18px;

          border: none;

          border-radius: 20px;

          color: #ed286e;

          background: white;

          font-weight: bold;

        }


        /* ================= RESPONSIVE ================= */

        @media (max-width: 1200px) {

          nav {

            gap: 10px;

          }

          nav a {

            font-size: 11px;

          }

        }


        @media (max-width: 950px) {

          nav {

            display: none;

          }

          .navbar {

            justify-content: space-between;

          }

          .hero-content {

            width: 100%;

          }

          .hero-content h1 {

            font-size: 45px;

          }

          .hero-icecream {

            display: none;

          }

          .offer-card {

            display: none;

          }

          .features {

            grid-template-columns:
              repeat(2, 1fr);

          }

          .flavor-grid {

            grid-template-columns:
              repeat(2, 1fr);

          }

        }


        @media (max-width: 600px) {

          .navbar {

            width: 94%;

            padding: 12px 15px;

          }

          .logo {

            min-width: auto;

          }

          .logo h2 {

            font-size: 23px;

          }

          .logo-icon {

            font-size: 35px;

          }

          .nav-buttons {

            gap: 5px;

          }

          .login-btn,

          .register-btn {

            padding:

              9px 10px;

            font-size: 11px;

          }

          .home-hero {

            padding: 45px 7%;

          }

          .hero-content h1 {

            font-size: 38px;

          }

          .hero-content p {

            font-size: 14px;

          }

          .hero-buttons {

            flex-direction: column;

          }

          .features {

            width: 92%;

          }

          .flavors {

            width: 92%;

          }

          .flavor-grid {

            grid-template-columns:
              1fr;

          }

          .couple-offer {

            width: 92%;

            flex-direction: column;

            text-align: center;

          }

        }

      `}</style>

    </div>
  );
}

export default App;
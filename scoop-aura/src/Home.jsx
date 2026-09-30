import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // =========================================
  // SLIDER DATA
  // =========================================

  const slides = [
    {
      title: "Chocolate",
      subtitle: "Lovers Paradise",
      description:
        "Rich, creamy and delicious chocolate ice cream for every mood.",
      emoji: "🍫",
      rating: "4.9 Rating",
      fresh: "🍨 Fresh Daily",
      love: "❤️ Made With Love",
    },

    {
      title: "Strawberry",
      subtitle: "Sweet Dreams",
      description:
        "Fresh, creamy and delicious strawberry ice cream made for happiness.",
      emoji: "🍓",
      rating: "4.8 Rating",
      fresh: "🍓 Fresh Daily",
      love: "❤️ Made With Love",
    },

    {
      title: "Mango",
      subtitle: "Summer Magic",
      description:
        "Enjoy the delicious tropical taste of fresh and creamy mango ice cream.",
      emoji: "🥭",
      rating: "4.9 Rating",
      fresh: "🥭 Fresh Daily",
      love: "❤️ Made With Love",
    },

    {
      title: "Vanilla",
      subtitle: "Classic Happiness",
      description:
        "A smooth, creamy and classic vanilla flavor that everyone loves.",
      emoji: "🍦",
      rating: "4.9 Rating",
      fresh: "🍦 Fresh Daily",
      love: "❤️ Made With Love",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // =========================================
  // AUTOMATIC SLIDER
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => {
        return (previous + 1) % slides.length;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // =========================================
  // NEXT SLIDE
  // =========================================

  const nextSlide = () => {
    setCurrentSlide((previous) => {
      return (previous + 1) % slides.length;
    });
  };

  // =========================================
  // PREVIOUS SLIDE
  // =========================================

  const previousSlide = () => {
    setCurrentSlide((previous) => {
      return previous === 0
        ? slides.length - 1
        : previous - 1;
    });
  };

  // =========================================
  // EXPLORE BUTTON
  // =========================================

  const exploreFlavors = () => {
    document
      .getElementById("flavors")
      .scrollIntoView({
        behavior: "smooth",
      });
  };

  // =========================================
  // OPEN FLAVOR MENU
  // =========================================

  const openFlavorMenu = (flavorName) => {
    navigate("/flavor-menu", {
      state: {
        flavor: flavorName,
      },
    });
  };

  return (
    <div className="home-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="navbar">

        <div className="logo">
          🍦
          <span>ScoopAura</span>
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#about">About</a>

          <a href="#flavors">Flavors</a>

          <a href="#contact">Contact</a>

        </div>

        <div className="nav-buttons">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </nav>


      {/* =====================================
          HERO SLIDER
      ===================================== */}

      <section
        className="hero"
        id="home"
      >

        {/* LEFT SIDE */}

        <div
          className="hero-content"
          key={currentSlide}
        >

          <div className="welcome-text">
            ✨ &nbsp; WELCOME TO SCOOPAURA
          </div>

          <h1>
            {slides[currentSlide].title}
            <br />

            <span>
              {slides[currentSlide].subtitle}
            </span>
          </h1>

          <p className="hero-description">
            {slides[currentSlide].description}
          </p>

          <div className="hero-buttons">

            <button
              className="order-btn"
              onClick={() => navigate("/register")}
            >
              Order Now 🍨
            </button>

            <button
              className="explore-btn"
              onClick={exploreFlavors}
            >
              Explore ↓
            </button>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div
          className="hero-visual"
          key={`visual-${currentSlide}`}
        >

          {/* Pink Circle */}

          <div className="pink-circle"></div>


          {/* Ice Cream */}

          <div className="icecream-container">

            <div className="icecream-emoji">
              {slides[currentSlide].emoji}
            </div>

          </div>


          {/* Rating */}

          <div className="floating-card rating-card">
            ⭐ &nbsp;
            {slides[currentSlide].rating}
          </div>


          {/* Fresh */}

          <div className="floating-card fresh-card">
            {slides[currentSlide].fresh}
          </div>


          {/* Love */}

          <div className="floating-card love-card">
            {slides[currentSlide].love}
          </div>

        </div>


        {/* LEFT ARROW */}

        <button
          className="slider-arrow arrow-left"
          onClick={previousSlide}
        >
          ❮
        </button>


        {/* RIGHT ARROW */}

        <button
          className="slider-arrow arrow-right"
          onClick={nextSlide}
        >
          ❯
        </button>


        {/* SLIDER DOTS */}

        <div className="slider-dots">

          {slides.map((_, index) => (

            <button
              key={index}
              className={
                currentSlide === index
                  ? "dot active"
                  : "dot"
              }
              onClick={() =>
                setCurrentSlide(index)
              }
            ></button>

          ))}

        </div>

      </section>


      {/* =====================================
          FEATURES
      ===================================== */}

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            🍨
          </div>

          <h3>
            Fresh Ice Cream
          </h3>

          <p>
            Freshly prepared every day.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ⭐
          </div>

          <h3>
            Premium Quality
          </h3>

          <p>
            Made with quality ingredients.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ❤️
          </div>

          <h3>
            Made With Love
          </h3>

          <p>
            Happiness in every scoop.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🚀
          </div>

          <h3>
            Quick Service
          </h3>

          <p>
            Fast and easy ordering.
          </p>

        </div>

      </section>


      {/* =====================================
          FLAVORS
      ===================================== */}

      <section
        className="flavors"
        id="flavors"
      >

        <div className="section-heading">

          <p>
            OUR SPECIALS
          </p>

          <h2>
            Popular Flavors 🍦
          </h2>

          <span>
            Choose your favorite flavor
          </span>

        </div>


        <div className="flavor-container">


          {/* =================================
              CHOCOLATE
          ================================= */}

          <div
            className="flavor-card"
            onClick={() =>
              openFlavorMenu("Chocolate Bliss")
            }
          >

            <div className="flavor-image">
              🍫
            </div>

            <h3>
              Chocolate Bliss
            </h3>

            <p>
              Rich • Creamy • Delicious
            </p>

            <strong>
          
            </strong>

            <button
              onClick={(event) => {
                event.stopPropagation();

                openFlavorMenu(
                  "Chocolate Bliss"
                );
              }}
            >
              Try Now
            </button>

          </div>


          {/* =================================
              STRAWBERRY
          ================================= */}

          <div
            className="flavor-card"
            onClick={() =>
              openFlavorMenu("Strawberry Dream")
            }
          >

            <div className="flavor-image">
              🍓
            </div>

            <h3>
              Strawberry Dream
            </h3>

            <p>
              Fresh • Sweet • Creamy
            </p>

            <strong>
          
            </strong>

            <button
              onClick={(event) => {
                event.stopPropagation();

                openFlavorMenu(
                  "Strawberry Dream"
                );
              }}
            >
              Try Now
            </button>

          </div>


          {/* =================================
              MANGO
          ================================= */}

          <div
            className="flavor-card"
            onClick={() =>
              openFlavorMenu("Mango Magic")
            }
          >

            <div className="flavor-image">
              🥭
            </div>

            <h3>
              Mango Magic
            </h3>

            <p>
              Fresh • Tropical • Sweet
            </p>

            <strong>
            
            </strong>

            <button
              onClick={(event) => {
                event.stopPropagation();

                openFlavorMenu(
                  "Mango Magic"
                );
              }}
            >
              Try Now
            </button>

          </div>


        </div>

      </section>


      {/* =====================================
          ABOUT
      ===================================== */}

      <section
        className="about"
        id="about"
      >

        <div className="about-image">
          🍦
        </div>

        <div className="about-content">

          <p className="about-title">
            ABOUT SCOOPAURA
          </p>

          <h2>
            Happiness Served
            <br />

            <span>
              One Scoop At A Time ❤️
            </span>
          </h2>

          <p>
            At ScoopAura, we believe that ice cream
            is more than just a dessert. It is a little
            moment of happiness. Enjoy delicious,
            creamy and freshly prepared ice cream
            with your favorite people.
          </p>

          <button
            onClick={() => navigate("/register")}
          >
            Start Your Sweet Journey →
          </button>

        </div>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer id="contact">

        <h2>
          🍦 ScoopAura
        </h2>

        <p>
          Making every moment sweeter ✨
        </p>

        <p>
          © 2026 ScoopAura Ice Cream Shop
        </p>

      </footer>

    </div>
  );
}

export default Home;
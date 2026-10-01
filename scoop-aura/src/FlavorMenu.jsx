

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlavorMenu.css";

// Ice cream images
import ChocolateImg from "./IMAGE/Bowl-of-chocolate-ice-cream.jpg";
import StrawberryImg from "./IMAGE/Strawberry.jfif";
import ButterscotchImg from "./IMAGE/Butterscotch.jfif";
import MangoImg from "./IMAGE/Mango.jfif";
import BrownieFudgeImg from "./IMAGE/Brownie Fudge.jfif";
import BlackCurrantImg from "./IMAGE/Black Currant.jfif";
import KesarPistaImg from "./IMAGE/Kesar Pista.jfif";
import RajbhogImg from "./IMAGE/Rajbhog.jfif";
import CookiesCreamImg from "./IMAGE/Cookies & Cream.jfif";
import ChocoChipImg from "./IMAGE/Choco Chip.jfif";
import MintChocolateImg from "./IMAGE/Mint Chocolate.jfif";
import BlueberryImg from "./IMAGE/Blueberry.jfif";
import CoffeeImg from "./IMAGE/Coffee.jfif";
import CaramelImg from "./IMAGE/Caramel.jfif";

const flavors = [
  {
    name: "Chocolate",
    description: "Rich & creamy chocolate",
    image: ChocolateImg,
    className: "chocolate",
  },
  {
    name: "Strawberry",
    description: "Fresh fruity sweetness",
    image: StrawberryImg,
    className: "strawberry",
  },
  {
    name: "Butterscotch",
    description: "Crunchy caramel magic",
    image: ButterscotchImg,
    className: "butterscotch",
  },
  {
    name: "Mango",
    description: "Taste of summer sunshine",
    image: MangoImg,
    className: "mango",
  },
  {
    name: "Brownie Fudge",
    description: "Brownie meets ice cream",
    image: BrownieFudgeImg,
    className: "brownie",
  },
  {
    name: "Black Currant",
    description: "Berrylicious happiness",
    image: BlackCurrantImg,
    className: "blackcurrant",
  },
  {
    name: "Kesar Pista",
    description: "Royal nutty goodness",
    image: KesarPistaImg,
    className: "kesar",
  },
  {
    name: "Rajbhog",
    description: "A royal Indian treat",
    image: RajbhogImg,
    className: "rajbhog",
  },
  {
    name: "Cookies & Cream",
    description: "Cookies in every bite",
    image: CookiesCreamImg,
    className: "cookies",
  },
  {
    name: "Choco Chip",
    description: "Chocolate chip heaven",
    image: ChocoChipImg,
    className: "chocochip",
  },
  {
    name: "Mint Chocolate",
    description: "Cool mint, rich chocolate",
    image: MintChocolateImg,
    className: "mint",
  },
  {
    name: "Blueberry",
    description: "Sweet and tangy berries",
    image: BlueberryImg,
    className: "blueberry",
  },
  {
    name: "Coffee",
    description: "Coffee lover's delight",
    image: CoffeeImg,
    className: "coffee",
  },
  {
    name: "Caramel",
    description: "Smooth golden sweetness",
    image: CaramelImg,
    className: "caramel",
  },
];

function FlavorMenu() {
  const sliderRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const moveSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector(".flavor-card");
    if (!card) return;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (direction === "next") {
      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: distance,
          behavior: "smooth",
        });
      }
    } else {
      if (slider.scrollLeft <= 5) {
        slider.scrollTo({
          left: maxScroll,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: -distance,
          behavior: "smooth",
        });
      }
    }
  };

  // Automatic slide every 3 seconds
  useEffect(() => {
    if (isHovering) return undefined;

    const timer = setInterval(() => {
      moveSlider("next");
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovering]);

  const selectFlavor = (flavor) => {
    // Selected flavor can be used on the next page.
    navigate("/flavor-items", {
      state: { flavor: flavor.name },
    });
  };

  return (
    <section className="flavor-section" id="flavors">
      {/* Heading */}
      <div className="flavor-intro">
        <div className="love-text">
          MADE WITH LOVE <span>♥</span>
        </div>

        <h2>
          Explore Our <span>Flavors</span>
        </h2>

        <p>
          Find your favorite scoop from our delicious collection.
        </p>

        <div className="intro-decoration">
          <span>✳</span> 🍦 <span>✳</span>
        </div>
      </div>

      {/* Slider */}
      <div
        className="flavor-carousel"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button
          type="button"
          className="slider-arrow slider-prev"
          onClick={() => moveSlider("prev")}
          aria-label="Previous flavors"
          title="Previous flavors"
        >
          &#10094;
        </button>

        <div className="flavor-grid" ref={sliderRef}>
          {flavors.map((flavor, index) => (
            <article
              className={`flavor-card ${flavor.className}`}
              key={flavor.name}
            >
              <div className="flavor-image-box">
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  className="flavor-image"
                />

                <span className="sparkle sparkle-one">✦</span>
                <span className="sparkle sparkle-two">✧</span>
              </div>

              <div className="flavor-content">
                <div className="flavor-number">
                  FLAVOR {String(index + 1).padStart(2, "0")}
                </div>

                <h3>{flavor.name}</h3>
                <p>{flavor.description}</p>

                <button
                  type="button"
                  className="explore-btn"
                  onClick={() => selectFlavor(flavor)}
                >
                  Explore Flavor <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="slider-arrow slider-next"
          onClick={() => moveSlider("next")}
          aria-label="Next flavors"
          title="Next flavors"
        >
          &#10095;
        </button>
      </div>

      <div className="slider-hint">
        <span>←</span> Explore all your favorite flavors{" "}
        <span>→</span>
      </div>

      <footer className="flavor-footer">
        🍦 Life is better with ice cream. <span>♥</span>
        <small>Made with love at ScoopAura</small>
      </footer>
    </section>
  );
}

export default FlavorMenu;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlavorMenu.css";

// Automatically load images from src/falvoricecream
// This code is for a Vite React project.
const imageModules = import.meta.glob(
  "./falvoricecream/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const normalize = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const imageFiles = Object.entries(imageModules)
  .map(([path, image]) => ({
    path,
    image,
    filename: path.split("/").pop().split(".")[0],
    normalized: normalize(path.split("/").pop().split(".")[0]),
  }))
  .sort((a, b) => a.filename.localeCompare(b.filename));

const flavors = [
  {
    name: "Chocolate",
    description: "Rich & creamy chocolate",
    emoji: "🍫",
    className: "chocolate",
    aliases: ["bowl of chocolate ice cream", "choclate"],
  },
  {
    name: "Strawberry",
    description: "Fresh fruity sweetness",
    emoji: "🍓",
    className: "strawberry",
    aliases: ["strawberry"],
  },
  {
    name: "Butterscotch",
    description: "Crunchy caramel magic",
    emoji: "🍮",
    className: "butterscotch",
    aliases: ["butterscotch"],
  },
  {
    name: "Mango",
    description: "Taste of summer sunshine",
    emoji: "🥭",
    className: "mango",
    aliases: ["mango"],
  },
  {
    name: "Brownie Fudge",
    description: "Brownie meets ice cream",
    emoji: "🍫",
    className: "brownie",
    aliases: ["brownie fudge", "rownie fudge"],
  },
  {
    name: "Black Currant",
    description: "Berrylicious happiness",
    emoji: "🫐",
    className: "blackcurrant",
    aliases: ["black currant"],
  },
  {
    name: "Kesar Pista",
    description: "Royal nutty goodness",
    emoji: "💚",
    className: "kesar",
    aliases: ["kesar pista"],
  },
  {
    name: "Rajbhog",
    description: "A royal Indian treat",
    emoji: "👑",
    className: "rajbhog",
    aliases: ["rajbhog"],
  },
  {
    name: "Cookies & Cream",
    description: "Cookies in every bite",
    emoji: "🍪",
    className: "cookies",
    aliases: ["cookies and cream", "cookies cream"],
  },
  {
    name: "Choco Chip",
    description: "Chocolate chip heaven",
    emoji: "🍫",
    className: "chocochip",
    aliases: ["choco chip"],
  },
  {
    name: "Mint Chocolate",
    description: "Cool mint, rich chocolate",
    emoji: "🌿",
    className: "mint",
    aliases: ["mint chocolate"],
  },
  {
    name: "Blueberry",
    description: "Sweet and tangy berries",
    emoji: "🫐",
    className: "blueberry",
    aliases: ["blueberry"],
  },
  {
    name: "Coffee",
    description: "Coffee lover's delight",
    emoji: "☕",
    className: "coffee",
    aliases: ["coffee"],
  },
  {
    name: "Caramel",
    description: "Smooth golden sweetness",
    emoji: "🍯",
    className: "caramel",
    aliases: ["caramel"],
  },
  {
    name: "Vanilla",
    description: "Classic creamy happiness",
    emoji: "🍨",
    className: "vanilla",
    aliases: ["vanilla", "vanila"],
  },
];

// Find a matching image for each flavor card
const getFlavorImage = (flavor) => {
  for (const alias of flavor.aliases) {
    const searchName = normalize(alias);

    const match = imageFiles.find((file) =>
      file.normalized.includes(searchName)
    );

    if (match) return match.image;
  }

  return null;
};

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
    const gap =
      parseFloat(styles.columnGap) ||
      parseFloat(styles.gap) ||
      0;

    const distance = card.getBoundingClientRect().width + gap;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (maxScroll <= 0) return;

    if (direction === "next") {
      if (slider.scrollLeft >= maxScroll - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: distance, behavior: "smooth" });
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

  // Automatic sliding pauses while the user hovers over the cards
  useEffect(() => {
    if (isHovering) return undefined;

    const timer = setInterval(() => {
      moveSlider("next");
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovering]);

  // Open the selected flavor's items page
  const selectFlavor = (flavor) => {
    navigate("/flavor-items", {
      state: {
        flavor: flavor.name,
      },
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

      {/* Flavor slider */}
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
        >
          &#10094;
        </button>

        <div className="flavor-grid" ref={sliderRef}>
          {flavors.map((flavor, index) => {
            const flavorImage = getFlavorImage(flavor);

            return (
              <article
                className={`flavor-card ${flavor.className}`}
                key={flavor.name}
              >
                <div
                  className="flavor-image-box"
                  onClick={() => selectFlavor(flavor)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      selectFlavor(flavor);
                    }
                  }}
                  aria-label={`View ${flavor.name} ice creams`}
                  style={{ cursor: "pointer" }}
                >
                  {flavorImage ? (
                    <img
                      src={flavorImage}
                      alt={flavor.name}
                      className="flavor-image"
                    />
                  ) : (
                    <div
                      className="flavor-image-fallback"
                      style={{
                        fontSize: "90px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      {flavor.emoji}
                    </div>
                  )}

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
            );
          })}
        </div>

        <button
          type="button"
          className="slider-arrow slider-next"
          onClick={() => moveSlider("next")}
          aria-label="Next flavors"
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
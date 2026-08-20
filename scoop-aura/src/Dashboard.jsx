// Commented
import React, { useState } from "react";

function Dashboard() {
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [cart, setCart] = useState([]);

  const flavors = [
    {
      id: 1,
      name: "Chocolate Bliss",
      icon: "🍫",
      rating: "4.8",
      reviews: "120",
      items: [
        { id: 11, name: "Chocolate Sundae", price: 120, image: "🍨" },
        { id: 12, name: "Chocolate Cone", price: 100, image: "🍦" },
        { id: 13, name: "Chocolate Cup", price: 90, image: "🍫" },
        { id: 14, name: "Double Chocolate", price: 150, image: "🍨" }
      ]
    },
    {
      id: 2,
      name: "Strawberry Delight",
      icon: "🍓",
      rating: "4.7",
      reviews: "98",
      items: [
        { id: 21, name: "Strawberry Sundae", price: 130, image: "🍓" },
        { id: 22, name: "Strawberry Cone", price: 110, image: "🍦" },
        { id: 23, name: "Strawberry Cup", price: 100, image: "🍨" },
        { id: 24, name: "Strawberry Special", price: 150, image: "🍓" }
      ]
    },
    {
      id: 3,
      name: "Mango Magic",
      icon: "🥭",
      rating: "4.6",
      reviews: "87",
      items: [
        { id: 31, name: "Mango Sundae", price: 125, image: "🥭" },
        { id: 32, name: "Mango Cone", price: 110, image: "🍦" },
        { id: 33, name: "Mango Cup", price: 95, image: "🍨" },
        { id: 34, name: "Mango Special", price: 145, image: "🥭" }
      ]
    },
    {
      id: 4,
      name: "Mint Choco Chip",
      icon: "🌿",
      rating: "4.8",
      reviews: "105",
      items: [
        { id: 41, name: "Mint Sundae", price: 130, image: "🍨" },
        { id: 42, name: "Mint Cone", price: 115, image: "🍦" },
        { id: 43, name: "Mint Cup", price: 105, image: "🌿" },
        { id: 44, name: "Mint Choco Special", price: 155, image: "🍨" }
      ]
    }
  ];

  // Flavor click
  const handleFlavorClick = (flavor) => {
    setSelectedFlavor(flavor);
  };

  // Add to cart
  const addToCart = (item) => {
    const existing = cart.find((x) => x.id === item.id);

    if (existing) {
      setCart(
        cart.map((x) =>
          x.id === item.id
            ? { ...x, quantity: x.quantity + 1 }
            : x
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Cart quantity
  const increase = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="logo">
          🍦
          <div>
            <h2>ScoopAura</h2>
            <small>Moments of Sweetness</small>
          </div>
        </div>

        <nav>
          <a href="/">Home</a>
          <a href="#flavors">Flavors</a>
          <a href="#offers">Couple Offer</a>
          <a href="#cart">Cart 🛒</a>
        </nav>

        <div className="profile">
          👤 Priya
        </div>

      </header>


      {/* ================= WELCOME ================= */}

      <section className="welcome">

        <div>
          <p>Welcome back 👋</p>

          <h1>
            What are you craving today?
          </h1>

          <span>
            Choose your favorite ice cream
            and enjoy your sweet moment.
          </span>
        </div>

        <div className="welcome-ice">
          🍨
        </div>

      </section>


      {/* ================= POPULAR FLAVORS ================= */}

      <section className="popular" id="flavors">

        <h2>
          Popular Flavors 🍦
        </h2>

        <p className="subtitle">
          Click on a flavor to see all available items
        </p>


        <div className="flavor-grid">

          {flavors.map((flavor) => (

            <div
              className="flavor-card"
              key={flavor.id}
              onClick={() => handleFlavorClick(flavor)}
            >

              <div className="flavor-image">
                {flavor.icon}
              </div>

              <div className="flavor-info">

                <h3>
                  {flavor.name}
                </h3>

                <p className="rating">
                  ⭐ {flavor.rating} ({flavor.reviews})
                </p>

                <span>
                  View Items →
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* ================= ITEMS ================= */}

        {selectedFlavor && (

          <section className="items-section">

            <div className="items-header">

              <div>
                <h2>
                  {selectedFlavor.icon}{" "}
                  {selectedFlavor.name}
                </h2>

                <p>
                  Select your favorite item
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() => setSelectedFlavor(null)}
              >
                ✕ Close
              </button>

            </div>


            <div className="items-grid">

              {selectedFlavor.items.map(
                (item, index) => (

                  <div
                    className="item-card"
                    key={item.id}
                    style={{
                      animationDelay:
                        `${index * 0.15}s`
                    }}
                  >

                    <div className="item-image">
                      {item.image}
                    </div>

                    <div className="item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ⭐ 4.8
                      </p>

                      <div className="item-bottom">

                        <strong>
                          ₹{item.price}
                        </strong>

                        <button
                          onClick={() =>
                            addToCart(item)
                          }
                        >
                          🛒 Add
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

      </section>


      {/* ================= CART ================= */}

      <section className="cart-section" id="cart">

        <h2>
          🛒 My Cart
        </h2>

        {cart.length === 0 ? (

          <div className="empty-cart">
            🛒
            <h3>Your cart is empty</h3>
            <p>
              Select an ice cream and click Add.
            </p>
          </div>

        ) : (

          <div className="cart-box">

            <div className="cart-items">

              {cart.map((item) => (

                <div className="cart-item" key={item.id}>

                  <div className="cart-emoji">
                    {item.image}
                  </div>

                  <div className="cart-name">
                    <h3>{item.name}</h3>
                    <p>₹{item.price} each</p>
                  </div>

                  <div className="quantity">

                    <button
                      onClick={() =>
                        decrease(item.id)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increase(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                </div>

              ))}

            </div>


            <div className="summary">

              <h3>
                Order Summary
              </h3>

              <p>
                Items: {totalItems}
              </p>

              <p>
                Delivery: <b className="free">FREE</b>
              </p>

              <hr />

              <h2>
                Total: ₹{totalPrice}
              </h2>

              <button
                className="checkout"
                onClick={() =>
                  alert("Checkout page coming soon!")
                }
              >
                Proceed to Checkout →
              </button>

            </div>

          </div>

        )}

      </section>


      {/* ================= OFFER ================= */}

      <section className="offer" id="offers">

        <div>
          💗
        </div>

        <div>
          <h2>
            Special Couple Offer
          </h2>

          <p>
            Book a table and get up to
            <b> 20% OFF</b>
          </p>
        </div>

        <button>
          Explore Offer →
        </button>

      </section>


      {/* ================= CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #fff;
          color: #17172f;
        }

        button {
          cursor: pointer;
        }


        /* NAVBAR */

        .navbar {
          width: 94%;
          margin: 15px auto;

          padding: 15px 25px;

          display: flex;
          align-items: center;

          background: white;

          border-radius: 18px;

          box-shadow:
            0 5px 25px
            rgba(0,0,0,0.08);

          gap: 30px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;

          min-width: 210px;
        }

        .logo:first-letter {
          font-size: 40px;
        }

        .logo h2 {
          margin: 0;
          color: #ed286e;
          font-style: italic;
        }

        .logo small {
          color: #777;
        }

        .navbar nav {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex: 1;
        }

        .navbar nav a {
          text-decoration: none;
          color: #222;
          font-size: 14px;
        }

        .navbar nav a:hover {
          color: #ed286e;
        }

        .profile {
          background: #ffe5ef;
          padding: 10px 15px;
          border-radius: 20px;
          color: #ed286e;
          font-weight: bold;
        }


        /* WELCOME */

        .welcome {
          width: 94%;
          margin: 25px auto;

          padding: 35px 50px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          border-radius: 25px;

          background:
            linear-gradient(
              110deg,
              #ffe7f0,
              #eee2ff
            );
        }

        .welcome p {
          color: #ed286e;
          font-weight: bold;
        }

        .welcome h1 {
          font-size: 38px;
          margin: 10px 0;
        }

        .welcome span {
          color: #777;
        }

        .welcome-ice {
          font-size: 120px;

          animation:
            floatIce
            3s
            infinite
            ease-in-out;
        }

        @keyframes floatIce {

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


        /* POPULAR */

        .popular {
          padding: 20px 40px;
        }

        .popular > h2 {
          font-size: 30px;
          margin-bottom: 5px;
        }

        .subtitle {
          color: #888;
          font-size: 13px;
          margin-bottom: 25px;
        }


        /* FLAVOR CARDS */

        .flavor-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 25px;
        }

        .flavor-card {
          background: white;

          border-radius: 18px;

          overflow: hidden;

          border: 1px solid #eee;

          cursor: pointer;

          transition:
            transform 0.3s,
            box-shadow 0.3s;
        }

        .flavor-card:hover {
          transform:
            translateY(-8px)
            scale(1.02);

          box-shadow:
            0 15px 30px
            rgba(0,0,0,0.12);
        }

        .flavor-image {
          height: 200px;

          display: flex;
          justify-content: center;
          align-items: center;

          background: #ffe5ef;

          font-size: 95px;

          transition: 0.4s;
        }

        .flavor-card:hover .flavor-image {
          transform: scale(1.08);
        }

        .flavor-info {
          padding: 18px;
        }

        .flavor-info h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .rating {
          color: #e99b00;
          font-size: 13px;
        }

        .flavor-info span {
          display: block;

          margin-top: 12px;

          color: #ed286e;

          font-size: 13px;

          font-weight: bold;
        }


        /* ITEMS SECTION */

        .items-section {
          margin-top: 40px;

          padding: 30px;

          border-radius: 25px;

          background:
            linear-gradient(
              120deg,
              #fff0f5,
              #f4ecff
            );

          animation:
            sectionShow
            0.5s
            ease;
        }

        @keyframes sectionShow {

          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 25px;
        }

        .items-header h2 {
          margin: 0;
          font-size: 25px;
        }

        .items-header p {
          color: #888;
        }

        .close-btn {
          border: none;

          padding: 10px 18px;

          border-radius: 20px;

          background: white;

          color: #ed286e;

          font-weight: bold;
        }


        /* ITEMS */

        .items-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 22px;
        }

        .item-card {
          background: white;

          border-radius: 18px;

          overflow: hidden;

          opacity: 0;

          animation:
            itemShow
            0.6s
            ease
            forwards;

          transition: 0.3s;

          box-shadow:
            0 5px 20px
            rgba(0,0,0,0.08);
        }

        .item-card:hover {
          transform: translateY(-8px);

          box-shadow:
            0 15px 30px
            rgba(0,0,0,0.15);
        }

        @keyframes itemShow {

          0% {
            opacity: 0;

            transform:
              translateY(40px)
              scale(0.85);
          }

          100% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }

        }

        .item-image {
          height: 180px;

          display: flex;
          justify-content: center;
          align-items: center;

          background: #ffe5ef;

          font-size: 85px;
        }

        .item-info {
          padding: 16px;
        }

        .item-info h3 {
          margin: 0 0 8px;
          font-size: 16px;
        }

        .item-info p {
          color: #e99b00;
        }

        .item-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-bottom strong {
          color: #ed286e;
          font-size: 18px;
        }

        .item-bottom button {
          border: none;

          padding: 9px 13px;

          border-radius: 9px;

          background: #ed286e;

          color: white;

          font-weight: bold;
        }

        .item-bottom button:hover {
          background: #c91e5c;
          transform: scale(1.05);
        }


        /* CART */

        .cart-section {
          width: 94%;
          margin: 40px auto;

          padding: 30px;

          background: white;

          border-radius: 20px;

          box-shadow:
            0 5px 25px
            rgba(0,0,0,0.07);
        }

        .cart-section > h2 {
          margin-bottom: 25px;
        }

        .empty-cart {
          text-align: center;
          padding: 40px;
          color: #888;
        }

        .empty-cart:first-letter {
          font-size: 50px;
        }

        .cart-box {
          display: grid;

          grid-template-columns:
            1fr 300px;

          gap: 25px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 15px;

          padding: 12px;

          border: 1px solid #eee;

          border-radius: 12px;
        }

        .cart-emoji {
          width: 60px;
          height: 60px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #ffe5ef;

          font-size: 35px;
        }

        .cart-name {
          flex: 1;
        }

        .cart-name h3 {
          margin: 0 0 5px;
          font-size: 14px;
        }

        .cart-name p {
          margin: 0;
          color: #999;
          font-size: 11px;
        }

        .quantity {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity button {
          width: 28px;
          height: 28px;

          border: 1px solid #ddd;

          border-radius: 7px;

          background: white;
        }

        .summary {
          padding: 20px;

          background: #fff4f8;

          border-radius: 15px;
        }

        .summary p {
          color: #777;
          font-size: 14px;
        }

        .free {
          color: green;
        }

        .checkout {
          width: 100%;

          padding: 13px;

          border: none;

          border-radius: 10px;

          background: #ed286e;

          color: white;

          font-weight: bold;
        }


        /* OFFER */

        .offer {
          width: 94%;

          margin: 30px auto 50px;

          padding: 22px 30px;

          display: flex;

          align-items: center;

          gap: 20px;

          border-radius: 20px;

          background:
            linear-gradient(
              90deg,
              #792bd5,
              #ed286e
            );

          color: white;
        }

        .offer > div:first-child {
          font-size: 35px;
        }

        .offer h2 {
          margin: 0 0 5px;
        }

        .offer p {
          margin: 0;
        }

        .offer button {
          margin-left: auto;

          padding: 11px 20px;

          border: none;

          border-radius: 20px;

          background: white;

          color: #ed286e;

          font-weight: bold;
        }


        /* RESPONSIVE */

        @media (max-width: 1000px) {

          .flavor-grid,
          .items-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .cart-box {
            grid-template-columns: 1fr;
          }

          .navbar nav {
            display: none;
          }

        }

        @media (max-width: 600px) {

          .flavor-grid,
          .items-grid {
            grid-template-columns: 1fr;
          }

          .welcome {
            padding: 25px;
          }

          .welcome h1 {
            font-size: 25px;
          }

          .welcome-ice {
            font-size: 70px;
          }

          .popular {
            padding: 20px;
          }

          .items-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .offer {
            flex-direction: column;
            text-align: center;
          }

          .offer button {
            margin-left: 0;
          }

        }

      `}</style>

    </div>
  );
}

export default Dashboard;
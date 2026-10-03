import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import FlavorMenu from "./FlavorMenu";
import FlavorItems from "./FlavorItems";
import Dashboard from "./Dashboard";
import Checkout from "./Checkout";
import MyBookings from "./MyBookings";
import OrderHistory from "./OrderHistory";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flavormenu" element={<FlavorMenu />} />
         <Route path="/flavor-items" element={<FlavorItems />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

import DeliveryAgentSignup from "./DeliveryAgent/DeliveryAgentSignup";
import DeliveryAgentLogin from "./DeliveryAgent/DeliveryAgentLogin";
import DeliveryAgentDashboard from "./DeliveryAgent/DeliveryAgentDashboard";
import ForgotPassword from "./ForgotPassword";
import OTPverification from "./OTPverification";

import FlavorMenu from "./FlavorMenu";
<<<<<<< HEAD
import FlavorItems from "./FlavorItems";
import Dashboard from "./Dashboard";
import Checkout from "./Checkout";
import MyBookings from "./MyBookings";
import OrderHistory from "./OrderHistory";

=======
import ResetPassword from "./ResetPassword";
>>>>>>> 6014294d012e1dbda88c02ee8d57fe8ea20aae9e

function App() {
  return (
    <BrowserRouter>
      <Routes>


        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="DeliveryAgent/DeliveryAgentSignup"
          element={<DeliveryAgentSignup />}
        />
        <Route
          path="/DeliveryAgent/DeliveryAgentLogin"
          element={<DeliveryAgentLogin />}
        />
        <Route
          path="/DeliveryAgent/DeliveryAgentDashboard"
          element={<DeliveryAgentDashboard />}
        />
        <Route
          path="/ForgotPassword"
          element={<ForgotPassword />}
        />
        <Route
          path="/ResetPassword"
          element={<ResetPassword/>}
        />
        <Route
          path="/ResetPassword"
          element={<ResetPassword/>}
        />
        <Route
          path="/OTPverification"
          element={<OTPverification/>}
        />
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flavormenu" element={<FlavorMenu />} />
<<<<<<< HEAD
         <Route path="/flavor-items" element={<FlavorItems />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/order-history" element={<OrderHistory />} />
=======

>>>>>>> 6014294d012e1dbda88c02ee8d57fe8ea20aae9e
      </Routes>
    </BrowserRouter>
  );
}

export default App;
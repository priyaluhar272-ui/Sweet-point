
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

import DeliveryAgentSignup from "./DeliveryAgent/DeliveryAgentSignup";
import DeliveryAgentLogin from "./DeliveryAgent/DeliveryAgentLogin";
import DeliveryAgentDashboard from "./DeliveryAgent/DeliveryAgentDashboard";

import ForgotPassword from "./ForgotPassword";
import OTPverification from "./OTPverification";
import ResetPassword from "./ResetPassword";

import AdminDashboard from "./admin/AdminDashboard";
import ManageFlavours from "./ManageFlavours";
import ManageCustomers from "./ManageCustomers";
import ManageDeliveryAgents from "./ManageDeliveryAgents";
import AdminOrders from "./AdminOrders";
import ManageItems from "./ManageItems";

import FlavorMenu from "./FlavorMenu";
import FlavorItems from "./FlavorItems";
import Dashboard from "./Dashboard";
import Checkout from "./Checkout";
import MyBookings from "./MyBookings";
import OrderHistory from "./OrderHistory";
import Payment from "./Payment";
import OrderSuccess from "./OrderSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Forgot password */}
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/OTPverification" element={<OTPverification />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        {/* Delivery Agent */}
        <Route
          path="/delivery-agent/register"
          element={<DeliveryAgentSignup />}
        />

        <Route
          path="/delivery-agent/login"
          element={<DeliveryAgentLogin />}
        />

        <Route
          path="/delivery-agent/dashboard"
          element={<DeliveryAgentDashboard />}
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/flavours"
          element={<ManageFlavours />}
        />
        <Route
          path="/admin/customers"
          element={<ManageCustomers />}
        />
        <Route
          path="/admin/delivery-agents"
          element={<ManageDeliveryAgents />}
        />
        <Route
          path="/admin/orders"
          element={<AdminOrders />} />

        <Route
          path="/admin/items"
          element={<ManageItems />}
        />

        {/* Customer pages */}
        <Route path="/flavormenu" element={<FlavorMenu />} />
        <Route path="/flavor-items" element={<FlavorItems />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/order-history" element={<OrderHistory />} />

        {/* Payment */}
        <Route path="/Payment" element={<Payment />} />
        <Route path="/OrderSuccess" element={<OrderSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
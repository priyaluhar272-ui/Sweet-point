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
import ResetPassword from "./ResetPassword";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
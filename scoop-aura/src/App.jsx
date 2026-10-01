import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
<<<<<<< HEAD
import DeliveryAgentSignup from "./DeliveryAgent/DeliveryAgentSignup";
import DeliveryAgentLogin from "./DeliveryAgent/DeliveryAgentLogin";
import DeliveryAgentDashboard from "./DeliveryAgent/DeliveryAgentDashboard";
import ForgotPassword from "./ForgotPassword";

=======
import FlavorMenu from "./FlavorMenu";
>>>>>>> 37bbbccb427b871a3f8acc4a3af69f3b73eb509e

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD

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
          path="/forgot-password"
          element={<ForgotPassword />}
        />
      </Routes>
      

=======
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flavormenu" element={<FlavorMenu />} />
      </Routes>
>>>>>>> 37bbbccb427b871a3f8acc4a3af69f3b73eb509e
    </BrowserRouter>
  );
}

export default App;
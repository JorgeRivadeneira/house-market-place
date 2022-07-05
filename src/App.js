import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Explore } from "./pages/Explore";
import { Offers } from "./pages/Offers";
import { Profile } from "./pages/Profile";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<Signin />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Navbar />
    </Router>
      
    </>
  );
}

export default App;

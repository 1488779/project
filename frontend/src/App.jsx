import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";

import VolunteerRegister from "./pages/VolunteerRegister";
import ShelterRegister from "./pages/ShelterRegister";
import OverexposureRegister from "./pages/OverexposureRegister";

function App() {
  return (
    <>
      <div className="font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/register/volunteer" element={<VolunteerRegister />} />
          <Route path="/register/shelter" element={<ShelterRegister />} />
          <Route path="/register/overexposure" element={<OverexposureRegister />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
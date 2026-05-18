import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import LoginPage from "./pages/LoginPage";

import VolunteerRegister from "./pages/VolunteerRegister";
import ShelterRegister from "./pages/ShelterRegister";
import OverexposureRegister from "./pages/OverexposureRegister";

import AnimalsPage from "./pages/AnimalsPage";
import HowToHelp from "./pages/HowToHelp";
import SheltersPage from "./pages/SheltersPage";
import AboutProject from "./pages/AboutProject";

AboutProject


function App() {
  return (
    <>
      <div className="font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/register/volunteer" element={<VolunteerRegister />} />
          <Route path="/register/shelter" element={<ShelterRegister />} />
          <Route path="/register/overexposure" element={<OverexposureRegister />} />
          <Route path="/animals-page" element={<AnimalsPage />} />
          <Route path="/how-to-help" element={<HowToHelp />} />
          <Route path="/shelters-page" element={<SheltersPage />} />
          <Route path="/about-project" element={<AboutProject />} />
          AboutProject
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
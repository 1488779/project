import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import LoginPage from "./pages/LoginPage";

import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerRegister2 from "./components/VolunteerRegister/VolunteerRegister2";
import VolunteerRegister3 from "./components/VolunteerRegister/VolunteerRegister3";


import CuratorRegister from "./pages/CuratorRegister";
import CuratorRegister2 from "./components/CuratorRegister/CuratorRegister2";

import OwnerRegister from "./pages/OwnerRegister";

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
          <Route path="/volunteer-register-2" element={<VolunteerRegister2 />} />
          <Route path="/volunteer-register-3" element={<VolunteerRegister3 />} />
          <Route path="/register/curator" element={<CuratorRegister />} />
          <Route path="/curator-register-2" element={<CuratorRegister2 />} />
          <Route path="/register/owner" element={<OwnerRegister />} />
          <Route path="/animals-page" element={<AnimalsPage />} />
          <Route path="/how-to-help" element={<HowToHelp />} />
          <Route path="/shelters-page" element={<SheltersPage />} />
          <Route path="/about-project" element={<AboutProject />} />
          
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
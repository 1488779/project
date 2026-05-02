import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
// потом добавишь остальные:
// import About from "./pages/About";
// import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <div className="font-sans">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          {/* сюда добавляешь остальные страницы */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default App;
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";         // публичный
import HeaderAuth from "./components/layout/HeaderAuth"; // для всех авторизованных

// Публичные страницы
import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import LoginPage from "./pages/LoginPage";
import AnimalsPage from "./pages/AnimalsPage";
import TasksPage from "./pages/Tasks";
import HowToHelp from "./pages/HowToHelp";
import SheltersPage from "./pages/SheltersPage";
import AboutProject from "./pages/AboutProject";

// Регистрация
import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerRegister2 from "./components/VolunteerRegister/VolunteerRegister2";
import VolunteerRegister3 from "./components/VolunteerRegister/VolunteerRegister3";
import CuratorRegister from "./pages/CuratorRegister";
import CuratorRegister2 from "./components/CuratorRegister/CuratorRegister2";
import OwnerRegister from "./pages/OwnerRegister";

// Дашборды
import VolunteerDashboard from "./pages/VolunteerDashboard";
import CuratorDashboard from "./pages/CuratorDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

import VolunteerProfile from "./pages/VolunteerProfile";
import ChatPage from "./pages/ChatPage";
import AnimalCard from "./pages/AnimalCard";
import TaskCard from "./pages/TaskCard";
import OwnerRequests from "./pages/OwnerRequests";
import VolunteerProposals from "./pages/VolunteerProposals";
import NotificationsPage from "./pages/NotificationsPage";
import CuratorTasks from "./pages/CuratorTasks";
import AddAnimalPage from "./pages/AddAnimalPage";
import CreateTaskPage from "./pages/CreateTaskPage";

// ─── SmartHeader ──────────────────────────────────────────────────────────────

function SmartHeader() {
  const { user } = useAuth();
  return user ? <HeaderAuth /> : <Header />;
}

// ─── PrivateRoute ─────────────────────────────────────────────────────────────

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login-page" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

// ─── DashboardRedirect ────────────────────────────────────────────────────────

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login-page" replace />;
  if (user.role === "volunteer") return <Navigate to="/dashboard/volunteer" replace />;
  if (user.role === "curator")   return <Navigate to="/dashboard/curator"   replace />;
  if (user.role === "owner")     return <Navigate to="/dashboard/owner"     replace />;
  return <Navigate to="/" replace />;
}

// ─── AppContent ───────────────────────────────────────────────────────────────

function AppContent() {
  return (
    <div className="font-sans">
      <SmartHeader />
      <Routes>
        {/* Публичные */}
        <Route path="/"               element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login-page"     element={<LoginPage />} />
        <Route path="/animals-page"   element={<AnimalsPage />} />
        <Route path="/tasks-page"     element={<TasksPage />} />
        <Route path="/how-to-help"    element={<HowToHelp />} />
        <Route path="/shelters-page"  element={<SheltersPage />} />
        <Route path="/about-project"  element={<AboutProject />} />

        {/* Регистрация */}
        <Route path="/register/volunteer"   element={<VolunteerRegister />} />
        <Route path="/volunteer-register-2" element={<VolunteerRegister2 />} />
        <Route path="/volunteer-register-3" element={<VolunteerRegister3 />} />
        <Route path="/register/curator"     element={<CuratorRegister />} />
        <Route path="/curator-register-2"   element={<CuratorRegister2 />} />
        <Route path="/register/owner"       element={<OwnerRegister />} />

        {/* Dashboard-роутер */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Защищённые дашборды */}
        <Route path="/dashboard/volunteer" element={
          <PrivateRoute allowedRoles={["volunteer"]}><VolunteerDashboard /></PrivateRoute>
        }/>
        <Route path="/dashboard/curator" element={
          <PrivateRoute allowedRoles={["curator"]}><CuratorDashboard /></PrivateRoute>
        }/>
        <Route path="/dashboard/owner" element={
          <PrivateRoute allowedRoles={["owner"]}><OwnerDashboard /></PrivateRoute>
        }/>
        <Route path="/profile" element={
          <PrivateRoute><VolunteerProfile /></PrivateRoute>
        }/>

        {/* Публичные детальные страницы */}
        <Route path="/animals/:id"  element={<AnimalCard />} />
        <Route path="/animals/card" element={<AnimalCard />} />
        <Route path="/tasks/:id"    element={<TaskCard />} />
        <Route path="/tasks/card"   element={<TaskCard />} />

        {/* Авторизованные страницы */}
        <Route path="/chat/:chatId?" element={
          <PrivateRoute><ChatPage /></PrivateRoute>
        }/>
        <Route path="/notifications" element={
          <PrivateRoute><NotificationsPage /></PrivateRoute>
        }/>
        <Route path="/volunteer/proposals" element={
          <PrivateRoute allowedRoles={["volunteer"]}><VolunteerProposals /></PrivateRoute>
        }/>
        <Route path="/curator/tasks" element={
          <PrivateRoute allowedRoles={["curator"]}><CuratorTasks /></PrivateRoute>
        }/>
        <Route path="/animals/new" element={
          <PrivateRoute allowedRoles={["curator"]}><AddAnimalPage /></PrivateRoute>
        }/>
        <Route path="/tasks/new" element={
          <PrivateRoute allowedRoles={["curator"]}><CreateTaskPage /></PrivateRoute>
        }/>
        <Route path="/owner/requests" element={
          <PrivateRoute allowedRoles={["owner"]}><OwnerRequests /></PrivateRoute>
        }/>
      </Routes>
      <Footer />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
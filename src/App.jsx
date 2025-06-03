import React, { useEffect, useState } from "react";
import {
  BrowserRouter, Routes, Route, Navigate,
  useLocation,
  // Remove useNavigate import from here
} from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css';
import Header from "./components/Header";
import { ProblemProvider } from "./ProblemContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"; // Ensure you have REFRESH_TOKEN if used
import LandingPage from "./pages/landing";
import SurveyPage from "./pages/Encuesta";
import SolicitarMonitoriaForm from "./pages/SolicitarMonitoria";
import Posiciones from "./pages/Pocisiones";
import SolvedProblemsPage from "./pages/EjResueltos";
import LoginPersonalA from "./pages/LoginPersonalA";
import RegisterPersonalA from "./pages/RegisterPersonalA";
import DashboardPersonalA from "./pages/dashboardPersonalAcademico";
import { useUser } from "./roleContext";
import { MisMonitorias } from "./pages/MisMonitorias";
import { MonitoriasList } from "./pages/Monitorias";
import RequestReset from "./pages/recoverPassword";
import ResetPassword from "./pages/resetPassword";

function RegisterAndLogout() {
  // Clear local storage when rendering register, just in case
  localStorage.clear();
  return <Register />;
}

function App() {
  const pathname = window.location.pathname;
  const { user, setUser } = useUser();

  const esDashboardPersonalA = pathname.includes("personal-academico");

  // Function to handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear(); // Clear authentication tokens (ACCESS_TOKEN, REFRESH_TOKEN, etc.)
    // refresh the page to ensure all components are updated
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        // If no token exists, user is not logged in. Ensure state reflects this.
        console.log('No token found on mount. User is not logged in.');
        setUser({ name: '', career: '', isLoggedIn: false }); // Explicitly set to not logged in
        return;
      }
      if (!esDashboardPersonalA) {
        try {
          const response = await axios.get(import.meta.env.VITE_API_URL + 'api/user/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const data = response.data; // axios puts data directly in response.data
          console.log('User data fetched successfully:', data);
          setUser(prevUser => ({
            ...prevUser,
            name: data.nombre_completo,
            career: data.programa_academico,
            isLoggedIn: true
          }));

        } catch (error) {
          console.error('Error fetching user data:', error);
          // If fetching user data fails (e.g., invalid or expired token),
          // treat as logged out. handleLogout clears tokens and sets isLoggedIn=false.
          // ProtectedRoute will then redirect based on isLoggedIn state.
          handleLogout();
        }
      } else {
        try {
          const token = localStorage.getItem(ACCESS_TOKEN);
          const response = await axios.get(import.meta.env.VITE_API_URL + `api/user/${user.rol}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setUser(prevUser => ({
            ...prevUser,
            name: response.data.nombre_completo,
            isLoggedIn: true,

          }));

          // Puedes hacer algo con los datos aquí, como actualizar el estado
        } catch (error) {
          // console.error('Error al llamar a la API basada en rol:', error);
          if (error.response && error.response.status === 404) {
            try {
              const token = localStorage.getItem(ACCESS_TOKEN);
              const fallbackUrl = import.meta.env.VITE_API_URL + 'api/user/docente/';

              const fallbackResponse = await axios.get(fallbackUrl, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              setUser(prevUser => ({
                ...prevUser,
                name: fallbackResponse.data.nombre_completo,
                rol: 'docente',
                isLoggedIn: true,
              }));

            } catch (fallbackError) {
              console.error('Error al intentar con el rol docente:', fallbackError);
            }
          }
        }
      }
    }
    fetchUserData();

  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <BrowserRouter>
      {/* Header is inside the Router context */}
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={user.isLoggedIn}> {/* Pass auth status */}
              <ProblemProvider>
                <Home />
              </ProblemProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/encuesta" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>
            <ProblemProvider>
              <SurveyPage />
            </ProblemProvider>
          </ProtectedRoute>
        } />
        <Route path="/solicitud" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>
            <ProblemProvider>
              <SolicitarMonitoriaForm />
            </ProblemProvider>
          </ProtectedRoute>
        } />
        <Route path="/problemas_resueltos" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>
            <ProblemProvider>
              <SolvedProblemsPage />
            </ProblemProvider>
          </ProtectedRoute>
        } />
        <Route path="/tablero_posiciones" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>
            <Posiciones />
          </ProtectedRoute>
        } />

        <Route path="/personal-academico/dashboard" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>

            <DashboardPersonalA />

          </ProtectedRoute>
        } />

        <Route path="/personal-academico/monitorias-individuales" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>

            <MisMonitorias />

          </ProtectedRoute>
        } />
        <Route path="/personal-academico/monitorias" element={
          <ProtectedRoute isAuthenticated={user.isLoggedIn}>

            <MonitoriasList />

          </ProtectedRoute>
        } />


        {/* Public Routes (or routes handling auth) */}
        <Route path="/login" element={
          <Login />
        } />

        <Route path="/request-reset" element={
          <RequestReset />
        } />

        <Route path="/reset-password" element={
          <ResetPassword />
        } />

        <Route path="/login/personal-academico" element={
          <LoginPersonalA />
        } />
        <Route path="/landing" element=
          {<LandingPage />} />
        {/* RegisterAndLogout clears localStorage and renders Register */}
        <Route path="/register" element={
          <RegisterAndLogout />
        } />
        <Route path="/register/personal-academico" element={

          <RegisterPersonalA />

        } />

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

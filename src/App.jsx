import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/login.jsx";
import Register from "./auth/register.jsx";
import Salon from "./Pages/salon.jsx";
import Equipes from "./Pages/Equipes/equipes.jsx";
import Joueurs from "./joueurs.jsx";
import Tournois from "./tournois.jsx";
import Actualites from "./actualites.jsx";
import AdminDashboard from "./admindashboard.jsx";
import AdminEquipes from "./Pages/Equipes/adminequipes.jsx";
import EquipesDetails from "./Pages/Equipes/equipedetail.jsx";
import MonEquipes from "./Pages/Equipes/monequipes.jsx";
import AdminUsers from "./Pages/Utilisateur/adminusers.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost/esportmanagerbackend/me.php", {
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
        else setUser(null);
      } catch (error) {
        console.error("Erreur récupération user", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>

        {/* 🔥 Redirection automatique */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 🔥 Login sur une vraie route */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/register" element={<Register />} />
        <Route path="/salon" element={<Salon user={user} />} />
        <Route path="/equipes" element={<Equipes />} />
        <Route path="/joueurs" element={<Joueurs />} />
        <Route path="/tournois" element={<Tournois />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/Pages/Equipes/adminequipes" element={<AdminEquipes />} />
        <Route path="/Pages/Equipes/equipedetail" element={<EquipesDetails />} />
        <Route path="/Pages/Equipes/monequipes" element={<MonEquipes />} />
        <Route path="/Pages/Utilisateur/adminusers" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;

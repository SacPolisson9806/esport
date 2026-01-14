import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/login.jsx";
import Register from "./auth/register.jsx";

import Salon from "./Pages/salon.jsx";

import Joueurs from "./joueurs.jsx";
import Tournois from "./tournois.jsx";
import Actualites from "./actualites.jsx";

import SuperAdminDashboard from "./Pages/Superadmin/superadmindashboard.jsx";

import AdminDashboard from "./Pages/EquipeAdmin/admindashboard.jsx";
import DashboardAdmin from "./Pages/EquipeAdmin/DashboardAdmin/dashboardadmin.jsx";
import AdminEquipeCreate from "./Pages/EquipeAdmin/AdminEquipecreate.jsx";
import AdminEquipeInfos from "./Pages/EquipeAdmin/adminequipeinfos.jsx";
import AdminEquipeJoueurs from "./Pages/EquipeAdmin/adminequipejoueurs.jsx";
import AdminEquipeActualites from "./Pages/EquipeAdmin/adminequipeactualites.jsx";

import AdminUsers from "./Pages/Utilisateur/adminusers.jsx";
import AdminDemande from "./Pages/Demande/demandeadmin.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost/esportmanagerbackend/api/Utilisateur/me.php", {
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

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Pages publiques */}
        <Route path="/salon" element={<Salon user={user} />} />
        <Route path="/joueurs" element={<Joueurs />} />
        <Route path="/tournois" element={<Tournois />} />
        <Route path="/actualites" element={<Actualites />} />

        {/* Super Admin */}
        <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />

        {/* Admin d'équipe */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/dashboardadmin/:id" element={<DashboardAdmin />} />
        <Route path="/adminEquipecreate" element={<AdminEquipeCreate />} />
        <Route path="/infos" element={<AdminEquipeInfos />} />
        <Route path="/joueurs" element={<AdminEquipeJoueurs />} />
        <Route path="/actualites" element={<AdminEquipeActualites />} />

        {/* Gestion utilisateurs */}
        <Route path="/adminusers" element={<AdminUsers />} />

        {/* Demande admin */}
        <Route path="/demandeadmin" element={<AdminDemande user={user} />} />

      </Routes>
    </Router>
  );
}

export default App;

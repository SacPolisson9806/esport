import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Salon({ user }) {
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9fc",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#e3f2fd",
      color: "#333",
      borderRadius: "10px",
      position: "relative"
    },
    logoutBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "#d32f2f",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    nav: {
      display: "flex",
      justifyContent: "center",
      gap: "25px",
      marginBottom: "30px"
    },
    navLink: {
      color: "#1976d2",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "16px"
    },
    section: {
      background: "#fff",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      textDecoration: "none",
      color: "#333",
      display: "block",
      transition: "transform 0.2s ease"
    },
    sectionTitle: {
      fontSize: "20px",
      marginBottom: "8px",
      color: "#1976d2"
    },
    sectionDesc: {
      fontSize: "14px",
      color: "#555"
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost/esportmanagerbackend/logout.php", {
      credentials: "include"
    });
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🎮 ESport Manager</h1>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Déconnexion
        </button>

        <p>Bienvenue dans le salon !</p>
        {user && <p>Connecté en tant que <strong>{user.pseudo}</strong> ({user.role})</p>}
      </div>

      {/* NAVIGATION */}
      <div style={styles.nav}>
        <Link to="/equipes" style={styles.navLink}>Équipes</Link>
        <Link to="/joueurs" style={styles.navLink}>Joueurs</Link>
        <Link to="/tournois" style={styles.navLink}>Tournois</Link>
        <Link to="/actualites" style={styles.navLink}>Actualités</Link>

        {/* SUPER ADMIN */}
        {user?.role === "super_admin" && (
          <Link to="/superadmindashboard" style={styles.navLink}>⚙️ Administration</Link>
        )}

        {/* ADMIN D'ÉQUIPE VALIDÉ */}
        {user?.role === "admin_equipe" && user?.admin_valide === 1 && (
          <Link to="/admindashboard" style={styles.navLink}>🛠️ Admin Équipe</Link>
        )}
      </div>

      {/* SECTIONS PUBLIQUES */}
      <Link to="/equipes" style={styles.section}>
        <h2 style={styles.sectionTitle}>📌 Équipes</h2>
        <p style={styles.sectionDesc}>Infos équipes, logos, historique.</p>
      </Link>

      <Link to="/joueurs" style={styles.section}>
        <h2 style={styles.sectionTitle}>👤 Joueurs</h2>
        <p style={styles.sectionDesc}>Profils détaillés des joueurs.</p>
      </Link>

      <Link to="/tournois" style={styles.section}>
        <h2 style={styles.sectionTitle}>🏆 Tournois</h2>
        <p style={styles.sectionDesc}>Infos tournois et résultats.</p>
      </Link>

      <Link to="/actualites" style={styles.section}>
        <h2 style={styles.sectionTitle}>📰 Actualités</h2>
        <p style={styles.sectionDesc}>Dernières annonces e-sport.</p>
      </Link>

      {/* DEMANDE ADMIN */}
      {(user?.role === "visiteur" || user?.role === "super_admin") && (
        <Link to="/demandeadmin" style={styles.section}>
          <h2 style={styles.sectionTitle}>📥 Devenir Admin d'Équipe</h2>
          <p style={styles.sectionDesc}>Envoyez une demande pour devenir admin.</p>
        </Link>
      )}

      {/* SUPER ADMIN */}
      {user?.role === "super_admin" && (
        <Link to="/superadmindashboard" style={styles.section}>
          <h2 style={styles.sectionTitle}>⚙️ Administration</h2>
          <p style={styles.sectionDesc}>Gestion complète du site.</p>
        </Link>
      )}
      
      {user?.role === "admin_equipe" && user?.admin_valide == 1 && (
  <Link to="/admindashboard" style={styles.section}>
    <h2 style={styles.sectionTitle}>🛠️ Administration de votre équipe</h2>
    <p style={styles.sectionDesc}>
      Gérez les informations, joueurs et actualités de votre équipe.
    </p>
  </Link>
)}


      {/* ADMIN NON VALIDÉ */}
      {user?.role === "admin_equipe" && user?.admin_valide === 0 && (
        <div style={{ ...styles.section, background: "#fff3cd", borderLeft: "5px solid #ff9800" }}>
          <h2 style={{ ...styles.sectionTitle, color: "#ff9800" }}>⏳ En attente de validation</h2>
          <p style={styles.sectionDesc}>
            Le Super Admin doit valider votre compte.
          </p>
        </div>
      )}

    </div>
  );
}

export default Salon;

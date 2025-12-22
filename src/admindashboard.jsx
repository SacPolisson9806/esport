import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
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
    title: {
      textAlign: "center",
      fontSize: "28px",
      marginBottom: "30px",
      color: "#d32f2f"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px"
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      textAlign: "center",
      textDecoration: "none",
      color: "#333",
      fontWeight: "bold",
      transition: "transform 0.2s ease"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚙️ Tableau de Bord Super Admin</h2>
      <div style={styles.grid}>
        <Link to="../Pages/Equipes/adminequipes" style={styles.card}>📌 Gérer les Équipes</Link>
        <Link to="/admin/joueurs" style={styles.card}>👤 Gérer les Joueurs</Link>
        <Link to="/admin/tournois" style={styles.card}>🏆 Gérer les Tournois</Link>
        <Link to="/admin/actualites" style={styles.card}>📰 Gérer les Actualités</Link>
        <Link to="../Pages/Utilisateur/adminusers" style={styles.card}>🔑 Gérer les Utilisateurs</Link>
        <Link to="/admin/demandes" style={styles.card}>📥 Valider les Demandes d’Équipes</Link>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/salon" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
          ⬅ Retour au Salon
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

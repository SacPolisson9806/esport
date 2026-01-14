import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function SuperAdminDashboard({
}) {
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif"
    },
    title: {
      fontSize: "26px",
      marginBottom: "20px",
      color: "#1976d2",
      textAlign: "center"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "40px"
    },
    card: {
      padding: "20px",
      background: "#f5f5f5",
      borderRadius: "10px",
      textAlign: "center",
      textDecoration: "none",
      color: "#000",
      fontWeight: "bold",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      transition: "0.2s"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚙️ Tableau de Bord Super Admin</h2>

      {/* GRILLE DES SECTIONS */}
      <div style={styles.grid}>
        <Link to="../Pages/Equipes/" style={styles.card}>📌 Gérer les Équipes</Link>
        <Link to="/admin/joueurs" style={styles.card}>👤 Gérer les Joueurs</Link>
        <Link to="/admin/tournois" style={styles.card}>🏆 Gérer les Tournois</Link>
        <Link to="/admin/actualites" style={styles.card}>📰 Gérer les Actualités</Link>
        <Link to="/adminusers" style={styles.card}>🔑 Gérer les Utilisateurs</Link>
      </div>
      {/* RETOUR */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/salon" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
          ⬅ Retour au Salon
        </Link>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;

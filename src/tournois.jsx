import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Tournois() {
  const [tournois, setTournois] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTournois = async () => {
      try {
        const res = await fetch("http://localhost/esportmanagerbackend/tournois.php");
        const data = await res.json();
        if (data.success) {
          setTournois(data.tournois);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Erreur de connexion au serveur");
      }
    };
    fetchTournois();
  }, []);

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
      fontSize: "26px",
      marginBottom: "30px",
      color: "#1976d2"
    },
    card: {
      background: "#fff",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    },
    name: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "5px"
    },
    meta: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "3px"
    },
    backBtn: {
      display: "inline-block",
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#1976d2",
      color: "#fff",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "bold",
      transition: "background 0.2s ease"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Liste des Tournois</h2>
      {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
      {tournois.map((tournoi) => (
        <div key={tournoi.id_tournoi} style={styles.card}>
          <div style={styles.name}>{tournoi.nom}</div>
          <div style={styles.meta}>Jeu : {tournoi.jeu || "N/A"}</div>
          <div style={styles.meta}>Début : {tournoi.date_debut || "N/A"}</div>
          <div style={styles.meta}>Fin : {tournoi.date_fin || "N/A"}</div>
          <div style={styles.meta}>Lieu : {tournoi.lieu || "N/A"}</div>
          <div style={styles.meta}>Règles : {tournoi.regles || "N/A"}</div>
        </div>
      ))}

      {/* Bouton retour vers le Salon */}
      <div style={{ textAlign: "center" }}>
        <Link to="/salon" style={styles.backBtn}>⬅ Retour au Salon</Link>
      </div>
    </div>
  );
}

export default Tournois;

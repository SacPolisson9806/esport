import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Joueurs() {
  const [joueurs, setJoueurs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJoueurs = async () => {
      try {
        const res = await fetch("http://localhost/esportmanagerbackend/joueurs.php");
        const data = await res.json();
        if (data.success) {
          setJoueurs(data.joueurs);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Erreur de connexion au serveur");
      }
    };
    fetchJoueurs();
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
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      gap: "20px"
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#1976d2",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "18px"
    },
    info: {
      flex: 1
    },
    name: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "5px"
    },
    meta: {
      fontSize: "14px",
      color: "#555"
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
      <h2 style={styles.title}>👤 Liste des Joueurs</h2>
      {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
      {joueurs.map((joueur) => (
        <div key={joueur.id_joueur} style={styles.card}>
          {/* Avatar avec première lettre du pseudo */}
          <div style={styles.avatar}>{joueur.pseudo.charAt(0).toUpperCase()}</div>
          <div style={styles.info}>
            <div style={styles.name}>{joueur.pseudo}</div>
            <div style={styles.meta}>Rôle : {joueur.role || "N/A"}</div>
            <div style={styles.meta}>Âge : {joueur.age || "N/A"}</div>
          </div>
        </div>
      ))}

      {/* Bouton retour vers le Salon */}
      <div style={{ textAlign: "center" }}>
        <Link to="/salon" style={styles.backBtn}>⬅ Retour au Salon</Link>
      </div>
    </div>
  );
}

export default Joueurs;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Actualites() {
  const [actualites, setActualites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const res = await fetch("http://localhost/esportmanagerbackend/actualites.php");
        const data = await res.json();
        if (data.success) {
          setActualites(data.actualites);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Erreur de connexion au serveur");
      }
    };
    fetchActualites();
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
    type: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#1976d2",
      marginBottom: "5px"
    },
    titre: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px"
    },
    contenu: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "10px"
    },
    date: {
      fontSize: "12px",
      color: "#888"
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
      <h2 style={styles.title}>📰 Actualités</h2>
      {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
      {actualites.map((actu) => (
        <div key={actu.id_actualite} style={styles.card}>
          <div style={styles.type}>{actu.type || "Annonce"}</div>
          <div style={styles.titre}>{actu.titre}</div>
          <div style={styles.contenu}>{actu.contenu}</div>
          <div style={styles.date}>Publié le : {actu.date || "N/A"}</div>
        </div>
      ))}

      {/* Bouton retour vers le Salon */}
      <div style={{ textAlign: "center" }}>
        <Link to="/salon" style={styles.backBtn}>⬅ Retour au Salon</Link>
      </div>
    </div>
  );
}

export default Actualites;

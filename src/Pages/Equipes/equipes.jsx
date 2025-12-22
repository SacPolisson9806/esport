import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Equipes() {
  const [equipes, setEquipes] = useState([]);

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    },
    card: {
      background: "#fff",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      textDecoration: "none",
      color: "#333",
      display: "block",
      transition: "0.2s"
    },
    title: {
      fontSize: "22px",
      marginBottom: "5px",
      color: "#1976d2"
    },
    desc: {
      fontSize: "14px",
      color: "#555"
    }
  };

  useEffect(() => {
    const fetchEquipes = async () => {
      const res = await fetch("http://localhost/esportmanagerbackend/equipes_get_all.php");
      const data = await res.json();
      if (data.success) setEquipes(data.equipes);
    };
    fetchEquipes();
  }, []);

  return (
    <div style={styles.container}>
      <h2>📌 Toutes les équipes</h2>

      {equipes.map((e) => (
        <Link key={e.id_equipe} to={`/equipes/${e.id_equipe}`} style={styles.card}>
          <h3 style={styles.title}>{e.nom}</h3>
          <p style={styles.desc}>Fondateur : {e.fondateur || "Inconnu"}</p>
          <p style={styles.desc}>Jeu : {e.jeux_pratique || "Non renseigné"}</p>
        </Link>
      ))}
    </div>
  );
}

export default Equipes;

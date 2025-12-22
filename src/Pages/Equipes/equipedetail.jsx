import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function EquipeDetail() {
  const { id } = useParams();
  const [equipe, setEquipe] = useState(null);

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    },
    title: {
      fontSize: "28px",
      marginBottom: "10px",
      color: "#1976d2"
    },
    label: {
      fontWeight: "bold",
      marginTop: "10px"
    },
    value: {
      marginBottom: "10px"
    },
    back: {
      display: "inline-block",
      marginTop: "20px",
      color: "#1976d2",
      textDecoration: "none",
      fontWeight: "bold"
    }
  };

  useEffect(() => {
    const fetchEquipe = async () => {
      const res = await fetch(`http://localhost/esportmanagerbackend/equipes_get_one.php?id=${id}`);
      const data = await res.json();
      if (data.success) setEquipe(data.equipe);
    };
    fetchEquipe();
  }, [id]);

  if (!equipe) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{equipe.nom}</h2>

      <p><span style={styles.label}>Fondateur :</span> <span style={styles.value}>{equipe.fondateur || "Non renseigné"}</span></p>
      <p><span style={styles.label}>Date de création :</span> <span style={styles.value}>{equipe.date_creation || "Non renseignée"}</span></p>
      <p><span style={styles.label}>Jeux pratiqués :</span> <span style={styles.value}>{equipe.jeux_pratique || "Non renseigné"}</span></p>

      {equipe.logo_actuel && (
        <>
          <p style={styles.label}>Logo actuel :</p>
          <img src={equipe.logo_actuel} alt="Logo actuel" style={{ width: "200px", borderRadius: "10px" }} />
        </>
      )}

      {equipe.logo_ancien && (
        <>
          <p style={styles.label}>Ancien logo :</p>
          <img src={equipe.logo_ancien} alt="Ancien logo" style={{ width: "200px", borderRadius: "10px" }} />
        </>
      )}

      <Link to="/equipes" style={styles.back}>⬅ Retour aux équipes</Link>
    </div>
  );
}

export default EquipeDetail;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [equipe, setEquipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  fetch("http://localhost/esportmanagerbackend/api/Equipeadmin/get_equipe.php", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        setError(data.message || "Erreur lors du chargement de l'équipe");
      } else {
        setEquipe(data.equipe);

        // ⚠️ Cas où l'admin n'a pas encore d'équipe
        if (data.equipe === null) {
          navigate("/AdminEquipecreate"); 
          return;
        }

        // 🔥 Cas normal : l'équipe existe
        navigate(`/dashboardadmin/${data.equipe.id_equipe}`);
      }
    })
    .catch(() => {
      setError("Erreur de connexion au serveur");
    })
    .finally(() => setLoading(false));
}, []);


  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif"
    },
    title: {
      fontSize: "26px",
      marginBottom: "10px",
      color: "#1976d2",
      textAlign: "center"
    },
    error: {
      textAlign: "center",
      color: "#c62828",
      marginBottom: "15px"
    },
    footer: {
      textAlign: "center",
      marginTop: "20px"
    },
    linkBack: {
      color: "#1976d2",
      textDecoration: "none",
      fontWeight: "bold"
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Dashboard Admin Équipe</h2>
        <p style={{ textAlign: "center" }}>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Dashboard Admin Équipe</h2>
        <p style={styles.error}>{error}</p>
        <div style={styles.footer}>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer"
            }}
            onClick={() => navigate("/salon")}
          >
            ⬅ Retour au Salon
          </button>
        </div>
      </div>
    );
  }

  return null; // On ne montre rien ici, car on redirige automatiquement
}

export default AdminDashboard;

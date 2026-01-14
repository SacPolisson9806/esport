import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DemandeAdmin({ user }) {
  const [nomEquipe, setNomEquipe] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [demandeExistante, setDemandeExistante] = useState(null);

  // Modal refus
  const [refusModalOpen, setRefusModalOpen] = useState(false);
  const [raisonRefus, setRaisonRefus] = useState("");

  // 🔥 Empêche le modal de revenir après fermeture
  const [refusDejaVu, setRefusDejaVu] = useState(false);

  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "40px auto",
      padding: "30px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif"
    },
    title: {
      fontSize: "24px",
      marginBottom: "10px",
      color: "#1976d2"
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "15px"
    },
    textarea: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "15px",
      minHeight: "120px"
    },
    button: {
      padding: "10px 20px",
      background: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "10px"
    },
    backButton: {
      padding: "8px 16px",
      background: "#ccc",
      color: "#000",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      marginBottom: "20px"
    },
    infoBox: {
      background: "#fff3cd",
      padding: "15px",
      borderRadius: "8px",
      borderLeft: "5px solid #ff9800",
      marginBottom: "20px"
    }
  };

  // Récupérer la demande existante
  const fetchDemande = async () => {
    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Demande/demande_admin_get.php",
      { credentials: "include" }
    );
    const data = await res.json();

    if (data.success) {
      setDemandeExistante(data.demande);

      // 🔥 Afficher le modal seulement si pas encore vu
      if (!refusDejaVu && data.demande && data.demande.statut === "refuse") {
        setRaisonRefus(data.demande.raison_refus);
        setRefusModalOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchDemande();
  }, []);

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Demande/demande_admin_create.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nom_equipe: nomEquipe,
          description: description
        })
      }
    );

    const data = await res.json();
    setMessage(data.message);

    if (data.success) {
      setNomEquipe("");
      setDescription("");
      fetchDemande();
    }
  };

  // -----------------------------
  // CONDITIONS D’ACCÈS
  // -----------------------------

  if (!user) {
    return <p>Chargement...</p>;
  }

  // DEMANDE EN ATTENTE
  if (demandeExistante && demandeExistante.statut === "en_attente") {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <h2 style={styles.title}>📥 Demande déjà envoyée</h2>
        <div style={styles.infoBox}>
          <p>Votre demande est en attente de validation par le Super Admin.</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // FORMULAIRE
  // -----------------------------

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <h2 style={styles.title}>📥 Demande pour devenir Admin d'Équipe</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nom de votre équipe"
          value={nomEquipe}
          onChange={(e) => setNomEquipe(e.target.value)}
          required
        />

        <textarea
          style={styles.textarea}
          placeholder="Décrivez votre équipe, votre projet, vos objectifs..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" style={styles.button}>
          Envoyer la demande
        </button>
      </form>

      {/* 🔥 MODAL DE REFUS */}
      {refusModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center"
            }}
          >
            <h2 style={{ color: "#d32f2f" }}>❌ Demande refusée</h2>

            <p><strong>Raison :</strong> {raisonRefus}</p>

            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
              onClick={() => {
  setRefusModalOpen(false);
  setDemandeExistante(null);
  setRefusDejaVu(true);

  fetch("http://localhost/esportmanagerbackend/api/Demande/demande_admin_marquer_vue.php", {
    method: "POST",
    credentials: "include"
  });
}}

            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemandeAdmin;

import React, { useEffect, useState } from "react";

function MonEquipe() {
  const [equipe, setEquipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
      fontSize: "26px",
      marginBottom: "20px",
      color: "#1976d2"
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px"
    },
    button: {
      padding: "10px 15px",
      background: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "10px"
    }
  };

  // Charger l'équipe de l'admin
  useEffect(() => {
    const fetchEquipe = async () => {
      const res = await fetch("http://localhost/esportmanagerbackend/api/Equipe/admin_get_my_team.php", {
        credentials: "include"
      });
      const data = await res.json();

      if (data.success) {
        setEquipe(data.equipe); // peut être null si admin n'a pas encore d'équipe
      }

      setLoading(false);
    };

    fetchEquipe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = equipe?.id_equipe
      ? "http://localhost/esportmanagerbackend/api/Equipe/admin_update_team.php"
      : "http://localhost/esportmanagerbackend/api/Equipe/admin_create_team.php";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(equipe)
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Équipe enregistrée !");
      if (data.equipe) setEquipe(data.equipe);
    } else {
      setMessage(data.message || "Erreur");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  // Si l'admin n'a pas encore d'équipe → formulaire vide
  const form = equipe || {
    nom: "",
    date_creation: "",
    fondateur: "",
    logo_actuel: "",
    logo_ancien: "",
    jeux_pratique: ""
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {equipe ? "Modifier mon équipe" : "Créer mon équipe"}
      </h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nom de l'équipe"
          value={form.nom}
          onChange={(e) => setEquipe({ ...form, nom: e.target.value })}
          required
        />

        <input
          style={styles.input}
          type="date"
          value={form.date_creation}
          onChange={(e) => setEquipe({ ...form, date_creation: e.target.value })}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Fondateur"
          value={form.fondateur}
          onChange={(e) => setEquipe({ ...form, fondateur: e.target.value })}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Logo actuel (URL)"
          value={form.logo_actuel}
          onChange={(e) => setEquipe({ ...form, logo_actuel: e.target.value })}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Ancien logo (URL)"
          value={form.logo_ancien}
          onChange={(e) => setEquipe({ ...form, logo_ancien: e.target.value })}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Jeux pratiqués"
          value={form.jeux_pratique}
          onChange={(e) => setEquipe({ ...form, jeux_pratique: e.target.value })}
        />

        <button style={styles.button} type="submit">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default MonEquipe;

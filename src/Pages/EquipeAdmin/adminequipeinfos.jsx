import React, { useEffect, useState } from "react";

function AdminEquipeInfos() {
  const [equipe, setEquipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/get_equipe.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setEquipe(data.equipe);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setEquipe({ ...equipe, [e.target.name]: e.target.value });
  };

  const save = () => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/update_equipe.php", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(equipe)
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  if (loading || !equipe) return <div>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛡️ Informations de l'équipe</h1>

      <div style={styles.form}>
        <label>Nom</label>
        <input name="nom" value={equipe.nom} onChange={handleChange} />

        <label>Date de création</label>
        <input name="date_creation" value={equipe.date_creation} onChange={handleChange} />

        <label>Fondateur</label>
        <input name="fondateur" value={equipe.fondateur} onChange={handleChange} />

        <label>Jeux pratiqués</label>
        <input name="jeux_pratique" value={equipe.jeux_pratique} onChange={handleChange} />

        <button onClick={save} style={styles.button}>Enregistrer</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { fontSize: "24px", marginBottom: "20px", color: "#1976d2" },
  form: { display: "flex", flexDirection: "column", gap: "10px", width: "300px" },
  button: {
    marginTop: "20px",
    padding: "10px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default AdminEquipeInfos;

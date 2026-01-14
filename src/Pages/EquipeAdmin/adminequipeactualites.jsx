import React, { useEffect, useState } from "react";

function AdminEquipeActualites() {
  const [actus, setActus] = useState([]);
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/actualites_get.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setActus(data.actualites);
      })
      .finally(() => setLoading(false));
  }, []);

  const ajouterActu = () => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/actualite_create.php", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ texte })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActus([...actus, { texte }]);
          setTexte("");
        }
        alert(data.message);
      });
  };

  const supprimerActu = (id) => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/actualite_delete.php", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActus(actus.filter(a => a.id !== id));
        }
        alert(data.message);
      });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📰 Actualités de l'équipe</h1>

      <div style={styles.addRow}>
        <textarea
          placeholder="Nouvelle actualité..."
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={ajouterActu} style={styles.button}>Publier</button>
      </div>

      <div style={styles.list}>
        {actus.map((a, i) => (
          <div key={i} style={styles.card}>
            <p>{a.texte}</p>
            <button
              style={styles.deleteButton}
              onClick={() => supprimerActu(a.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { fontSize: "24px", marginBottom: "20px", color: "#1976d2" },
  addRow: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "150px"
  },
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  card: {
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  deleteButton: {
    marginTop: "10px",
    padding: "6px 12px",
    background: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default AdminEquipeActualites;

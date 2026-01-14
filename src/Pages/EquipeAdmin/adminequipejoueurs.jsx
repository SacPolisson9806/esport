import React, { useEffect, useState } from "react";

function AdminEquipeJoueurs() {
  const [joueurs, setJoueurs] = useState([]);
  const [nouveauJoueur, setNouveauJoueur] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/joueurs_get.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setJoueurs(data.joueurs);
      })
      .finally(() => setLoading(false));
  }, []);

  const ajouterJoueur = () => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/joueur_create.php", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ pseudo: nouveauJoueur })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJoueurs([...joueurs, { pseudo: nouveauJoueur }]);
          setNouveauJoueur("");
        }
        alert(data.message);
      });
  };

  const supprimerJoueur = (pseudo) => {
    fetch("http://localhost/esportmanagerbackend/api/EquipeAdmin/joueur_delete.php", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ pseudo })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJoueurs(joueurs.filter(j => j.pseudo !== pseudo));
        }
        alert(data.message);
      });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Gestion des joueurs</h1>

      <div style={styles.addRow}>
        <input
          placeholder="Pseudo du joueur"
          value={nouveauJoueur}
          onChange={(e) => setNouveauJoueur(e.target.value)}
        />
        <button onClick={ajouterJoueur} style={styles.button}>Ajouter</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Pseudo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {joueurs.map((j, i) => (
            <tr key={i}>
              <td>{j.pseudo}</td>
              <td>
                <button
                  style={styles.deleteButton}
                  onClick={() => supprimerJoueur(j.pseudo)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { fontSize: "24px", marginBottom: "20px", color: "#1976d2" },
  addRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  button: {
    padding: "10px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "6px 12px",
    background: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};

export default AdminEquipeJoueurs;

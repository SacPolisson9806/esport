import React, { useEffect, useState } from "react";

function AdminEquipes() {
  const [equipes, setEquipes] = useState([]);
  const [form, setForm] = useState(null); // null = pas en mode édition
  const [message, setMessage] = useState("");

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
    header: { marginBottom: "20px" },
    grid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "8px",
      overflow: "hidden"
    },
    thtd: {
      border: "1px solid #ddd",
      padding: "8px",
      fontSize: "14px"
    },
    form: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "6px 0",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px"
    },
    button: {
      padding: "8px 12px",
      marginRight: "6px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px"
    }
  };

  const fetchEquipes = async () => {
    try {
      const res = await fetch("http://localhost/esportmanagerbackend/equipes_get_all.php", {
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) setEquipes(data.equipes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipes();
  }, []);

  const handleEditClick = (equipe) => {
    setForm({ ...equipe }); // on passe en mode édition
  };

  const handleDelete = async (id_equipe) => {
    if (!window.confirm("Supprimer cette équipe ?")) return;

    const res = await fetch("http://localhost/esportmanagerbackend/equipes_delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_equipe })
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Équipe supprimée");
      fetchEquipes();
      setForm(null);
    } else {
      setMessage(data.message || "Erreur suppression");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost/esportmanagerbackend/equipes_save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Équipe modifiée");
      setForm(null);
      fetchEquipes();
    } else {
      setMessage(data.message || "Erreur modification");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📌 Gestion des Équipes (Super Admin)</h2>
        {message && <p>{message}</p>}
      </div>

      <div style={styles.grid}>
        {/* Liste des équipes */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thtd}>ID</th>
              <th style={styles.thtd}>Nom</th>
              <th style={styles.thtd}>Fondateur</th>
              <th style={styles.thtd}>Jeux</th>
              <th style={styles.thtd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipes.map((e) => (
              <tr key={e.id_equipe}>
                <td style={styles.thtd}>{e.id_equipe}</td>
                <td style={styles.thtd}>{e.nom}</td>
                <td style={styles.thtd}>{e.fondateur}</td>
                <td style={styles.thtd}>{e.jeux_pratique}</td>
                <td style={styles.thtd}>
                  <button
                    style={{ ...styles.button, background: "#1976d2", color: "#fff" }}
                    onClick={() => handleEditClick(e)}
                  >
                    Modifier
                  </button>
                  <button
                    style={{ ...styles.button, background: "#d32f2f", color: "#fff" }}
                    onClick={() => handleDelete(e.id_equipe)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulaire de modification */}
        {form && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <h3>Modifier une équipe</h3>

            <input
              style={styles.input}
              type="text"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
            <input
              style={styles.input}
              type="date"
              value={form.date_creation}
              onChange={(e) => setForm({ ...form, date_creation: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Fondateur"
              value={form.fondateur}
              onChange={(e) => setForm({ ...form, fondateur: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Logo actuel (URL)"
              value={form.logo_actuel}
              onChange={(e) => setForm({ ...form, logo_actuel: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Logo ancien (URL)"
              value={form.logo_ancien}
              onChange={(e) => setForm({ ...form, logo_ancien: e.target.value })}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Jeux pratiqués"
              value={form.jeux_pratique}
              onChange={(e) => setForm({ ...form, jeux_pratique: e.target.value })}
            />

            <button
              type="submit"
              style={{ ...styles.button, background: "#388e3c", color: "#fff", marginTop: "10px" }}
            >
              Enregistrer
            </button>

            <button
              type="button"
              style={{ ...styles.button, background: "#777", color: "#fff", marginTop: "10px" }}
              onClick={() => setForm(null)}
            >
              Annuler
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminEquipes;

import React, { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banTarget, setBanTarget] = useState(null);
  const [banDuration, setBanDuration] = useState("7d"); // 1d,3d,7d,30d,permanent,custom
  const [banCustomDate, setBanCustomDate] = useState("");
  const [permissions, setPermissions] = useState({
    can_post: true,
    can_join_team: true,
    can_create_team: false,
    can_edit_profile: true,
    can_send_messages: true
  });

  const styles = {
    container: {
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px"
    },
    thtd: {
      border: "1px solid #ddd",
      padding: "8px",
      fontSize: "13px",
      textAlign: "center",
      verticalAlign: "middle"
    },
    buttonSmall: {
      padding: "4px 8px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "11px",
      margin: "2px"
    },
    columnStack: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px"
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    },
    modal: {
      background: "#fff",
      borderRadius: "10px",
      padding: "20px",
      width: "420px",
      maxWidth: "95%",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
    },
    modalTitle: {
      marginBottom: "10px",
      fontSize: "18px",
      fontWeight: "bold"
    },
    modalSectionTitle: {
      marginTop: "10px",
      marginBottom: "5px",
      fontWeight: "bold",
      fontSize: "14px"
    },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "4px",
      fontSize: "13px"
    },
    modalFooter: {
      marginTop: "15px",
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px"
    },
    input: {
      width: "100%",
      padding: "6px 8px",
      fontSize: "13px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginTop: "4px"
    },
    radioRow: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      fontSize: "13px"
    }
  };

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost/esportmanagerbackend/get_users.php", {
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // Modifier rôle
  const updateRole = async (id_utilisateur, role) => {
    const res = await fetch("http://localhost/esportmanagerbackend/update_user_role.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: id_utilisateur, role })
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Rôle mis à jour");
      setUsers((prev) =>
        prev.map((u) =>
          u.id_utilisateur === id_utilisateur ? { ...u, role } : u
        )
      );
    } else {
      setMessage(data.message || "Erreur rôle");
    }
  };

  // Modifier statut (actif / restreint)
  const updateStatus = async (id_utilisateur, statut) => {
    const res = await fetch("http://localhost/esportmanagerbackend/update_user_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: id_utilisateur, statut })
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Statut mis à jour");
      setUsers((prev) =>
        prev.map((u) =>
          u.id_utilisateur === id_utilisateur ? { ...u, statut } : u
        )
      );
    } else {
      setMessage(data.message || "Erreur statut");
    }
  };

  // Ouvrir popup bannissement
  const openBanModal = (user) => {
    setBanTarget(user);
    setBanDuration("7d");
    setBanCustomDate("");
    setPermissions({
      can_post: true,
      can_join_team: true,
      can_create_team: false,
      can_edit_profile: true,
      can_send_messages: true
    });
    setBanModalOpen(true);
  };

  const closeBanModal = () => {
    setBanModalOpen(false);
    setBanTarget(null);
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Confirmer bannissement
  const confirmBan = async () => {
    if (!banTarget) return;

    if (banDuration === "custom" && !banCustomDate) {
      setMessage("Veuillez choisir une date de fin de bannissement.");
      return;
    }

    const res = await fetch("http://localhost/esportmanagerbackend/ban_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: banTarget.id_utilisateur,
        duration: banDuration,
        customDate: banCustomDate,
        permissions
      })
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Utilisateur banni");
      setUsers((prev) =>
        prev.map((u) =>
          u.id_utilisateur === banTarget.id_utilisateur
            ? { ...u, statut: "banni" }
            : u
        )
      );
      closeBanModal();
    } else {
      setMessage(data.message || "Erreur bannissement");
    }
  };

  // Supprimer utilisateur
  const deleteUser = async (id_utilisateur) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    const res = await fetch("http://localhost/esportmanagerbackend/delete_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: id_utilisateur })
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Utilisateur supprimé");
      setUsers((prev) => prev.filter((u) => u.id_utilisateur !== id_utilisateur));
    } else {
      setMessage(data.message || "Erreur suppression");
    }
  };

  return (
    <div style={styles.container}>
      <h2>👥 Gestion des Utilisateurs (Super Admin)</h2>
      {message && <p>{message}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>ID</th>
            <th style={styles.thtd}>Pseudo</th>
            <th style={styles.thtd}>Email</th>
            <th style={styles.thtd}>Rôle</th>
            <th style={styles.thtd}>Statut</th>
            <th style={styles.thtd}>Équipe</th>
            <th style={styles.thtd}>Bannissement</th>
            <th style={styles.thtd}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id_utilisateur}>
              <td style={styles.thtd}>{u.id_utilisateur}</td>
              <td style={styles.thtd}>{u.pseudo}</td>
              <td style={styles.thtd}>{u.email}</td>
              <td style={styles.thtd}>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                  <button
                    style={{ ...styles.buttonSmall, background: "#1976d2" }}
                    onClick={() => updateRole(u.id_utilisateur, "visiteur")}
                  >
                    Visiteur
                  </button>
                  <button
                    style={{ ...styles.buttonSmall, background: "#388e3c" }}
                    onClick={() => updateRole(u.id_utilisateur, "admin_equipe")}
                  >
                    Admin équipe
                  </button>
                </div>
                <div style={{ marginTop: "4px", fontSize: "11px", color: "#555" }}>
                  Actuel : {u.role}
                </div>
              </td>

              <td style={styles.thtd}>
                <div style={styles.columnStack}>
                  <button
                    style={{ ...styles.buttonSmall, background: "#6a1b9a" }}
                    onClick={() => updateStatus(u.id_utilisateur, "actif")}
                  >
                    Actif
                  </button>
                  <button
                    style={{ ...styles.buttonSmall, background: "#f9a825" }}
                    onClick={() => updateStatus(u.id_utilisateur, "restreint")}
                  >
                    Restreint
                  </button>
                  <button
                    style={{ ...styles.buttonSmall, background: "#c62828" }}
                    onClick={() => openBanModal(u)}
                  >
                    Banni
                  </button>
                </div>
                <div style={{ marginTop: "4px", fontSize: "11px", color: "#555" }}>
                  Actuel : {u.statut}
                </div>
              </td>

              <td style={styles.thtd}>{u.equipe || "Aucune"}</td>

              <td style={styles.thtd}>
                {u.ban_expire ? (
                  <span style={{ fontSize: "11px", color: "#c62828" }}>
                    Banni jusqu'au : {u.ban_expire}
                  </span>
                ) : (
                  <span style={{ fontSize: "11px", color: "#555" }}>Aucun ban en cours</span>
                )}
              </td>

              <td style={styles.thtd}>
                <button
                  style={{ ...styles.buttonSmall, background: "#d32f2f" }}
                  onClick={() => deleteUser(u.id_utilisateur)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup bannissement */}
      {banModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>
              Bannir {banTarget?.pseudo}
            </div>

            <div style={styles.modalSectionTitle}>Durée du bannissement</div>
            <div style={styles.radioRow}>
              <label>
                <input
                  type="radio"
                  value="1d"
                  checked={banDuration === "1d"}
                  onChange={(e) => setBanDuration(e.target.value)}
                />{" "}
                1 jour
              </label>
              <label>
                <input
                  type="radio"
                  value="3d"
                  checked={banDuration === "3d"}
                  onChange={(e) => setBanDuration(e.target.value)}
                />{" "}
                3 jours
              </label>
              <label>
                <input
                  type="radio"
                  value="7d"
                  checked={banDuration === "7d"}
                  onChange={(e) => setBanDuration(e.target.value)}
                />{" "}
                7 jours
              </label>
              <label>
                <input
                  type="radio"
                  value="30d"
                  checked={banDuration === "30d"}
                  onChange={(e) => setBanDuration(e.target.value)}
                />{" "}
                30 jours
              </label>
              <label>
                <input
                  type="radio"
                  value="permanent"
                  checked={banDuration === "permanent"}
                  onChange={(e) => setBanDuration(e.target.value)}
                />{" "}
                Permanent
              </label>
              <label>
                <input
                  type="radio"
                  value="custom"
                  checked={banDuration === "custom"}
                  onChange={(e) => setBanDuration(e.target.value)}
                />{" "}
                Date personnalisée
              </label>

              {banDuration === "custom" && (
                <input
                  type="datetime-local"
                  style={styles.input}
                  value={banCustomDate}
                  onChange={(e) => setBanCustomDate(e.target.value)}
                />
              )}
            </div>

            <div style={styles.modalSectionTitle}>
              Restrictions après la fin du bannissement
            </div>
            <div>
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={permissions.can_post}
                  onChange={() => togglePermission("can_post")}
                />
                <span>Peut poster</span>
              </div>
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={permissions.can_join_team}
                  onChange={() => togglePermission("can_join_team")}
                />
                <span>Peut rejoindre une équipe</span>
              </div>
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={permissions.can_create_team}
                  onChange={() => togglePermission("can_create_team")}
                />
                <span>Peut créer une équipe</span>
              </div>
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={permissions.can_edit_profile}
                  onChange={() => togglePermission("can_edit_profile")}
                />
                <span>Peut modifier son profil</span>
              </div>
              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={permissions.can_send_messages}
                  onChange={() => togglePermission("can_send_messages")}
                />
                <span>Peut envoyer des messages</span>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={{ ...styles.buttonSmall, background: "#757575" }}
                onClick={closeBanModal}
              >
                Annuler
              </button>
              <button
                style={{ ...styles.buttonSmall, background: "#c62828" }}
                onClick={confirmBan}
              >
                Confirmer le bannissement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

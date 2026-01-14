import React, { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // -----------------------------
  // BANNISSEMENT
  // -----------------------------
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banTarget, setBanTarget] = useState(null);
  const [banDuration, setBanDuration] = useState("7d");
  const [banCustomDate, setBanCustomDate] = useState("");

  const [permissions, setPermissions] = useState({
    can_post: true,
    can_join_team: true,
    can_create_team: false,
    can_edit_profile: true,
    can_send_messages: true
  });

  // -----------------------------
  // RESTRICTION
  // -----------------------------
  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [restrictTarget, setRestrictTarget] = useState(null);

  const permissionLabels = {
    can_post: "Publier du contenu",
    can_join_team: "Rejoindre une équipe",
    can_create_team: "Créer une équipe",
    can_edit_profile: "Modifier son profil",
    can_send_messages: "Envoyer des messages"
  };

  // -----------------------------
  // DEMANDES ADMIN
  // -----------------------------
  const [demandes, setDemandes] = useState([]);

  const [refuseModalOpen, setRefuseModalOpen] = useState(false);
  const [refuseTarget, setRefuseTarget] = useState(null);

  const raisonsPossibles = [
    "Utilisateur non éligible",
    "Équipe déjà complète",
    "Conflit avec un autre admin",
    "Demande incohérente",
    "Informations insuffisantes",
    "Raison interne"
  ];

  const [raisonsSelectionnees, setRaisonsSelectionnees] = useState([]);

  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [descriptionModalText, setDescriptionModalText] = useState("");

  // -----------------------------
  // FETCH USERS
  // -----------------------------
  const fetchUsers = async () => {
    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Utilisateur/get_users.php",
      { credentials: "include" }
    );
    const data = await res.json();
    if (data.success) setUsers(data.users);
  };

  // -----------------------------
  // FETCH DEMANDES ADMIN
  // -----------------------------
  const fetchDemandes = async () => {
    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Demande/demande_admin_get_all.php",
      { credentials: "include" }
    );
    const data = await res.json();
    if (data.success) setDemandes(data.demandes);
  };

  useEffect(() => {
    fetchUsers();
    fetchDemandes();
  }, []);

  // -----------------------------
  // UPDATE ROLE
  // -----------------------------
  const updateRole = async (id_utilisateur, role) => {
    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Utilisateur/update_user_role.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: id_utilisateur, role })
      }
    );

    const data = await res.json();
    if (data.success) {
      setMessage("Rôle mis à jour");
      fetchUsers();
    } else {
      setMessage(data.message || "Erreur rôle");
    }
  };

  // -----------------------------
  // UPDATE STATUS
  // -----------------------------
  const updateStatus = async (id_utilisateur, statut) => {
    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Utilisateur/update_user_status.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: id_utilisateur, statut })
      }
    );

    const data = await res.json();
    if (data.success) {
      setMessage("Statut mis à jour");
      fetchUsers();
    } else {
      setMessage(data.message || "Erreur statut");
    }
  };

  // -----------------------------
  // BAN MODAL
  // -----------------------------
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

  const confirmBan = async () => {
    if (!banTarget) return;

    if (banDuration === "custom" && !banCustomDate) {
      setMessage("Veuillez choisir une date de fin de bannissement.");
      return;
    }

    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Utilisateur/ban_user.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: banTarget.id_utilisateur,
          duration: banDuration,
          customDate: banCustomDate,
          permissions
        })
      }
    );

    const data = await res.json();
    if (data.success) {
      setMessage("Utilisateur banni");
      closeBanModal();
      fetchUsers();
    } else {
      setMessage(data.message || "Erreur bannissement");
    }
  };

  // -----------------------------
  // DELETE USER
  // -----------------------------
  const deleteUser = async (id_utilisateur) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Utilisateur/delete_user.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: id_utilisateur })
      }
    );

    const data = await res.json();
    if (data.success) {
      setMessage("Utilisateur supprimé");
      fetchUsers();
    } else {
      setMessage(data.message || "Erreur suppression");
    }
  };

  // -----------------------------
  // RESTRICTION
  // -----------------------------
  const openRestrictModal = (user) => {
    setRestrictTarget(user);
    setPermissions({
      can_post: false,
      can_join_team: false,
      can_create_team: false,
      can_edit_profile: true,
      can_send_messages: true
    });
    setRestrictModalOpen(true);
  };

  const confirmRestrict = async () => {
    if (!restrictTarget) return;

    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Utilisateur/restrict_user.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: restrictTarget.id_utilisateur,
          permissions
        })
      }
    );

    const data = await res.json();

    if (data.success) {
      setMessage("Utilisateur restreint");
      setRestrictModalOpen(false);
      setRestrictTarget(null);
      fetchUsers();
    } else {
      setMessage(data.message || "Erreur restriction");
    }
  };

  // -----------------------------
  // DEMANDES ADMIN : ACCEPTER
  // -----------------------------
  const accepterDemande = async (id_demande, id_utilisateur) => {
    const res = await fetch(
      "http://localhost/esportmanagerbackend/api/Demande/demande_admin_accepter.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_demande, id_utilisateur })
      }
    );

    const data = await res.json();
    setMessage(data.message);
    fetchDemandes();
    fetchUsers();
  };

  // -----------------------------
  // DEMANDES ADMIN : REFUSER
  // -----------------------------
  const refuserDemande = async (id_demande, raisons) => {
    await fetch(
      "http://localhost/esportmanagerbackend/api/Demande/demande_admin_refuser.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id_demande,
          raisons_refus: raisons
        })
      }
    );

    fetchDemandes();
  };

  // -----------------------------
  // STYLES
  // -----------------------------
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px"
    },
    thtd: {
      border: "1px solid #ccc",
      padding: "8px",
      textAlign: "center"
    },
    buttonSmall: {
      padding: "6px 10px",
      border: "none",
      borderRadius: "4px",
      color: "#fff",
      cursor: "pointer",
      fontSize: "12px"
    },
    modalOverlay: {
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
    },
    modal: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: "400px"
    },
    modalTitle: {
      fontSize: "20px",
      marginBottom: "10px"
    },
    modalSectionTitle: {
      marginTop: "10px",
      fontWeight: "bold"
    },
    checkboxRow: {
      marginBottom: "6px"
    },
    modalFooter: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "space-between"
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div style={styles.container}>
      <h2>👥 Gestion des Utilisateurs (Super Admin)</h2>
      {message && <p>{message}</p>}

      {/* TABLE UTILISATEURS */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>ID</th>
            <th style={styles.thtd}>Pseudo</th>
            <th style={styles.thtd}>Email</th>
            <th style={styles.thtd}>Rôle</th>
            <th style={styles.thtd}>Statut</th>
            <th style={styles.thtd}>Équipe</th>
            <th style={styles.thtd}>Ban</th>
            <th style={styles.thtd}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id_utilisateur}>
              <td style={styles.thtd}>{u.id_utilisateur}</td>
              <td style={styles.thtd}>{u.pseudo}</td>
              <td style={styles.thtd}>{u.email}</td>

              {/* ROLE */}
              <td style={styles.thtd}>
                <button
                  style={{ ...styles.buttonSmall, background: "#1976d2" }}
                  onClick={() => updateRole(u.id_utilisateur, "visiteur")}
                >
                  Visiteur
                </button>
                <button
                  style={{
                    ...styles.buttonSmall,
                    background: "#388e3c",
                    marginLeft: "4px"
                  }}
                  onClick={() => updateRole(u.id_utilisateur, "admin_equipe")}
                >
                  Admin équipe
                </button>
                <div style={{ fontSize: "11px", marginTop: "4px" }}>
                  Actuel : {u.role}
                </div>
              </td>

              {/* STATUT */}
              <td style={styles.thtd}>
                <button
                  style={{ ...styles.buttonSmall, background: "#6a1b9a" }}
                  onClick={() => updateStatus(u.id_utilisateur, "actif")}
                >
                  Actif
                </button>

                <button
                  style={{
                    ...styles.buttonSmall,
                    background: "#f9a825",
                    marginLeft: "4px"
                  }}
                  onClick={() => openRestrictModal(u)}
                >
                  Restreindre
                </button>

                <button
                  style={{
                    ...styles.buttonSmall,
                    background: "#c62828",
                    marginLeft: "4px"
                  }}
                  onClick={() => openBanModal(u)}
                >
                  Bannir
                </button>

                <div style={{ fontSize: "11px", marginTop: "4px" }}>
                  Actuel : {u.statut}
                </div>
              </td>

              {/* EQUIPE */}
              <td style={styles.thtd}>{u.equipe || "Aucune"}</td>

              {/* BAN */}
              <td style={styles.thtd}>
                {u.ban_expire ? (
                  <span style={{ color: "#c62828", fontSize: "11px" }}>
                    Jusqu'au : {u.ban_expire}
                  </span>
                ) : (
                  <span style={{ fontSize: "11px" }}>Aucun</span>
                )}
              </td>

              {/* ACTIONS */}
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

      {/* ----------------------------- */}
      {/* TABLEAU DES DEMANDES ADMIN */}
      {/* ----------------------------- */}

      <h2 style={{ marginTop: "40px" }}>📥 Demandes Admin d'Équipe</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>ID</th>
            <th style={styles.thtd}>Utilisateur</th>
            <th style={styles.thtd}>Équipe</th>
            <th style={styles.thtd}>Description</th>
            <th style={styles.thtd}>Statut</th>
            <th style={styles.thtd}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {demandes.length === 0 && (
            <tr>
              <td colSpan="6" style={styles.thtd}>
                Aucune demande trouvée
              </td>
            </tr>
          )}

          {demandes.map((d) => (
            <tr key={d.id_demande}>
              <td style={styles.thtd}>{d.id_demande}</td>
              <td style={styles.thtd}>{d.pseudo}</td>
              <td style={styles.thtd}>{d.nom_equipe}</td>
              <td style={styles.thtd}>
  {d.description.length > 50
    ? d.description.substring(0, 50) + "..."
    : d.description}

  <button
    style={{
      marginLeft: "6px",
      padding: "4px 8px",
      fontSize: "11px",
      border: "none",
      borderRadius: "4px",
      background: "#1976d2",
      color: "#fff",
      cursor: "pointer"
    }}
    onClick={() => {
      setDescriptionModalText(d.description);
      setDescriptionModalOpen(true);
    }}
  >
    Voir +
  </button>
</td>

              <td style={styles.thtd}>{d.statut}</td>

              <td style={styles.thtd}>
                {d.statut === "en_attente" && (
                  <>
                    <button
                      style={{
                        ...styles.buttonSmall,
                        background: "#4caf50",
                        marginRight: "4px"
                      }}
                      onClick={() =>
                        accepterDemande(d.id_demande, d.id_utilisateur)
                      }
                    >
                      Accepter
                    </button>

                    <button
                      style={{ ...styles.buttonSmall, background: "#d32f2f" }}
                      onClick={() => {
                        setRefuseTarget(d);
                        setRaisonsSelectionnees([]);
                        setRefuseModalOpen(true);
                      }}
                    >
                      Refuser
                    </button>
                  </>
                )}

                {d.statut === "accepte" && (
                  <span style={{ color: "#4caf50", fontWeight: "bold" }}>
                    ✔ Acceptée
                  </span>
                )}

                {d.statut === "refuse" && (
                  <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                    ✖ Refusée
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ----------------------------- */}
{/* MODAL REFUS */}
{/* ----------------------------- */}

{refuseModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <div style={styles.modalTitle}>
        Refuser la demande de {refuseTarget?.pseudo}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Choisir la raison du refus :</strong>
      </div>

      {raisonsPossibles.map((r) => (
        <label key={r} style={{ display: "block", marginBottom: "6px" }}>
          <input
            type="checkbox"
            checked={raisonsSelectionnees.includes(r)}
            onChange={() => {
              if (raisonsSelectionnees.includes(r)) {
                setRaisonsSelectionnees(
                  raisonsSelectionnees.filter((x) => x !== r)
                );
              } else {
                setRaisonsSelectionnees([...raisonsSelectionnees, r]);
              }
            }}
          />
          {" "}
          {r}
        </label>
      ))}

      <div style={styles.modalFooter}>
        <button
          style={{ ...styles.buttonSmall, background: "#757575" }}
          onClick={() => setRefuseModalOpen(false)}
        >
          Annuler
        </button>

        <button
          style={{ ...styles.buttonSmall, background: "#d32f2f" }}
          onClick={() => {
            refuserDemande(refuseTarget.id_demande, raisonsSelectionnees);
            setRefuseModalOpen(false);
          }}
        >
          Confirmer le refus
        </button>
      </div>
    </div>
  </div>
)}

{/* ----------------------------- */}
{/* MODAL BANNISSEMENT */}
{/* ----------------------------- */}

{banModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <div style={styles.modalTitle}>Bannir {banTarget?.pseudo}</div>

      <div style={styles.modalSectionTitle}>Durée du bannissement</div>
      <div style={styles.radioRow}>
        {["1d", "3d", "7d", "30d", "permanent", "custom"].map((d) => (
          <label key={d}>
            <input
              type="radio"
              value={d}
              checked={banDuration === d}
              onChange={(e) => setBanDuration(e.target.value)}
            />{" "}
            {d === "1d" && "1 jour"}
            {d === "3d" && "3 jours"}
            {d === "7d" && "7 jours"}
            {d === "30d" && "30 jours"}
            {d === "permanent" && "Permanent"}
            {d === "custom" && "Date personnalisée"}
          </label>
        ))}

        {banDuration === "custom" && (
          <input
            type="datetime-local"
            style={styles.input}
            value={banCustomDate}
            onChange={(e) => setBanCustomDate(e.target.value)}
          />
        )}
      </div>

      <div style={styles.modalSectionTitle}>Restrictions après le ban</div>
      <div>
        {Object.keys(permissions).map((key) => (
          <div key={key} style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={permissions[key]}
              onChange={() => togglePermission(key)}
            />
            <span>{key}</span>
          </div>
        ))}
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

{/* ----------------------------- */}
{/* MODAL RESTRICTION */}
{/* ----------------------------- */}

{restrictModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <div style={styles.modalTitle}>
        Restreindre {restrictTarget?.pseudo}
      </div>

      <div style={styles.modalSectionTitle}>Permissions à retirer</div>

      <div>
        {Object.keys(permissionLabels).map((key) => (
          <div key={key} style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={!permissions[key]}
              onChange={() => togglePermission(key)}
            />
            <span>Interdire : {permissionLabels[key]}</span>
          </div>
        ))}
      </div>

      <div style={styles.modalFooter}>
        <button
          style={{ ...styles.buttonSmall, background: "#757575" }}
          onClick={() => setRestrictModalOpen(false)}
        >
          Annuler
        </button>

        <button
          style={{ ...styles.buttonSmall, background: "#f9a825" }}
          onClick={confirmRestrict}
        >
          Confirmer la restriction
        </button>
      </div>
    </div>
  </div>
)}
{descriptionModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <div style={styles.modalTitle}>Description complète</div>

      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
        <p>{descriptionModalText}</p>
      </div>

      <div style={styles.modalFooter}>
        <button
          style={{ ...styles.buttonSmall, background: "#1976d2" }}
          onClick={() => setDescriptionModalOpen(false)}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}

{/* ----------------------------- */}
{/* BOUTON RETOUR */}
{/* ----------------------------- */}

<div style={{ marginTop: "20px", textAlign: "center" }}>
  <button
    style={{
      ...styles.buttonSmall,
      background: "#424242",
      padding: "10px 20px",
      fontSize: "14px"
    }}
    onClick={() => window.history.back()}
  >
    ⬅️ Retour à la page précédente
  </button>
</div>

</div> // ← FIN DU RETURN PRINCIPAL
);
}

export default AdminUsers;

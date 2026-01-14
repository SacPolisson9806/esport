// ============================================================
// DASHBOARDADMIN.JSX
// ------------------------------------------------------------
// Ce composant affiche le dashboard d’administration complet
// d’une équipe e-sport :
//  - Infos générales de l’équipe
//  - Jeux
//  - Joueurs
//  - Managers
//  - Staff
//  - Sponsors
//  - Palmarès
//
// Il contient aussi une modale générique pour gérer tout le CRUD.
// ============================================================

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* ============================================================
   PARTIE 1 — IMPORTS, ÉTATS GLOBAUX ET CHARGEMENT DES DONNÉES
   ------------------------------------------------------------
   Cette partie :
   - Récupère l'ID de l’équipe dans l’URL
   - Définit tous les états nécessaires (données, loading, erreurs)
   - Charge les données complètes de l’équipe depuis le backend
   - Prépare les tableaux (jeux, joueurs, etc.) pour l’affichage
============================================================ */

// URL de base de l'API pour l’admin équipe
const API_BASE = "http://localhost/esportmanagerbackend/api/Equipeadmin";

// ------------------------------------------------------------
// Composant principal : DashboardAdmin
// ------------------------------------------------------------
export default function DashboardAdmin() {
  /* ------------------------------------------------------------
     Récupération de l'ID d’équipe dans l’URL
     Exemple d’URL : /admin/equipe/3
     -> id = "3"
  ------------------------------------------------------------ */
  const { id } = useParams();

  /* ------------------------------------------------------------
     États globaux
  ------------------------------------------------------------ */

  // État global pour le chargement
  const [loading, setLoading] = useState(true);

  // État global pour les actions (AJOUT / MODIF / SUPPR) via la modale
  const [saving, setSaving] = useState(false);

  // Message d’erreur global (chargement ou action)
  const [error, setError] = useState("");

  // Données complètes de l’équipe
  // Structure attendue :
  // {
  //   success: true,
  //   equipe: { ... },
  //   jeux: [ ... ],
  //   joueurs: [ ... ],
  //   managers: [ ... ],
  //   staff: [ ... ],
  //   sponsors: [ ... ],
  //   palmares: [ ... ]
  // }
  const [data, setData] = useState(null);

  /* ------------------------------------------------------------
     États liés à la modale générique
     - modalOpen : booléen, vrai si la modale est ouverte
     - modalMode : "add" | "edit" | "delete"
     - modalSection : "infos" | "jeu" | "joueur" | ...
     - modalItem : l’élément sélectionné pour edit/delete
     - modalForm : les valeurs du formulaire de la modale
  ------------------------------------------------------------ */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [modalSection, setModalSection] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalForm, setModalForm] = useState({});

  /* ------------------------------------------------------------
     Fonction : fetchEquipe
     ------------------------------------------------------------
     Rôle :
       - Appeler l’API backend pour récupérer TOUTES les données
         de l’équipe (infos + jeux + joueurs + staff + sponsors + palmarès)
       - Mettre à jour l’état "data"
       - Gérer loading + erreurs

     Cette fonction est appelée :
       - au montage du composant (useEffect)
       - après chaque action CRUD réussie (ajout / modification / suppression)
  ------------------------------------------------------------ */
  const fetchEquipe = () => {
    setLoading(true);

    fetch(`${API_BASE}/get_equipe_complet.php?id_equipe=${id}`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
          setError("");
        } else {
          setError("Erreur lors du chargement des données.");
        }
      })
      .catch(() => {
        setError("Erreur réseau lors du chargement des données.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /* ------------------------------------------------------------
     useEffect : chargement initial des données
     ------------------------------------------------------------
     Dès que le composant est monté OU que l'ID de l’équipe change,
     on recharge les données complètes.
  ------------------------------------------------------------ */
  useEffect(() => {
    fetchEquipe();
  }, [id]);

  /* ------------------------------------------------------------
     Gestion des états "loading" et "erreur"
     ------------------------------------------------------------
     - Pendant le chargement, on affiche un message simple
     - En cas d’erreur, on affiche le message
     - Si tout va bien, on continue vers l’interface du dashboard
  ------------------------------------------------------------ */
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif"
        }}
      >
        Chargement des données de l’équipe...
      </div>
    );
  }

  if (!data || !data.equipe) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#b00020"
        }}
      >
        Impossible de charger les données de l’équipe.
      </div>
    );
  }

  // ------------------------------------------------------------
  // Déstructuration des données pour simplifier le code
  // ------------------------------------------------------------
  const equipe = data.equipe || {};
  const jeux = data.jeux || [];
  const joueurs = data.joueurs || [];
  const managers = data.managers || [];
  const staff = data.staff || [];
  const sponsors = data.sponsors || [];
  const palmares = data.palmares || [];

  // ------------------------------------------------------------
  // À partir d’ici, on va construire :
  //  - PARTIE 2 : Modale générique CRUD
  //  - PARTIE 3 : Infos générales de l’équipe
  //  - PARTIE 4 : Sections CRUD (jeux, joueurs, etc.)
  //  - PARTIE 5 : Fin du composant + appel à <Modal />
  // ------------------------------------------------------------
// ============================================================
//   PARTIE 2 — MODALE GÉNÉRIQUE (AJOUT / MODIFICATION / SUPPRESSION)
//  ------------------------------------------------------------
//   Cette modale est utilisée pour TOUTES les actions CRUD :
//   - Ajouter un élément
//   - Modifier un élément
//   - Supprimer un élément
//
//  Elle est totalement générique :
//   - modalMode : "add", "edit", "delete"
//   - modalSection : "infos", "jeu", "joueur", etc.
//   - modalForm : valeurs du formulaire
//   - modalItem : élément sélectionné (pour edit/delete)
//
//   ⚠️ IMPORTANT :
//   Pour éviter le bug du focus (obligé de recliquer pour écrire),
//   TOUTES les fonctions de génération de champs (field, renderFields)
//   sont placées EN DEHORS du composant Modal.
//============================================================ 

// ------------------------------------------------------------
//   OUVERTURE DE LA MODALE
// ------------------------------------------------------------ 
const openModal = (mode, section, item = null, defaultForm = {}) => {
  setModalMode(mode);
  setModalSection(section);
  setModalItem(item);
  setModalForm(defaultForm);
  setModalOpen(true);
};

// ------------------------------------------------------------
//   FERMETURE DE LA MODALE
// ------------------------------------------------------------ 
const closeModal = () => {
  setModalOpen(false);
  setModalMode(null);
  setModalSection(null);
  setModalItem(null);
  setModalForm({});
};

// ------------------------------------------------------------
//   GESTION DES CHAMPS DU FORMULAIRE
// ------------------------------------------------------------
const handleModalChange = (e) => {
  const { name, value } = e.target;
  setModalForm((prev) => ({ ...prev, [name]: value }));
};

// ------------------------------------------------------------
//   APPEL API POUR AJOUT / MODIF / SUPPRESSION
// ------------------------------------------------------------ 
const callApi = async (action, type, payload = {}, targetId = null) => {
  setSaving(true);
  setError("");

  const params = new URLSearchParams();
  params.append("action", action);
  params.append("type", type);
  if (targetId) params.append("id", targetId);

  const formData = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) formData.append(k, v);
  });

  try {
    const res = await fetch(`${API_BASE}/element.php?${params.toString()}`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const json = await res.json();

    if (!json.success) {
      setError("Action échouée côté serveur.");
    } else {
      await fetchEquipe();
      closeModal();
    }
  } catch (e) {
    setError("Erreur réseau sur l'action.");
  } finally {
    setSaving(false);
  }
};

// ============================================================
//   STYLES GLOBAUX (mis en constantes pour stabilité)
// ============================================================ 

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "12px",
  fontSize: "14px"
};

const labelStyle = {
  fontWeight: "600",
  marginBottom: "4px",
  display: "block"
};

// ------------------------------------------------------------
//   field() — Génère un champ de formulaire
//   ------------------------------------------------------------
//   ⚠️ Placé en dehors du composant Modal pour éviter
//      la recréation des inputs → perte de focus.
// ------------------------------------------------------------ 
const field = (label, name, modalForm, handleModalChange, type = "text") => (
  <>
    <label style={labelStyle}>{label}</label>

    {type === "textarea" ? (
      <textarea
        style={inputStyle}
        name={name}
        value={modalForm[name] || ""}
        onChange={handleModalChange}
      />
    ) : (
      <input
        style={inputStyle}
        type={type}
        name={name}
        value={modalForm[name] || ""}
        onChange={handleModalChange}
      />
    )}
  </>
);

// ------------------------------------------------------------
//   renderFields() — Génère les champs selon la section
//   ------------------------------------------------------------
//   ⚠️ Placé en dehors du composant Modal pour éviter
//      les rerenders inutiles → perte de focus.
// ------------------------------------------------------------ 
const renderFields = (modalSection, modalForm, handleModalChange) => {
  switch (modalSection) {
    case "infos":
      return (
        <>
          {field("Nom", "nom", modalForm, handleModalChange)}
          {field("Tag", "tag", modalForm, handleModalChange)}
          {field("Date de création", "date_creation", modalForm, handleModalChange, "date")}
          {field("Description courte", "description_courte", modalForm, handleModalChange, "textarea")}
          {field("Description longue", "description_longue", modalForm, handleModalChange, "textarea")}
          {field("Pays", "pays", modalForm, handleModalChange)}
          {field("Ville", "ville", modalForm, handleModalChange)}
          {field("Site web", "site_web", modalForm, handleModalChange)}
          {field("Email général", "email_general", modalForm, handleModalChange)}
          {field("Email recrutement", "email_recrutement", modalForm, handleModalChange)}
          {field("Téléphone", "telephone", modalForm, handleModalChange)}
          {field("Logo (URL)", "logo", modalForm, handleModalChange)}
          {field("Twitter", "twitter", modalForm, handleModalChange)}
          {field("Instagram", "instagram", modalForm, handleModalChange)}
          {field("Twitch", "twitch", modalForm, handleModalChange)}
          {field("YouTube", "youtube", modalForm, handleModalChange)}
          {field("TikTok", "tiktok", modalForm, handleModalChange)}
          {field("Facebook", "facebook", modalForm, handleModalChange)}
        </>
      );

    case "jeu":
      return (
        <>
          {field("Nom du jeu", "nom", modalForm, handleModalChange)}
          {field("Rang", "rang", modalForm, handleModalChange)}
          {field("Division", "division", modalForm, handleModalChange)}
          {field("Objectifs", "objectifs", modalForm, handleModalChange, "textarea")}
        </>
      );

    case "joueur":
      return (
        <>
          {field("Nom", "nom", modalForm, handleModalChange)}
          {field("Pseudo", "pseudo", modalForm, handleModalChange)}
          {field("Âge", "age", modalForm, handleModalChange, "number")}
          {field("Nationalité", "nationalite", modalForm, handleModalChange)}
          {field("Jeu", "jeu", modalForm, handleModalChange)}
          {field("Rôle", "role", modalForm, handleModalChange)}
          {field("Expérience", "experience", modalForm, handleModalChange, "textarea")}
          {field("Contrat", "contrat", modalForm, handleModalChange)}
          {field("Durée du contrat", "duree_contrat", modalForm, handleModalChange)}
          {field("Date d'arrivée", "date_arrivee", modalForm, handleModalChange, "date")}
          {field("Anciennes équipes", "anciennes_equipes", modalForm, handleModalChange, "textarea")}
          {field("Photo (URL)", "photo", modalForm, handleModalChange)}
          {field("Twitter", "twitter", modalForm, handleModalChange)}
          {field("Instagram", "instagram", modalForm, handleModalChange)}
          {field("Twitch", "twitch", modalForm, handleModalChange)}
          {field("YouTube", "youtube", modalForm, handleModalChange)}
          {field("TikTok", "tiktok", modalForm, handleModalChange)}
          {field("Facebook", "facebook", modalForm, handleModalChange)}
        </>
      );

    case "manager":
      return (
        <>
          {field("Nom", "nom", modalForm, handleModalChange)}
          {field("Rôle", "role", modalForm, handleModalChange)}
          {field("Âge", "age", modalForm, handleModalChange, "number")}
          {field("Jeux gérés", "jeux_geres", modalForm, handleModalChange)}
          {field("Photo (URL)", "photo", modalForm, handleModalChange)}
          {field("Twitter", "twitter", modalForm, handleModalChange)}
          {field("Instagram", "instagram", modalForm, handleModalChange)}
          {field("Twitch", "twitch", modalForm, handleModalChange)}
          {field("YouTube", "youtube", modalForm, handleModalChange)}
          {field("TikTok", "tiktok", modalForm, handleModalChange)}
          {field("Facebook", "facebook", modalForm, handleModalChange)}
        </>
      );

    case "staff":
      return (
        <>
          {field("Nom", "nom", modalForm, handleModalChange)}
          {field("Rôle", "role", modalForm, handleModalChange)}
          {field("Jeux gérés", "jeux_geres", modalForm, handleModalChange)}
          {field("Photo (URL)", "photo", modalForm, handleModalChange)}
          {field("Twitter", "twitter", modalForm, handleModalChange)}
          {field("Instagram", "instagram", modalForm, handleModalChange)}
          {field("Twitch", "twitch", modalForm, handleModalChange)}
          {field("YouTube", "youtube", modalForm, handleModalChange)}
          {field("TikTok", "tiktok", modalForm, handleModalChange)}
          {field("Facebook", "facebook", modalForm, handleModalChange)}
        </>
      );

    case "sponsor":
      return (
        <>
          {field("Nom", "nom", modalForm, handleModalChange)}
          {field("Type", "type", modalForm, handleModalChange)}
          {field("Durée", "duree", modalForm, handleModalChange)}
          {field("Lien", "lien", modalForm, handleModalChange)}
          {field("Logo (URL)", "logo", modalForm, handleModalChange)}
          {field("Twitter", "twitter", modalForm, handleModalChange)}
          {field("Instagram", "instagram", modalForm, handleModalChange)}
          {field("YouTube", "youtube", modalForm, handleModalChange)}
        </>
      );

    case "palmares":
      return (
        <>
          {field("Tournoi", "tournoi", modalForm, handleModalChange)}
          {field("Date", "date", modalForm, handleModalChange, "date")}
          {field("Résultat", "resultat", modalForm, handleModalChange)}
          {field("Récompense", "recompense", modalForm, handleModalChange)}
        </>
      );

    default:
      return <p>Section inconnue.</p>;
    }
};

   //============================================================
   //COMPOSANT : Modal
   //------------------------------------------------------------
   //Ce composant utilise :
   //- modalOpen       : booléen, affiche ou non la modale
   //- modalMode       : "add" | "edit" | "delete"
   //- modalSection    : "infos" | "jeu" | "joueur" | ...
   //- modalItem       : élément sélectionné (pour edit/delete)
   //- modalForm       : valeurs du formulaire
   //
   //Il s’appuie sur :
   //- renderFields(...) pour générer les champs selon la section
   //- callApi(...) pour envoyer l’action au backend
   //
   //⚠️ IMPORTANT :
   //- Les fonctions field() et renderFields() sont EN DEHORS
   //du composant pour éviter la perte de focus.
   //============================================================ 

const Modal = () => {
  // Si la modale n’est pas ouverte, on ne rend rien
  if (!modalOpen) return null;

  // Styles locaux de la modale
  const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  };

  const modalBox = {
    background: "#fff",
    borderRadius: "12px",
    padding: "22px",
    width: "480px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  };

  const modalHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  };

  const modalTitleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0
  };

  const modalFooter = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  };

  const btnCancel = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f2f2f2",
    cursor: "pointer"
  };

  const btnConfirm = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: modalMode === "delete" ? "#d32f2f" : "#1976d2",
    color: "#fff",
    cursor: "pointer"
  };

  //   ------------------------------------------------------------
  //   getModalTitle()
  //   ------------------------------------------------------------
  //   Renvoie un titre lisible selon :
  //   - la section (infos, jeu, joueur...)
  //   - le mode (add, edit, delete)
  //   ------------------------------------------------------------ 
  const getModalTitle = () => {
    const labelSection = {
      infos: "informations générales",
      jeu: "jeu",
      joueur: "joueur",
      manager: "manager",
      staff: "staff",
      sponsor: "sponsor",
      palmares: "résultat du palmarès"
    };

    const base = labelSection[modalSection] || "";

    if (modalMode === "add") return `Ajouter ${modalSection === "infos" ? "les " : "un "}${base}`;
    if (modalMode === "edit") return `Modifier ${base}`;
    if (modalMode === "delete") return `Supprimer ${base}`;
    return "";
  };

  //   ------------------------------------------------------------
  //   handleSubmit
  //   ------------------------------------------------------------
  //   - En mode "delete" : on envoie juste l'ID
  //   - En mode "add" / "edit" :
  //       → on construit le payload à partir de modalForm
  //       → on déduit l’ID cible si nécessaire
  //   ------------------------------------------------------------ 
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mode suppression
    if (modalMode === "delete") {
      if (!modalItem || !modalItem.id) return;
      callApi("delete", modalSection, {}, modalItem.id);
      return;
    }

    // Type d’élément à envoyer au backend
    // "infos" -> "equipe", les autres gardent leur nom
    const type = modalSection === "infos" ? "equipe" : modalSection;

    // Payload = copie de modalForm
    const payload = { ...modalForm };

    // En mode "add", pour les sous-éléments (jeux, joueurs, etc.)
    // on ajoute l’ID de l’équipe
    if (modalMode === "add" && modalSection !== "infos") {
      payload.id_equipe = data.equipe.id_equipe;
    }

    // Cible de l’action (ID)
    const idTarget =
      modalMode === "edit"
        ? modalSection === "infos"
          ? data.equipe.id_equipe
          : modalItem.id
        : null;

    const action = modalMode === "add" ? "add" : "update";

    // Appel API centralisé
    callApi(action, type, payload, idTarget);
  };

  //   ------------------------------------------------------------
  //   Rendu de la modale
  //   ------------------------------------------------------------
  //   - overlay : fond sombre
  //   - modalBox : boîte blanche centrée
  //   - form : champs dynamiques + boutons
  //   ------------------------------------------------------------ 
  return (
    <div style={overlay} onClick={closeModal}>
      {/* e.stopPropagation() empêche de fermer la modale quand on clique dedans */}
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitleStyle}>{getModalTitle()}</h3>
          <button
            onClick={closeModal}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "20px"
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Champs dynamiques selon la section */}
          {renderFields(modalSection, modalForm, handleModalChange)}

          <div style={modalFooter}>
            <button type="button" style={btnCancel} onClick={closeModal}>
              Annuler
            </button>

            <button type="submit" style={btnConfirm} disabled={saving}>
              {saving
                ? "En cours..."
                : modalMode === "delete"
                ? "Supprimer"
                : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   PARTIE 3 — INFOS GÉNÉRALES DE L’ÉQUIPE
   ------------------------------------------------------------
   Cette section affiche les informations principales de l’équipe :
   - Nom
   - Tag
   - Date de création
   - Description courte / longue
   - Localisation
   - Réseaux sociaux
   - Logo

   Elle contient aussi un bouton "Modifier" qui ouvre la modale
   en mode édition avec tous les champs pré-remplis.
============================================================ */

const pageStyle = {
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: "30px 10px",
  boxSizing: "border-box",
  overflowX: "hidden"
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#1f2933"
};

const box = {
  background: "#fff",
  padding: "20px 20px 25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  marginBottom: "25px",
  boxSizing: "border-box"
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const title = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1976d2",
  margin: 0
};

const btnPrimary = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "none",
  background: "#1976d2",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  whiteSpace: "nowrap"
};

const infoText = {
  fontSize: "14px",
  margin: "3px 0"
};
const rowItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb"
};
const rowContent = {
  flex: 1
};

const rowActions = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginLeft: "15px"
};
const badgeEdit = {
  padding: "6px 10px",
  background: "#1976d2",
  color: "#fff",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  whiteSpace: "nowrap"
};

const badgeDelete = {
  padding: "6px 10px",
  background: "#d32f2f",
  color: "#fff",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  whiteSpace: "nowrap"
};

/* ------------------------------------------------------------
   RETURN PRINCIPAL DU DASHBOARD
   ------------------------------------------------------------
   À partir d’ici, on affiche :
   - Infos générales
   - Toutes les sections CRUD (PARTIE 4)
   - La modale (PARTIE 5)
------------------------------------------------------------ */

return (
  <div style={pageStyle}>
    <div style={containerStyle}>

      {/* ============================================================
         INFOS GÉNÉRALES DE L’ÉQUIPE
      ============================================================ */}
      <div style={box}>
        <div style={sectionHeader}>
          <h2 style={title}>Informations générales</h2>

          {/* Bouton Modifier → ouvre la modale en mode "edit" */}
          <button
            style={btnPrimary}
            onClick={() =>
              openModal("edit", "infos", equipe, {
                nom: equipe.nom || "",
                tag: equipe.tag || "",
                date_creation: equipe.date_creation || "",
                description_courte: equipe.description_courte || "",
                description_longue: equipe.description_longue || "",
                pays: equipe.pays || "",
                ville: equipe.ville || "",
                site_web: equipe.site_web || "",
                email_general: equipe.email_general || "",
                email_recrutement: equipe.email_recrutement || "",
                telephone: equipe.telephone || "",
                logo: equipe.logo || "",
                twitter: equipe.twitter || "",
                instagram: equipe.instagram || "",
                twitch: equipe.twitch || "",
                youtube: equipe.youtube || "",
                tiktok: equipe.tiktok || "",
                facebook: equipe.facebook || ""
              })
            }
          >
            ✏️ Modifier
          </button>
        </div>

        {/* Affichage des infos */}
        <p style={infoText}><strong>Nom :</strong> {equipe.nom}</p>
        <p style={infoText}><strong>Tag :</strong> {equipe.tag}</p>
        <p style={infoText}><strong>Date de création :</strong> {equipe.date_creation}</p>
        <p style={infoText}><strong>Description courte :</strong> {equipe.description_courte}</p>
        <p style={infoText}><strong>Description longue :</strong> {equipe.description_longue}</p>
        <p style={infoText}><strong>Pays :</strong> {equipe.pays}</p>
        <p style={infoText}><strong>Ville :</strong> {equipe.ville}</p>
        <p style={infoText}><strong>Site web :</strong> {equipe.site_web}</p>
        <p style={infoText}><strong>Email général :</strong> {equipe.email_general}</p>
        <p style={infoText}><strong>Email recrutement :</strong> {equipe.email_recrutement}</p>
        <p style={infoText}><strong>Téléphone :</strong> {equipe.telephone}</p>

        {equipe.logo && (
          <div style={{ marginTop: "15px" }}>
            <img
              src={equipe.logo}
              alt="Logo équipe"
              style={{ width: "120px", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>
{/* ============================================================
   PARTIE 4 — SECTIONS CRUD
   ------------------------------------------------------------
   Chaque section suit la même structure :
   - Une box blanche
   - Un titre
   - Un bouton "Ajouter"
   - Une liste d’éléments
   - Pour chaque élément :
       → bouton Modifier
       → bouton Supprimer

   Toutes les actions passent par la modale générique (PARTIE 2).
============================================================ */}


{/* ------------------------------------------------------------
   SECTION : JEUX
------------------------------------------------------------ */}
<div style={box}>
  <div style={sectionHeader}>
    <h2 style={title}>Jeux</h2>

    <button
      style={btnPrimary}
      onClick={() =>
        openModal("add", "jeu", null, {
          nom: "",
          rang: "",
          division: "",
          objectifs: ""
        })
      }
    >
      + Ajouter un jeu
    </button>
  </div>

  {jeux.length === 0 && <p>Aucun jeu.</p>}

  {jeux.map((j) => (
    <div key={j.id} style={rowItem}>
      <div style={rowContent}>
        <p style={infoText}><strong>Nom :</strong> {j.nom}</p>
        <p style={infoText}><strong>Rang :</strong> {j.rang}</p>
        <p style={infoText}><strong>Division :</strong> {j.division}</p>
        <p style={infoText}><strong>Objectifs :</strong> {j.objectifs}</p>
      </div>

      <div style={rowActions}>
        <button
          style={badgeEdit}
          onClick={() =>
            openModal("edit", "jeu", j, {
              nom: j.nom || "",
              rang: j.rang || "",
              division: j.division || "",
              objectifs: j.objectifs || ""
            })
          }
        >
          ✏️ Modifier
        </button>

        <button
          style={badgeDelete}
          onClick={() => openModal("delete", "jeu", j)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  ))}
</div>


{/* ------------------------------------------------------------
   SECTION : JOUEURS
------------------------------------------------------------ */}
<div style={box}>
  <div style={sectionHeader}>
    <h2 style={title}>Joueurs</h2>

    <button
      style={btnPrimary}
      onClick={() =>
        openModal("add", "joueur", null, {
          nom: "",
          pseudo: "",
          age: "",
          nationalite: "",
          jeu: "",
          role: "",
          experience: "",
          contrat: "",
          duree_contrat: "",
          date_arrivee: "",
          anciennes_equipes: "",
          photo: "",
          twitter: "",
          instagram: "",
          twitch: "",
          youtube: "",
          tiktok: "",
          facebook: ""
        })
      }
    >
      + Ajouter un joueur
    </button>
  </div>

  {joueurs.length === 0 && <p>Aucun joueur.</p>}

  {joueurs.map((j) => (
    <div key={j.id} style={rowItem}>
      <div style={rowContent}>
        <p style={infoText}><strong>Nom :</strong> {j.nom}</p>
        <p style={infoText}><strong>Pseudo :</strong> {j.pseudo}</p>
        <p style={infoText}><strong>Âge :</strong> {j.age}</p>
        <p style={infoText}><strong>Nationalité :</strong> {j.nationalite}</p>
        <p style={infoText}><strong>Jeu :</strong> {j.jeu}</p>
        <p style={infoText}><strong>Rôle :</strong> {j.role}</p>
        <p style={infoText}><strong>Contrat :</strong> {j.contrat} ({j.duree_contrat})</p>
        <p style={infoText}><strong>Date d'arrivée :</strong> {j.date_arrivee}</p>
      </div>

      <div style={rowActions}>
        <button
          style={badgeEdit}
          onClick={() =>
            openModal("edit", "joueur", j, {
              nom: j.nom || "",
              pseudo: j.pseudo || "",
              age: j.age || "",
              nationalite: j.nationalite || "",
              jeu: j.jeu || "",
              role: j.role || "",
              experience: j.experience || "",
              contrat: j.contrat || "",
              duree_contrat: j.duree_contrat || "",
              date_arrivee: j.date_arrivee || "",
              anciennes_equipes: j.anciennes_equipes || "",
              photo: j.photo || "",
              twitter: j.twitter || "",
              instagram: j.instagram || "",
              twitch: j.twitch || "",
              youtube: j.youtube || "",
              tiktok: j.tiktok || "",
              facebook: j.facebook || ""
            })
          }
        >
          ✏️ Modifier
        </button>

        <button
          style={badgeDelete}
          onClick={() => openModal("delete", "joueur", j)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  ))}
</div>


{/* ------------------------------------------------------------
   SECTION : MANAGERS
------------------------------------------------------------ */}
<div style={box}>
  <div style={sectionHeader}>
    <h2 style={title}>Managers</h2>

    <button
      style={btnPrimary}
      onClick={() =>
        openModal("add", "manager", null, {
          nom: "",
          role: "",
          age: "",
          jeux_geres: "",
          photo: "",
          twitter: "",
          instagram: "",
          twitch: "",
          youtube: "",
          tiktok: "",
          facebook: ""
        })
      }
    >
      + Ajouter un manager
    </button>
  </div>

  {managers.length === 0 && <p>Aucun manager.</p>}

  {managers.map((m) => (
    <div key={m.id} style={rowItem}>
      <div style={rowContent}>
        <p style={infoText}><strong>Nom :</strong> {m.nom}</p>
        <p style={infoText}><strong>Rôle :</strong> {m.role}</p>
        <p style={infoText}><strong>Âge :</strong> {m.age}</p>
        <p style={infoText}><strong>Jeux gérés :</strong> {m.jeux_geres}</p>
      </div>

      <div style={rowActions}>
        <button
          style={badgeEdit}
          onClick={() =>
            openModal("edit", "manager", m, {
              nom: m.nom || "",
              role: m.role || "",
              age: m.age || "",
              jeux_geres: m.jeux_geres || "",
              photo: m.photo || "",
              twitter: m.twitter || "",
              instagram: m.instagram || "",
              twitch: m.twitch || "",
              youtube: m.youtube || "",
              tiktok: m.tiktok || "",
              facebook: m.facebook || ""
            })
          }
        >
          ✏️ Modifier
        </button>

        <button
          style={badgeDelete}
          onClick={() => openModal("delete", "manager", m)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  ))}
</div>


{/* ------------------------------------------------------------
   SECTION : STAFF
------------------------------------------------------------ */}
<div style={box}>
  <div style={sectionHeader}>
    <h2 style={title}>Staff</h2>

    <button
      style={btnPrimary}
      onClick={() =>
        openModal("add", "staff", null, {
          nom: "",
          role: "",
          jeux_geres: "",
          photo: "",
          twitter: "",
          instagram: "",
          twitch: "",
          youtube: "",
          tiktok: "",
          facebook: ""
        })
      }
    >
      + Ajouter un staff
    </button>
  </div>

  {staff.length === 0 && <p>Aucun staff.</p>}

  {staff.map((s) => (
    <div key={s.id} style={rowItem}>
      <div style={rowContent}>
        <p style={infoText}><strong>Nom :</strong> {s.nom}</p>
        <p style={infoText}><strong>Rôle :</strong> {s.role}</p>
        <p style={infoText}><strong>Jeux gérés :</strong> {s.jeux_geres}</p>
      </div>

      <div style={rowActions}>
        <button
          style={badgeEdit}
          onClick={() =>
            openModal("edit", "staff", s, {
              nom: s.nom || "",
              role: s.role || "",
              jeux_geres: s.jeux_geres || "",
              photo: s.photo || "",
              twitter: s.twitter || "",
              instagram: s.instagram || "",
              twitch: s.twitch || "",
              youtube: s.youtube || "",
              tiktok: s.tiktok || "",
              facebook: s.facebook || ""
            })
          }
        >
          ✏️ Modifier
        </button>

        <button
          style={badgeDelete}
          onClick={() => openModal("delete", "staff", s)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  ))}
</div>


{/* ------------------------------------------------------------
   SECTION : SPONSORS
------------------------------------------------------------ */}
<div style={box}>
  <div style={sectionHeader}>
    <h2 style={title}>Sponsors</h2>

    <button
      style={btnPrimary}
      onClick={() =>
        openModal("add", "sponsor", null, {
          nom: "",
          type: "",
          duree: "",
          lien: "",
          logo: "",
          twitter: "",
          instagram: "",
          youtube: ""
        })
      }
    >
      + Ajouter un sponsor
    </button>
  </div>

  {sponsors.length === 0 && <p>Aucun sponsor.</p>}

  {sponsors.map((s) => (
    <div key={s.id} style={rowItem}>
      <div style={rowContent}>
        <p style={infoText}><strong>Nom :</strong> {s.nom}</p>
        <p style={infoText}><strong>Type :</strong> {s.type}</p>
        <p style={infoText}><strong>Durée :</strong> {s.duree}</p>
        <p style={infoText}><strong>Lien :</strong> {s.lien}</p>
      </div>

      <div style={rowActions}>
        <button
          style={badgeEdit}
          onClick={() =>
            openModal("edit", "sponsor", s, {
              nom: s.nom || "",
              type: s.type || "",
              duree: s.duree || "",
              lien: s.lien || "",
              logo: s.logo || "",
              twitter: s.twitter || "",
              instagram: s.instagram || "",
              youtube: s.youtube || ""
            })
          }
        >
          ✏️ Modifier
        </button>

        <button
          style={badgeDelete}
          onClick={() => openModal("delete", "sponsor", s)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  ))}
</div>


{/* ------------------------------------------------------------
   SECTION : PALMARÈS
------------------------------------------------------------ */}
<div style={box}>
  <div style={sectionHeader}>
    <h2 style={title}>Palmarès</h2>

    <button
      style={btnPrimary}
      onClick={() =>
        openModal("add", "palmares", null, {
          tournoi: "",
          date: "",
          resultat: "",
          recompense: ""
        })
      }
    >
      + Ajouter un résultat
    </button>
  </div>

  {palmares.length === 0 && <p>Aucun résultat.</p>}

  {palmares.map((p) => (
    <div key={p.id} style={rowItem}>
      <div style={rowContent}>
        <p style={infoText}><strong>Tournoi :</strong> {p.tournoi}</p>
        <p style={infoText}><strong>Date :</strong> {p.date}</p>
        <p style={infoText}><strong>Résultat :</strong> {p.resultat}</p>
        <p style={infoText}><strong>Récompense :</strong> {p.recompense}</p>
      </div>

      <div style={rowActions}>
        <button
          style={badgeEdit}
          onClick={() =>
            openModal("edit", "palmares", p, {
              tournoi: p.tournoi || "",
              date: p.date || "",
              resultat: p.resultat || "",
              recompense: p.recompense || ""
            })
          }
        >
          ✏️ Modifier
        </button>

        <button
          style={badgeDelete}
          onClick={() => openModal("delete", "palmares", p)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  ))}
</div>
      {/* ============================================================
         PARTIE 5 — MODALE GÉNÉRIQUE (PLACÉE À LA FIN DU RETURN)
         ------------------------------------------------------------
         On place la modale ici pour qu’elle soit disponible
         sur TOUT le dashboard, par-dessus toutes les sections.
      ============================================================ */}
      <Modal />
    </div>
  </div>
);




{/* ============================================================
   FIN DU FICHIER DashboardAdmin.jsx
   ------------------------------------------------------------
   Résumé :
   - PARTIE 1 : États + chargement des données
   - PARTIE 2 : Modale générique (logique CRUD + champs)
   - PARTIE 3 : Infos générales de l’équipe
   - PARTIE 4 : Sections CRUD (jeux, joueurs, managers, staff,
                sponsors, palmarès)
   - PARTIE 5 : Composant Modal + fin du return
============================================================ */}}

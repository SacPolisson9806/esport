import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEquipeCreate() {
  const navigate = useNavigate();

  // Infos générales
  const [general, setGeneral] = useState({
    nom: "",
    tag: "",
    date_creation: "",
    description_courte: "",
    description_longue: "",
    pays: "",
    ville: "",
    site_web: "",
    email_general: "",
    email_recrutement: "",
    telephone: "",
    twitter: "",
    instagram: "",
    twitch: "",
    youtube: "",
    tiktok: "",
    facebook: "",
    logo: null
  });

  // Jeux
  const [jeux, setJeux] = useState([
    { nom: "", rang: "", division: "", objectifs: "" }
  ]);

  // Joueurs
  const [joueurs, setJoueurs] = useState([
    {
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
      twitter: "",
instagram: "",
twitch: "",
youtube: "",
tiktok: "",
facebook: "",

      photo: null
    }
  ]);

  // Managers
  const [managers, setManagers] = useState([
    { nom: "", role: "", age: "", jeux_geres: "",twitter: "",
instagram: "",
twitch: "",
youtube: "",
tiktok: "",
facebook: "",
 photo: null }
  ]);

  // Staff
  const [staff, setStaff] = useState([
    { nom: "", role: "", age: "",twitter: "", instagram: "", twitch: "", youtube: "", tiktok: "", facebook: "", jeux_geres: "", photo: null }
  ]);

  // Sponsors
  const [sponsors, setSponsors] = useState([
    { nom: "", type: "", duree: "", lien: "",twitter: "",
instagram: "",
youtube: "",
 logo: null }
  ]);

  // Palmarès
  const [palmares, setPalmares] = useState([
    { tournoi: "", date: "", resultat: "", recompense: "" }
  ]);

  // Ajout dynamique
  const add = (setter, base) => setter(prev => [...prev, base]);

  // Envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Infos générales
    Object.keys(general).forEach(key => {
      formData.append(key, general[key]);
    });

    // Jeux
    formData.append("jeux", JSON.stringify(jeux));

    // Joueurs
    formData.append("joueurs", JSON.stringify(joueurs));
    joueurs.forEach((j, i) => {
      if (j.photo) formData.append(`joueur_photo_${i}`, j.photo);
    });

    // Managers
    formData.append("managers", JSON.stringify(managers));
    managers.forEach((m, i) => {
      if (m.photo) formData.append(`manager_photo_${i}`, m.photo);
    });

    // Staff
    formData.append("staff", JSON.stringify(staff));
    staff.forEach((s, i) => {
      if (s.photo) formData.append(`staff_photo_${i}`, s.photo);
    });

    // Sponsors
    formData.append("sponsors", JSON.stringify(sponsors));
    sponsors.forEach((s, i) => {
      if (s.logo) formData.append(`sponsor_logo_${i}`, s.logo);
    });

    // Palmarès
    formData.append("palmares", JSON.stringify(palmares));

    fetch("http://localhost/esportmanagerbackend/api/Equipeadmin/creer_equipe_complet.php", {
      method: "POST",
      credentials: "include",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) navigate(`../dashboardadmin/${data.id_equipe}`);
        else alert(data.message);
      });
  };

  // Styles
  const box = {
    padding: "20px",
    marginBottom: "25px",
    background: "#f7faff",
    borderRadius: "12px",
    border: "1px solid #dce7f7"
  };

  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px"
  };

  const title = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1976d2",
    marginBottom: "15px"
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Inter" }}>
      <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: "30px" }}>
        Créer votre équipe complète
      </h2>

      <form onSubmit={handleSubmit}>

        {/* INFOS GÉNÉRALES */}
        <div style={box}>
          <div style={title}>Informations générales</div>

          <input style={input} placeholder="Nom de l'équipe"
            onChange={e => setGeneral({ ...general, nom: e.target.value })} />

          <input style={input} placeholder="Tag / Acronyme"
            onChange={e => setGeneral({ ...general, tag: e.target.value })} />

          <input type="date" style={input}
            onChange={e => setGeneral({ ...general, date_creation: e.target.value })} />

          <textarea style={input} placeholder="Description courte"
            onChange={e => setGeneral({ ...general, description_courte: e.target.value })} />

          <textarea style={input} placeholder="Description longue"
            onChange={e => setGeneral({ ...general, description_longue: e.target.value })} />

          <input style={input} placeholder="Pays"
            onChange={e => setGeneral({ ...general, pays: e.target.value })} />

          <input style={input} placeholder="Ville"
            onChange={e => setGeneral({ ...general, ville: e.target.value })} />

          <input style={input} placeholder="Site web"
            onChange={e => setGeneral({ ...general, site_web: e.target.value })} />

          <input style={input} placeholder="Email général"
            onChange={e => setGeneral({ ...general, email_general: e.target.value })} />

          <input style={input} placeholder="Email recrutement"
            onChange={e => setGeneral({ ...general, email_recrutement: e.target.value })} />

          <input style={input} placeholder="Téléphone"
            onChange={e => setGeneral({ ...general, telephone: e.target.value })} />

          <label>Logo :</label>
          <input type="file" style={input}
            onChange={e => setGeneral({ ...general, logo: e.target.files[0] })} />

            <input style={input} placeholder="Twitter"
  onChange={e => setGeneral({ ...general, twitter: e.target.value })} />

<input style={input} placeholder="Instagram"
  onChange={e => setGeneral({ ...general, instagram: e.target.value })} />

<input style={input} placeholder="Twitch"
  onChange={e => setGeneral({ ...general, twitch: e.target.value })} />

<input style={input} placeholder="YouTube"
  onChange={e => setGeneral({ ...general, youtube: e.target.value })} />

<input style={input} placeholder="TikTok"
  onChange={e => setGeneral({ ...general, tiktok: e.target.value })} />

<input style={input} placeholder="Facebook"
  onChange={e => setGeneral({ ...general, facebook: e.target.value })} />

        </div>

        {/* JEUX */}
        <div style={box}>
          <div style={title}>Jeux joués</div>

          {jeux.map((j, i) => (
            <div key={i}>
              <input style={input} placeholder="Nom du jeu"
                onChange={e => {
                  const copy = [...jeux];
                  copy[i].nom = e.target.value;
                  setJeux(copy);
                }} />

              <input style={input} placeholder="Rang moyen"
                onChange={e => {
                  const copy = [...jeux];
                  copy[i].rang = e.target.value;
                  setJeux(copy);
                }} />

              <input style={input} placeholder="Division / Ligue"
                onChange={e => {
                  const copy = [...jeux];
                  copy[i].division = e.target.value;
                  setJeux(copy);
                }} />

              <textarea style={input} placeholder="Objectifs compétitifs"
                onChange={e => {
                  const copy = [...jeux];
                  copy[i].objectifs = e.target.value;
                  setJeux(copy);
                }} />
            </div>
          ))}

          <button type="button" onClick={() => add(setJeux, { nom: "", rang: "", division: "", objectifs: "" })}
            style={{ padding: "8px 14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "8px" }}>
            ➕ Ajouter un jeu
          </button>
        </div>

        {/* JOUEURS */}
        <div style={box}>
          <div style={title}>Joueurs</div>

          {joueurs.map((j, i) => (
            <div key={i}>
              <input style={input} placeholder="Nom"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].nom = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Pseudo"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].pseudo = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Âge"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].age = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Nationalité"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].nationalite = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Jeu principal"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].jeu = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Rôle (sniper, tank...)"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].role = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Expérience e-sport"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].experience = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Sous contrat ? (oui/non)"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].contrat = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Durée du contrat"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].duree_contrat = e.target.value;
                  setJoueurs(copy);
                }} />

              <input type="date" style={input}
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].date_arrivee = e.target.value;
                  setJoueurs(copy);
                }} />

              <input style={input} placeholder="Anciennes équipes"
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].anciennes_equipes = e.target.value;
                  setJoueurs(copy);
                }} />

              <label>Photo :</label>
              <input type="file" style={input}
                onChange={e => {
                  const copy = [...joueurs];
                  copy[i].photo = e.target.files[0];
                  setJoueurs(copy);
                }} />
                <input style={input} placeholder="Twitter"
  onChange={e => {
    const copy = [...joueurs];
    copy[i].twitter = e.target.value;
    setJoueurs(copy);
  }} />

<input style={input} placeholder="Instagram"
  onChange={e => {
    const copy = [...joueurs];
    copy[i].instagram = e.target.value;
    setJoueurs(copy);
  }} />

<input style={input} placeholder="Twitch"
  onChange={e => {
    const copy = [...joueurs];
    copy[i].twitch = e.target.value;
    setJoueurs(copy);
  }} />

<input style={input} placeholder="YouTube"
  onChange={e => {
    const copy = [...joueurs];
    copy[i].youtube = e.target.value;
    setJoueurs(copy);
  }} />

<input style={input} placeholder="TikTok"
  onChange={e => {
    const copy = [...joueurs];
    copy[i].tiktok = e.target.value;
    setJoueurs(copy);
  }} />

<input style={input} placeholder="Facebook"
  onChange={e => {
    const copy = [...joueurs];
    copy[i].facebook = e.target.value;
    setJoueurs(copy);
  }} />

            </div>
          ))}

          <button type="button" onClick={() => add(setJoueurs, {
            nom: "", pseudo: "", age: "", nationalite: "", jeu: "", role: "",
            experience: "", contrat: "", duree_contrat: "", date_arrivee: "",
            anciennes_equipes: "", twitter: "", instagram: "", twitch: "", youtube: "", photo: null
          })}
            style={{ padding: "8px 14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "8px" }}>
            ➕ Ajouter un joueur
          </button>
        </div>

        {/* PALMARÈS */}
        <div style={box}>
          <div style={title}>Palmarès</div>

          {palmares.map((p, i) => (
            <div key={i}>
              <input style={input} placeholder="Tournoi"
                onChange={e => {
                  const copy = [...palmares];
                  copy[i].tournoi = e.target.value;
                  setPalmares(copy);
                }} />

              <input type="date" style={input}
                onChange={e => {
                  const copy = [...palmares];
                  copy[i].date = e.target.value;
                  setPalmares(copy);
                }} />

              <input style={input} placeholder="Résultat"
                onChange={e => {
                  const copy = [...palmares];
                  copy[i].resultat = e.target.value;
                  setPalmares(copy);
                }} />

              <input style={input} placeholder="Récompense"
                onChange={e => {
                  const copy = [...palmares];
                  copy[i].recompense = e.target.value;
                  setPalmares(copy);
                }} />
            </div>
          ))}

          <button type="button" onClick={() => add(setPalmares, { tournoi: "", date: "", resultat: "", recompense: "" })}
            style={{ padding: "8px 14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "8px" }}>
            ➕ Ajouter un palmarès
          </button>
        </div>

        {/* MANAGERS */}
        <div style={box}>
          <div style={title}>Managers</div>

          {managers.map((m, i) => (
            <div key={i}>
              <input style={input} placeholder="Nom"
                onChange={e => {
                  const copy = [...managers];
                  copy[i].nom = e.target.value;
                  setManagers(copy);
                }} />

              <input style={input} placeholder="Rôle"
                onChange={e => {
                  const copy = [...managers];
                  copy[i].role = e.target.value;
                  setManagers(copy);
                }} />

              <input style={input} placeholder="Âge"
                onChange={e => {
                  const copy = [...managers];
                  copy[i].age = e.target.value;
                  setManagers(copy);
                }} />
                <input
  style={input}
  placeholder="Équipe(s) gérée(s) (ex : Valorant, LoL...)"
  onChange={e => {
    const copy = [...managers];
    copy[i].jeux_geres = e.target.value;
    setManagers(copy);
  }}
/>
<input style={input} placeholder="Twitter"
  onChange={e => {
    const copy = [...managers];
    copy[i].twitter = e.target.value;
    setManagers(copy);
  }} />

<input style={input} placeholder="Instagram"
  onChange={e => {
    const copy = [...managers];
    copy[i].instagram = e.target.value;
    setManagers(copy);
  }} />

<input style={input} placeholder="Twitch"
  onChange={e => {
    const copy = [...managers];
    copy[i].twitch = e.target.value;
    setManagers(copy);
  }} />

<input style={input} placeholder="YouTube"
  onChange={e => {
    const copy = [...managers];
    copy[i].youtube = e.target.value;
    setManagers(copy);
  }} />

<input style={input} placeholder="TikTok"
  onChange={e => {
    const copy = [...managers];
    copy[i].tiktok = e.target.value;
    setManagers(copy);
  }} />

<input style={input} placeholder="Facebook"
  onChange={e => {
    const copy = [...managers];
    copy[i].facebook = e.target.value;
    setManagers(copy);
  }} />


              <label>Photo :</label>
              <input type="file" style={input}
                onChange={e => {
                  const copy = [...managers];
                  copy[i].photo = e.target.files[0];
                  setManagers(copy);
                }} />
            </div>
          ))}

          <button type="button" onClick={() => add(setManagers, { nom: "", role: "", age: "", photo: null })}
            style={{ padding: "8px 14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "8px" }}>
            ➕ Ajouter un manager
          </button>
        </div>

        {/* STAFF */}
        <div style={box}>
          <div style={title}>Staff</div>

          {staff.map((s, i) => (
            <div key={i}>
              <input style={input} placeholder="Nom"
                onChange={e => {
                  const copy = [...staff];
                  copy[i].nom = e.target.value;
                  setStaff(copy);
                }} />

              <input style={input} placeholder="Rôle"
                onChange={e => {
                  const copy = [...staff];
                  copy[i].role = e.target.value;
                  setStaff(copy);
                }} />

              <input style={input} placeholder="Âge"
                onChange={e => {
                  const copy = [...staff];
                  copy[i].age = e.target.value;
                  setStaff(copy);
                }} />
                <input
  style={input}
  placeholder="Équipe(s) gérée(s) (ex : Valorant, LoL...)"
  onChange={e => {
    const copy = [...staff];
    copy[i].jeux_geres = e.target.value;
    setStaff(copy);
  }}
/>
<input style={input} placeholder="Twitter"
  onChange={e => {
    const copy = [...staff];
    copy[i].twitter = e.target.value;
    setStaff(copy);
  }} />

<input style={input} placeholder="Instagram"
  onChange={e => {
    const copy = [...staff];
    copy[i].instagram = e.target.value;
    setStaff(copy);
  }} />

<input style={input} placeholder="Twitch"
  onChange={e => {
    const copy = [...staff];
    copy[i].twitch = e.target.value;
    setStaff(copy);
  }} />

<input style={input} placeholder="YouTube"
  onChange={e => {
    const copy = [...staff];
    copy[i].youtube = e.target.value;
    setStaff(copy);
  }} />

<input style={input} placeholder="TikTok"
  onChange={e => {
    const copy = [...staff];
    copy[i].tiktok = e.target.value;
    setStaff(copy);
  }} />

<input style={input} placeholder="Facebook"
  onChange={e => {
    const copy = [...staff];
    copy[i].facebook = e.target.value;
    setStaff(copy);
  }} />


              <label>Photo :</label>
              <input type="file" style={input}
                onChange={e => {
                  const copy = [...staff];
                  copy[i].photo = e.target.files[0];
                  setStaff(copy);
                }} />
            </div>
          ))}

          <button type="button" onClick={() => add(setStaff, { nom: "", role: "", age: "", photo: null })}
            style={{ padding: "8px 14px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "8px" }}>
            ➕ Ajouter un membre du staff
          </button>
        </div>

        {/* SPONSORS */}
        <div style={box}>
          <div style={title}>Sponsors</div>

          {sponsors.map((s, i) => (
            <div key={i}>
              <input style={input} placeholder="Nom du sponsor"
                onChange={e => {
                  const copy = [...sponsors];
                  copy[i].nom = e.target.value;
                  setSponsors(copy);
                }} />

              <input style={input} placeholder="Type de partenariat"
                onChange={e => {
                  const copy = [...sponsors];
                  copy[i].type = e.target.value;
                  setSponsors(copy);
                }} />

              <input style={input} placeholder="Durée du contrat"
                onChange={e => {
                  const copy = [...sponsors];
                  copy[i].duree = e.target.value;
                  setSponsors(copy);
                }} />

              <input style={input} placeholder="Lien du site"
                onChange={e => {
                  const copy = [...sponsors];
                  copy[i].lien = e.target.value;
                  setSponsors(copy);
                }} />

              <label>Logo :</label>
              <input type="file" style={input}
                onChange={e => {
                  const copy = [...sponsors];
                  copy[i].logo = e.target.files[0];
                  setSponsors(copy);
                }} />
                <input style={input} placeholder="Twitter"
  onChange={e => {
    const copy = [...sponsors];
    copy[i].twitter = e.target.value;
    setSponsors(copy);
  }} />

<input style={input} placeholder="Instagram"
  onChange={e => {
    const copy = [...sponsors];
    copy[i].instagram = e.target.value;
    setSponsors(copy);
  }} />

<input style={input} placeholder="YouTube"
  onChange={e => {
    const copy = [...sponsors];
    copy[i].youtube = e.target.value;
    setSponsors(copy);
  }} />

            </div>
          ))}

          <button
  type="button"
  onClick={() =>
    add(setSponsors, {
      nom: "",
      type: "",
      duree: "",
      lien: "",
      logo: null
    })
  }
  style={{
    padding: "8px 14px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  ➕ Ajouter un sponsor
</button>
</div>

{/* BOUTON DE VALIDATION */}
<button
  type="submit"
  style={{
    width: "100%",
    padding: "16px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "30px"
  }}
>
  🚀 Créer l'équipe complète
</button>

</form>
</div>
);
}

export default AdminEquipeCreate;

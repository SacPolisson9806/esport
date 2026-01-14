import React, { useState } from "react";

function AdminCreateUser() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("visiteur");
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    const res = await fetch("http://localhost/esportmanagerbackend/api/Utilisateur/create_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, email, mot_de_passe: motDePasse, role, permissions })
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "10px" }}>
      <h2>Créer un nouveau compte</h2>
      <input type="text" placeholder="Pseudo" onChange={e => setPseudo(e.target.value)} />
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" onChange={e => setMotDePasse(e.target.value)} />
      <select onChange={e => setRole(e.target.value)}>
        <option value="visiteur">Visiteur</option>
        <option value="admin_equipe">Admin Équipe</option>
        <option value="super_admin">Super Admin</option>
      </select>
      <button onClick={handleCreate}>Créer le compte</button>
      <p>{message}</p>
    </div>
  );
}

export default AdminCreateUser;

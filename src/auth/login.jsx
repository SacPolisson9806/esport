import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [pseudo, setPseudo] = useState("");
  const [mot_de_passe, setMotDePasse] = useState(""); // 🔥 même nom que le backend
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost/esportmanagerbackend/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pseudo: pseudo,
          mot_de_passe: mot_de_passe // 🔥 correspond EXACTEMENT au backend
        })
      });
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        window.location.href = "/salon"; 
      }
    } catch (error) {
      console.log(error);
      setMessage("Erreur serveur");
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "60px auto",
      padding: "25px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif"
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "14px"
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#61dafb",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer"
    },
    link: {
      color: "#61dafb",
      textDecoration: "none"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>Connexion</h2>

      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={pseudo}
        onChange={e => setPseudo(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={mot_de_passe}
        onChange={e => setMotDePasse(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Se connecter
      </button>

      <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Pas de compte ?{" "}
        <Link to="/register" style={styles.link}>
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

export default Login;

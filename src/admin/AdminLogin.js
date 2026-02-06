// Hook de estado do React
import { useState } from "react";
// Hook de navegação do React Router
import { useNavigate } from "react-router-dom";

// CONFIGURAÇÃO DIRETA DA API DO RAILWAY
const API_URL = "https://central-joias-backend.up.railway.app/api";

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      console.log("Tentando login em:", `${API_URL}/admin/login`);
      
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username, // Verifique se seu backend espera 'username' ou 'email'
          password  // Verifique se seu backend espera 'password' ou 'senha'
        })
      });

      // Verifica se a resposta é um JSON antes de converter
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou um JSON válido. Verifique a URL da API.");
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.detail || "Usuário ou senha inválidos");
        return;
      }

      // Salva o token (ajuste 'token' ou 'access_token' conforme seu backend)
      const token = data.token || data.access_token;
      localStorage.setItem("admin_token", token);
      
      console.log("Login realizado com sucesso!");
      navigate("/admin");

    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro ao conectar com o servidor. Verifique o console.");
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h1 style={styles.title}>Central Joias</h1>
        <p style={styles.subtitle}>Painel Administrativo</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
        />

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}

// Estilos mantidos conforme o original
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0B0B0B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#111827",
    padding: "32px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  title: {
    textAlign: "center",
    color: "#D4AF37",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "4px"
  },
  subtitle: {
    textAlign: "center",
    color: "#9CA3AF",
    marginBottom: "16px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    backgroundColor: "#FFFFFF",
    color: "#1F2937"
  },
  button: {
    backgroundColor: "#D4AF37",
    color: "#000",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  error: {
    color: "#EF4444",
    textAlign: "center",
    fontSize: "14px"
  }
};
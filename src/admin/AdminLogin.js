// Hook de estado do React
import { useState } from "react";

// Hook de navegação do React Router
import { useNavigate } from "react-router-dom";

// Componente de login do administrador
export function AdminLogin() {
  // Usado para redirecionar após login
  const navigate = useNavigate();

  // Estado do campo usuário
  const [username, setUsername] = useState("");

  // Estado do campo senha
  const [password, setPassword] = useState("");

  // Estado de mensagem de erro
  const [error, setError] = useState("");

  /* ===== FUNÇÃO DE LOGIN =====
     - Envia usuário e senha para o backend
     - Salva token no localStorage
     - Redireciona para o painel
  */
  async function handleLogin(e) {
  e.preventDefault()
  setError("")

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      setError(data.detail || "Usuário ou senha inválidos")
      return
    }

    localStorage.setItem("admin_token", data.access_token)
    navigate("/admin")

  } catch (err) {
    console.error("Erro no login:", err)
    setError("Erro ao conectar com o servidor")
  }
}

  return (
    // Página centralizada
    <div style={styles.page}>
      {/* Card de login */}
      <form onSubmit={handleLogin} style={styles.card}>
        
        {/* Logo / Nome */}
        <h1 style={styles.title}>Central Joias</h1>
        <p style={styles.subtitle}>Painel Administrativo</p>

        {/* Mensagem de erro */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Campo usuário */}
        <input
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
        />

        {/* Campo senha */}
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* Botão de submit */}
        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}

/* ===== ESTILOS INLINE =====
   Mantidos simples e isolados
   Não dependem de Tailwind ou CSS externo
*/
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

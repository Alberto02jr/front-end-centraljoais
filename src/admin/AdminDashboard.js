// =========================
// IMPORTS
// =========================
import React, { useEffect, useState } from "react"

// React Router
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"

// Ícones
import {
  LogOut,
  Package,
  Home as HomeIcon,
} from "lucide-react"

// Axios
import axios from "axios"

// Telas do painel
import { ProductsManager } from "./ProductsManager"
import { HomeContentManager } from "./home-content-manager"

// API
const API = process.env.REACT_APP_API_URL

export const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [token, setToken] = useState(null)
  const [siteName, setSiteName] = useState("Admin")

  /* ======================
     AUTH
  ====================== */
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token")

    if (!savedToken) {
      navigate("/admin/login")
    } else {
      setToken(savedToken)
      fetchSiteName()
    }
  }, [navigate])

  /* ======================
     SITE NAME
  ====================== */
  const fetchSiteName = async () => {
    try {
      const res = await axios.get(`${API}/home-content`)
      if (res.data?.branding?.nome_loja) {
        setSiteName(res.data.branding.nome_loja)
      }
    } catch {
      setSiteName("Admin")
    }
  }

  /* ======================
     LOGOUT
  ====================== */
  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    navigate("/admin/login")
  }

  if (!token) return null

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {siteName} • Admin
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 border-r border-white/10 p-6">
          <nav className="space-y-2">

            {/* PRODUTOS */}
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === "/admin" ||
                location.pathname === "/admin/"
                  ? "bg-white/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Package className="w-5 h-5" />
              Catálogo
            </Link>

            {/* HOME CONTENT */}
            <Link
              to="/admin/home-content"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === "/admin/home-content"
                  ? "bg-white/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              Página Principal
            </Link>

          </nav>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 p-8">

          <Routes>

            {/* PRODUTOS */}
            <Route
              path="/"
              element={<ProductsManager token={token} />}
            />

            {/* HOME CONTENT */}
            <Route
              path="/home-content"
              element={<HomeContentManager token={token} />}
            />

          </Routes>
        </main>
      </div>
    </div>
  )
}

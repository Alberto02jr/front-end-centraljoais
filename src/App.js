import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'

import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Cart } from './pages/Cart'

import { AdminLogin } from './admin/AdminLogin'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminPrivateRoute } from './admin/AdminPrivateRoute'

import { CartProvider, useCart } from './context/CartContext'

import '@/App.css'

const API = process.env.REACT_APP_API_URL

/* =========================
   LAYOUT PÚBLICO
========================= */
const Layout = () => {
  const { cartItems } = useCart()

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  // 🔥 ESTADO DO CONTEÚDO DO SITE
  const [homeContent, setHomeContent] = useState(null)

  // 🔥 BUSCA DO MONGODB
  useEffect(() => {
    async function loadHomeContent() {
      try {
        const res = await axios.get(`${API}/home-content`)
        console.log("[v0] homeContent recebido do backend:", JSON.stringify(res.data, null, 2))
        console.log("[v0] hero:", JSON.stringify(res.data?.hero, null, 2))
        console.log("[v0] sobre:", JSON.stringify(res.data?.sobre, null, 2))
        setHomeContent(res.data)
      } catch (err) {
        console.error('Erro ao carregar home content', err)
      }
    }

    loadHomeContent()
  }, [])

  return (
    <>
      {/* 🔥 AGORA O HEADER RECEBE DADOS DO MONGO */}
      <Header cartCount={cartCount} homeContent={homeContent} />

      <Routes>
        <Route path="/" element={<Home homeContent={homeContent} />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/carrinho" element={<Cart />} />
      </Routes>

      {/* 🔥 FOOTER TAMBÉM RECEBE */}
      <Footer homeContent={homeContent} />
      <WhatsAppButton />
    </>
  )
}

/* =========================
   APP PRINCIPAL
========================= */
function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/*"
              element={
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              }
            />

            {/* SITE PÚBLICO */}
            <Route path="/*" element={<Layout />} />

          </Routes>
        </BrowserRouter>

        <Toaster position="top-right" />
      </CartProvider>
    </div>
  )
}

export default App

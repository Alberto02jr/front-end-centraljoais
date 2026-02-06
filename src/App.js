import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Cart } from './pages/Cart'
import { AdminLogin } from './admin/AdminLogin'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminPrivateRoute } from './admin/AdminPrivateRoute'
import { CartProvider } from './context/CartContext'
import '@/App.css'

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* ADMIN */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              }
            />

            {/* SITE PÚBLICO - SEM HEADER E FOOTER AQUI */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/carrinho" element={<Cart />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </CartProvider>
    </div>
  )
}

export default App
import React, { createContext, useContext, useState } from "react"
import { toast } from "sonner"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  /**
   * NORMALIZA O PRODUTO
   * Aceita produto vindo:
   * - do catálogo novo
   * - do backend antigo
   * - de qualquer lugar
   */
  const normalizeProduct = (product) => {
    return {
      id: product.id,

      // Nome
      nome: product.nome || product.name || "Produto",

      // Categoria
      categoria: product.categoria || product.category || "",

      // Preço (promo tem prioridade)
      preco:
        product.preco ??
        product.price ??
        product.promo_price ??
        0,

      // Imagens
      imagens_urls:
        product.imagens_urls ||
        product.images ||
        [],

      // Quantidade inicial
      quantity: product.quantity || 1,
    }
  }

  const addToCart = (product) => {
    const normalized = normalizeProduct(product)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === normalized.id)

      if (existing) {
        return prev.map((item) =>
          item.id === normalized.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, normalized]
    })

    toast.success("Produto adicionado ao carrinho")
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.preco * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider")
  }
  return context
}

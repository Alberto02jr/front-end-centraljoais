import React from 'react';
import { Link } from 'react-router-dom';
// Ícones: Lixeira, Sacola e o Balão de Conversa (WhatsApp)
import { Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { toast } from 'sonner'; // Biblioteca de notificações
import { useCart } from '../context/CartContext'; // Hook para acessar os dados globais do carrinho

export const Cart = () => {
  // Desestrutura as funções e dados que o Contexto do Carrinho oferece
  const {
    cartItems,      // Array com os produtos adicionados
    removeFromCart, // Função para tirar um item específico
    clearCart,      // Função para esvaziar tudo
    total           // Valor total da soma de todos os itens
  } = useCart();

  /**
   * FUNÇÃO PARA FINALIZAR PEDIDO
   * Monta uma string de texto formatada e abre o link do WhatsApp.
   */
  const handleWhatsAppOrder = () => {
    // Bloqueia se o carrinho estiver vazio
    if (cartItems.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    // Início da montagem da mensagem (Markdown do WhatsApp: *texto* deixa em negrito)
    let message = '*Pedido Central Joias*\n\n';
    
    // Percorre cada item do carrinho e adiciona os detalhes na mensagem
    cartItems.forEach((item) => {
      message += `*${item.nome}*\n`;
      message += `Categoria: ${item.categoria || '-'}\n`;
      message += `Quantidade: ${item.quantity}\n`;
      message += `Valor unitário: R$ ${item.preco.toFixed(2)}\n`;
      message += `Subtotal: R$ ${(item.preco * item.quantity).toFixed(2)}\n\n`;
    });

    // Adiciona o valor final do pedido
    message += `*TOTAL: R$ ${total.toFixed(2)}*`;

    // Configurações do link do WhatsApp
    const phone = '556233541453'; // Número da loja
    const encodedMessage = encodeURIComponent(message); // Converte espaços e símbolos para formato de URL
    
    // Abre o WhatsApp em uma nova aba com a mensagem pronta
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  /**
   * ESTADO VAZIO: 
   * Caso não existam itens, exibe uma tela amigável convidando o usuário a comprar.
   */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6" data-testid="cart-page">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gold-300/30 mx-auto mb-6" />
          <h1 className="font-serif text-4xl text-white mb-4">
            Seu Carrinho está Vazio
          </h1>
          <p className="text-gray-400 mb-8">
            Adicione produtos ao carrinho para continuar
          </p>
          {/* Link que leva de volta ao catálogo */}
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-black font-semibold rounded-full px-8 py-3 hover:scale-105 transition-transform"
            data-testid="browse-catalog-button"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  /**
   * RENDERIZAÇÃO DO CARRINHO COM ITENS
   */
  return (
    <div className="min-h-screen pt-32 pb-20 px-6" data-testid="cart-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl text-white mb-8 tracking-tight">
          Carrinho de Compras
        </h1>

        {/* LISTA DE PRODUTOS */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-black-card rounded-xl p-6 border border-white/5 flex gap-6"
              data-testid={`cart-item-${item.id}`}
            >
              {/* Miniatura da Imagem */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-black-surface flex-shrink-0">
                {item.imagens_urls && item.imagens_urls[0] ? (
                  <img
                    src={item.imagens_urls[0]}
                    alt={item.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gold-300/30" />
                  </div>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="flex-1">
                <p className="text-xs text-gold-300 uppercase tracking-wider mb-1">
                  {item.categoria}
                </p>
                <h3 className="font-serif text-xl text-white mb-2">
                  {item.nome}
                </h3>
                <p className="text-lg text-gray-400">
                  Quantidade: {item.quantity}
                </p>
              </div>

              {/* Preço e Botão de Excluir */}
              <div className="flex flex-col items-end justify-between">
                <p className="text-2xl font-semibold gold-gradient-text">
                  R$ {(item.preco * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                  data-testid={`remove-item-${item.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMO DO PEDIDO E AÇÕES FINALIZADORAS */}
        <div className="bg-black-card rounded-xl p-6 border border-white/5 mb-6">
          <div className="flex justify-between items-center mb-6">
            <span className="font-serif text-2xl text-white">
              Total
            </span>
            <span
              className="text-4xl font-semibold gold-gradient-text"
              data-testid="cart-total"
            >
              R$ {total.toFixed(2)}
            </span>
          </div>

          {/* Botão de Finalização (WhatsApp) */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-black font-semibold rounded-full px-8 py-4 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 mb-3"
            data-testid="whatsapp-order-button"
          >
            <MessageCircle className="w-5 h-5" />
            Finalizar Pedido via WhatsApp
          </button>

          {/* Botão para limpar todo o carrinho de uma vez */}
          <button
            onClick={clearCart}
            className="w-full border border-red-400/50 text-red-400 rounded-full px-8 py-3 hover:bg-red-400/10 transition-colors"
            data-testid="clear-cart-button"
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};
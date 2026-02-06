'use client';

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, LogIn, Menu, X, Gem, ChevronRight } from "lucide-react";

const BRANDING_PADRAO = {
  nome_loja: "Central Joias",
  slogan: "Joias & relojoaria",
  logo_url:
    "https://res.cloudinary.com/albertojunio/image/upload/v1769800253/central_joias/marzxjndkncjmgpcysou.png",
};

export const Header = ({ cartCount = 0, homeContent }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const branding = homeContent?.branding || homeContent?.header || {};
  
  const nome_loja = branding.nome_loja || branding.titulo || BRANDING_PADRAO.nome_loja;
  const slogan = branding.slogan || BRANDING_PADRAO.slogan;
  
  // --- CORREÇÃO DE CACHE AQUI ---
  // Adicionamos um timestamp (?t=...) para forçar o navegador a atualizar a imagem
  const base_logo_url = branding.logo_url || branding.logo || BRANDING_PADRAO.logo_url;
  const logo_url = `${base_logo_url}?t=${new Date().getTime()}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileOpen(false);
  };

  const scrollToTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const NAV_ITEMS = [
    { label: "Inicio", action: scrollToTop },
    { label: "Catalogo", to: "/catalogo" },
    { label: "Sobre", action: () => scrollToSection("sobre") },
    { label: "Contato", action: () => scrollToSection("contato") },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-lg shadow-black/20' 
        : 'bg-zinc-950 border-b border-amber-500/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-20 md:h-24 flex items-center justify-between">

          {/* BRANDING */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                key={logo_url} // A 'key' ajuda o React a remontar a imagem quando a URL mudar
                src={logo_url}
                alt={nome_loja}
                className="h-14 md:h-16 relative z-10 object-contain"
                onError={(e) => {
                  // Se a imagem nova der erro, ele tenta carregar a padrão sem o lixo do cache
                  e.target.src = BRANDING_PADRAO.logo_url;
                }}
              />
            </div>
            <div className="flex flex-col leading-tight text-left">
              <span className="font-serif text-xl md:text-2xl tracking-wide text-white group-hover:text-amber-400 transition-colors">
                {nome_loja}
              </span>
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                {slogan}
              </span>
            </div>
          </button>

          {/* ... restante do código (mantido igual) ... */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-amber-400 hover:border-zinc-700 transition-all"
              title="Administrador"
            >
              <LogIn size={16} />
            </button>

            <button
              onClick={() => navigate("/carrinho")}
              className="relative p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-zinc-700 transition-all group"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-900 text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/catalogo"
              className="hidden lg:flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <Gem size={14} />
              Ver Joias
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-zinc-800 animate-in slide-in-from-top duration-200">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item, i) => (
                item.to ? (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 hover:text-amber-400 transition-all group"
                  >
                    <span className="uppercase tracking-widest text-xs">{item.label}</span>
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  </Link>
                ) : (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 hover:text-amber-400 transition-all group"
                  >
                    <span className="uppercase tracking-widest text-xs">{item.label}</span>
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  </button>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
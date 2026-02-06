'use client';

import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Award, Gem, ShieldCheck, ChevronRight, Instagram, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_FALLBACK = {
  institucional:
    "Ha mais de 15 anos oferecendo joias de prata 950, moeda antiga e semijoias com qualidade artesanal, certificacao e atendimento personalizado.",
  lojas: [
    {
      nome: "Loja Niqueiandia",
      endereco: "Avenida Brasil, n 77 A\nCentro - Niqueiandia - GO\nCEP: 76420-000",
      telefone: "(62) 3354-1453",
      tel_link: "tel:+556233541453",
      horario: "Segunda a Sexta: 8h as 18h",
    },
    {
      nome: "Loja Minacu",
      endereco:
        "Av. Maranhao, entre as ruas 12 e 13\nCentro - Minacu - GO\nN 1240 - CEP: 76450-000",
      telefone: "+55 (62) 9964-7220",
      tel_link: "tel:+556299647220",
      horario: "Segunda a Sexta: 8h as 18h",
    },
  ],
  cnpj: "10.762.100/0158",
  selo_texto: "Loja Premium - Referencia na Cidade",
  certificados: [],
};

const QUICK_LINKS = [
  { label: "Catalogo", to: "/catalogo" },
  { label: "Sobre Nos", to: "/#sobre" },
  { label: "Contato", to: "/#contato" },
  { label: "Carrinho", to: "/carrinho" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Garantia Vitalicia" },
  { icon: Gem, label: "Prata 950 Certificada" },
  { icon: Award, label: "15+ Anos de Mercado" },
];

export const Footer = ({ homeContent }) => {
  const footer = homeContent?.footer || FOOTER_FALLBACK;
  const certificados =
    footer.certificados && footer.certificados.length > 0
      ? footer.certificados
      : FOOTER_FALLBACK.certificados;

  const [currentCert, setCurrentCert] = useState(0);

  useEffect(() => {
    if (certificados.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCert(prev => (prev + 1) % certificados.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [certificados.length]);

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 relative">
      
      {/* Faixa de destaque */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <badge.icon className="w-5 h-5 text-zinc-900" />
                <span className="text-zinc-900 font-bold text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Coluna 1 - Institucional */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Gem className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-white">Central Joias</h3>
                <span className="text-zinc-500 text-xs uppercase tracking-wider">Joalheria Artesanal</span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {footer.institucional || FOOTER_FALLBACK.institucional}
            </p>
            
            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-zinc-700 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rapidos */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-amber-500 rounded-full" />
              Links Rapidos
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.to} 
                    className="text-zinc-400 text-sm hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colunas 3 e 4 - Lojas */}
          {(footer.lojas || FOOTER_FALLBACK.lojas).map((loja, i) => (
            <div key={i}>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-500 rounded-full" />
                {loja.nome}
              </h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                    {loja.endereco}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-amber-400" />
                  </div>
                  <a href={loja.tel_link} className="text-zinc-400 text-sm hover:text-amber-400 transition-colors">
                    {loja.telefone}
                  </a>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">{loja.horario}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificados flutuantes */}
        {certificados.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 text-center flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Certificados e Premiacoes
            </h4>
            <div className="flex justify-center gap-4 overflow-x-auto pb-2">
              {certificados.map((src, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-24 h-24 bg-zinc-900 rounded-xl border-2 overflow-hidden transition-all duration-500 ${
                    index === currentCert 
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                      : 'border-zinc-800 opacity-50'
                  }`}
                >
                  <img src={src} alt={`Certificado ${index + 1}`} className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linha final */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-zinc-500 text-sm text-center md:text-left">
                {new Date().getFullYear()} Central Joias. Todos os direitos reservados.
              </p>
              <span className="hidden md:block w-1 h-1 bg-zinc-700 rounded-full" />
              <span className="text-zinc-600 text-sm">
                CNPJ: {footer.cnpj || FOOTER_FALLBACK.cnpj}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300 text-sm font-medium">
                {footer.selo_texto || FOOTER_FALLBACK.selo_texto}
              </span>
            </div>
          </div>

          {/* Creditos */}
          <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
            <p className="text-zinc-600 text-xs flex items-center justify-center gap-1">
              Feito com <Heart className="w-3 h-3 text-red-500 fill-red-500" /> em Goias
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

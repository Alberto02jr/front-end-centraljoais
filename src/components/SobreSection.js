'use client';

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Gem, MapPin, Truck, Clock, Award } from "lucide-react";

const DESTAQUES = [
  { icon: Clock, label: "+15 Anos", desc: "de experiencia" },
  { icon: MapPin, label: "2 Lojas", desc: "em Goias" },
  { icon: Truck, label: "Envios", desc: "todo Brasil" },
  { icon: Award, label: "Garantia", desc: "vitalicia" },
];

export const SobreSection = ({ homeContent }) => {
  // 1. Pegamos os dados com fallback para objeto vazio para nao quebrar o 'if (!sobre)'
  const sobre = homeContent?.sobre || {};

  // 2. Garantimos que textos e mensagens sejam SEMPRE arrays, mesmo que venham como string ou vazio
  const titulo = sobre?.titulo || "Nossa História";
  
  const mensagens = Array.isArray(sobre?.mensagens) 
    ? sobre.mensagens 
    : (sobre?.mensagens ? [sobre.mensagens] : ["Tradição e Qualidade"]);

  const textos = Array.isArray(sobre?.textos) 
    ? sobre.textos 
    : (sobre?.textos ? [sobre.textos] : ["Carregando nossa história..."]);

  const fotos = Array.isArray(sobre?.fotos) ? sobre.fotos : [];

  const [fotoAtual, setFotoAtual] = useState(0);
  const [msgAtual, setMsgAtual] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (fotos.length <= 1) return;
    const interval = setInterval(() => {
      setFotoAtual((prev) => (prev + 1) % fotos.length);
      if (mensagens.length > 0) {
        setMsgAtual((prev) => (prev + 1) % mensagens.length);
      }
    }, 4000); // Aumentei um pouco o tempo para leitura
    return () => clearInterval(interval);
  }, [fotos.length, mensagens.length]);

  const nextFoto = () => {
    if (fotos.length === 0) return;
    setFotoAtual((prev) => (prev + 1) % fotos.length);
    if (mensagens.length > 0) setMsgAtual((prev) => (prev + 1) % mensagens.length);
  };

  const prevFoto = () => {
    if (fotos.length === 0) return;
    setFotoAtual((prev) => (prev - 1 + fotos.length) % fotos.length);
    if (mensagens.length > 0) setMsgAtual((prev) => (prev - 1 + mensagens.length) % mensagens.length);
  };

  // Removi o 'if (!sobre) return null' para a seção sempre aparecer, mesmo com placeholders
  
  return (
    <section id="sobre" className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header da secao */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <Gem className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Tradição e Qualidade</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">{titulo}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full" />
        </div>

        {/* Destaques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {DESTAQUES.map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-amber-500/50 transition-all group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-500/20 transition-colors">
                <item.icon className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-white font-bold text-lg">{item.label}</p>
              <p className="text-zinc-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* VISUAL / GALERIA */}
          <div className="relative order-1 lg:order-2">
            {mensagens.length > 0 && (
              <div className="absolute -top-8 left-0 right-0 z-20">
                <div className="bg-zinc-900/90 backdrop-blur border border-amber-500/30 rounded-xl px-6 py-3 mx-auto w-fit shadow-lg shadow-amber-500/10">
                  <p className="text-amber-400 font-serif text-lg md:text-xl text-center">
                    {mensagens[msgAtual]}
                  </p>
                </div>
              </div>
            )}

            <div className="relative h-[400px] md:h-[480px] rounded-2xl overflow-hidden border-2 border-zinc-800 group bg-zinc-900">
              {fotos.length > 0 ? (
                <>
                  <img
                    src={fotos[fotoAtual]}
                    alt="Galeria"
                    onClick={() => setZoom(true)}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <button onClick={prevFoto} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-zinc-900/80 p-2 rounded-full text-white hover:bg-amber-500">
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button onClick={nextFoto} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-zinc-900/80 p-2 rounded-full text-white hover:bg-amber-500">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                   <Gem className="w-12 h-12 opacity-20" />
                </div>
              )}
            </div>
          </div>

          {/* TEXTO */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              {textos.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600/30 rounded-full" />
                  <p className="text-zinc-300 text-lg leading-relaxed">{p}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#catalogo" className="inline-flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition-all">
                <Gem className="w-5 h-5" /> Ver Catálogo
              </a>
              <a href="#contato" className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-700 transition-all">
                <MapPin className="w-5 h-5" /> Nossas Lojas
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM MODAL (Simplificado) */}
      {zoom && fotos.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <img src={fotos[fotoAtual]} className="max-w-full max-h-full rounded-lg" alt="Zoom" />
          <button className="absolute top-4 right-4 text-white"><X className="w-8 h-8" /></button>
        </div>
      )}
    </section>
  );
};

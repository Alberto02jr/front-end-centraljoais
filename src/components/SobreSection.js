'use client';

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Gem,
  MapPin,
  Truck,
  Clock,
  Award
} from "lucide-react";

const DESTAQUES = [
  { icon: Clock, label: "+15 Anos", desc: "de experiência" },
  { icon: MapPin, label: "2 Lojas", desc: "em Goiás" },
  { icon: Truck, label: "Envios", desc: "todo Brasil" },
  { icon: Award, label: "Garantia", desc: "vitalícia" },
];

export const SobreSection = ({ homeContent }) => {
  const sobre = homeContent?.sobre;

  // Se ainda não existe conteúdo vindo da API, não renderiza
  if (!sobre) return null;

  const titulo = sobre.titulo || "";
  const textos = sobre.textos ?? [];
  const mensagens = sobre.mensagens ?? [];
  const fotos = sobre.fotos ?? [];

  const [fotoAtual, setFotoAtual] = useState(0);
  const [msgAtual, setMsgAtual] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (fotos.length === 0 || mensagens.length === 0) return;

    const interval = setInterval(() => {
      setFotoAtual(prev => (prev + 1) % fotos.length);
      setMsgAtual(prev => (prev + 1) % mensagens.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [fotos.length, mensagens.length]);

  const nextFoto = () => {
    if (!fotos.length) return;
    setFotoAtual(prev => (prev + 1) % fotos.length);
    if (mensagens.length) {
      setMsgAtual(prev => (prev + 1) % mensagens.length);
    }
  };

  const prevFoto = () => {
    if (!fotos.length) return;
    setFotoAtual(prev => (prev - 1 + fotos.length) % fotos.length);
    if (mensagens.length) {
      setMsgAtual(prev => (prev - 1 + mensagens.length) % mensagens.length);
    }
  };

  return (
    <section id="sobre" className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        {titulo && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Gem className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">
                Tradição e Qualidade
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              {titulo}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full" />
          </div>
        )}

        {/* Destaques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {DESTAQUES.map((item, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-white font-bold text-lg">{item.label}</p>
              <p className="text-zinc-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* GALERIA */}
          {fotos.length > 0 && (
            <div className="relative order-1 lg:order-2">

              {/* Mensagem flutuante */}
              {mensagens.length > 0 && (
                <div className="absolute -top-8 left-0 right-0 z-20">
                  <div className="bg-zinc-900/90 backdrop-blur border border-amber-500/30 rounded-xl px-6 py-3 mx-auto w-fit">
                    <p className="text-amber-400 font-serif text-lg text-center">
                      {mensagens[msgAtual]}
                    </p>
                  </div>
                </div>
              )}

              <div className="relative h-[400px] md:h-[480px] rounded-2xl overflow-hidden border-2 border-zinc-800">
                <img
                  src={fotos[fotoAtual]}
                  alt=""
                  onClick={() => setZoom(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                />

                <button
                  onClick={prevFoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-900/80 border border-zinc-700 p-2.5 rounded-full text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextFoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900/80 border border-zinc-700 p-2.5 rounded-full text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* TEXTO */}
          {textos.length > 0 && (
            <div className="order-2 lg:order-1 space-y-6">
              {textos.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600/30 rounded-full" />
                  <p className="text-zinc-300 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ZOOM */}
      {zoom && fotos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setZoom(false)}
        >
          <img
            src={fotos[fotoAtual]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setZoom(false)}
            className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};

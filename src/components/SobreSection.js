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
  // ✅ HOOKS SEMPRE PRIMEIRO
  const [fotoAtual, setFotoAtual] = useState(0);
  const [msgAtual, setMsgAtual] = useState(0);
  const [zoom, setZoom] = useState(false);

  const sobre = homeContent?.sobre;
  const titulo = sobre?.titulo || "";
  const textos = sobre?.textos ?? [];
  const mensagens = sobre?.mensagens ?? [];
  const fotos = sobre?.fotos ?? [];

  useEffect(() => {
    if (!fotos.length || !mensagens.length) return;

    const interval = setInterval(() => {
      setFotoAtual((prev) => (prev + 1) % fotos.length);
      setMsgAtual((prev) => (prev + 1) % mensagens.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [fotos.length, mensagens.length]);

  // ✅ CONDIÇÃO SÓ DEPOIS DOS HOOKS
  if (!sobre) return null;

  const nextFoto = () => {
    if (!fotos.length) return;
    setFotoAtual((prev) => (prev + 1) % fotos.length);
    if (mensagens.length) {
      setMsgAtual((prev) => (prev + 1) % mensagens.length);
    }
  };

  const prevFoto = () => {
    if (!fotos.length) return;
    setFotoAtual((prev) => (prev - 1 + fotos.length) % fotos.length);
    if (mensagens.length) {
      setMsgAtual((prev) => (prev - 1 + mensagens.length) % mensagens.length);
    }
  };

  return (
    <section id="sobre" className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {fotos.length > 0 && (
            <div className="relative order-1 lg:order-2">
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

                <button onClick={prevFoto} className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-900/80 border border-zinc-700 p-2.5 rounded-full text-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button onClick={nextFoto} className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900/80 border border-zinc-700 p-2.5 rounded-full text-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {textos.length > 0 && (
            <div className="order-2 lg:order-1 space-y-6">
              {textos.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 bg-gradient-to-b from-amber-500 to-amber-600/30 rounded-full" />
                  <p className="text-zinc-300 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {zoom && fotos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setZoom(false)}
        >
          <img src={fotos[fotoAtual]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" />
          <button onClick={() => setZoom(false)} className="absolute top-4 right-4 bg-zinc-800 p-2 rounded-full text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};

'use client';

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Gem, MapPin, Truck, Clock, Award } from "lucide-react";

/* ===== BACKUP (CASO API / BANCO FALHE) ===== */
const SOBRE_PADRAO = {
  titulo: "Nossa Historia",
  mensagens: [
    "Mais de 15 anos no mercado",
    "Joias artesanais feitas a mao",
    "Referencia em Niqueiandia e Minacu",
    "Duas lojas fisicas em Goias",
    "Envios para todo o Brasil",
  ],
  textos: [
    "Ha mais de 15 anos, a Central Joias constroi sua historia com base em confianca, tradicao e excelencia, sendo referencia em sua cidade e regiao.",
    "Nossa trajetoria e heranca de uma tradicao familiar iniciada por nosso bisavo, conhecido como Senhor Inacio, nome respeitado pela honestidade e habilidade artesanal.",
    "Especialistas em joias artesanais feitas a mao, hoje contamos com duas lojas fisicas em Niqueiandia e Minacu - GO, alem de envios para todo o Brasil.",
  ],
  fotos: [
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/1.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/2.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/3.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/4.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/5.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/6.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/7.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1/centraljoias/8.jpg",
  ],
};

const DESTAQUES = [
  { icon: Clock, label: "+15 Anos", desc: "de experiencia" },
  { icon: MapPin, label: "2 Lojas", desc: "em Goias" },
  { icon: Truck, label: "Envios", desc: "todo Brasil" },
  { icon: Award, label: "Garantia", desc: "vitalicia" },
];

export const SobreSection = ({ homeContent }) => {
  const sobre = homeContent?.sobre || {};

  const titulo = sobre.titulo || SOBRE_PADRAO.titulo;
  const mensagens = sobre.mensagens?.length ? sobre.mensagens : SOBRE_PADRAO.mensagens;
  const textos = sobre.textos?.length ? sobre.textos : SOBRE_PADRAO.textos;
  const fotos = sobre.fotos?.length ? sobre.fotos : SOBRE_PADRAO.fotos;

  const [fotoAtual, setFotoAtual] = useState(0);
  const [msgAtual, setMsgAtual] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFotoAtual((prev) => (prev + 1) % fotos.length);
      setMsgAtual((prev) => (prev + 1) % mensagens.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [fotos.length, mensagens.length]);

  const nextFoto = () => {
    setFotoAtual((prev) => (prev + 1) % fotos.length);
    setMsgAtual((prev) => (prev + 1) % mensagens.length);
  };

  const prevFoto = () => {
    setFotoAtual((prev) => (prev - 1 + fotos.length) % fotos.length);
    setMsgAtual((prev) => (prev - 1 + mensagens.length) % mensagens.length);
  };

  return (
    <section id="sobre" className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header da secao */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <Gem className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Tradicao e Qualidade</span>
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
            
            {/* Mensagem flutuante */}
            <div className="absolute -top-8 left-0 right-0 z-20">
              <div className="bg-zinc-900/90 backdrop-blur border border-amber-500/30 rounded-xl px-6 py-3 mx-auto w-fit shadow-lg shadow-amber-500/10">
                <p className="text-amber-400 font-serif text-lg md:text-xl text-center">
                  {mensagens[msgAtual]}
                </p>
              </div>
            </div>

            {/* Container da imagem */}
            <div className="relative h-[400px] md:h-[480px] rounded-2xl overflow-hidden border-2 border-zinc-800 group">
              
              {/* Imagem principal */}
              <img
                src={fotos[fotoAtual]}
                alt="Historia Central Joias"
                onClick={() => setZoom(true)}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Navegacao */}
              <button
                onClick={prevFoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-zinc-900/80 backdrop-blur border border-zinc-700 p-2.5 rounded-full hover:bg-amber-500 hover:border-amber-500 hover:text-zinc-900 transition-all text-white shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextFoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-zinc-900/80 backdrop-blur border border-zinc-700 p-2.5 rounded-full hover:bg-amber-500 hover:border-amber-500 hover:text-zinc-900 transition-all text-white shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {fotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setFotoAtual(i); setMsgAtual(i % mensagens.length); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === fotoAtual 
                        ? 'bg-amber-500 w-6' 
                        : 'bg-zinc-600 hover:bg-zinc-500'
                    }`}
                  />
                ))}
              </div>

              {/* Contador */}
              <div className="absolute top-4 right-4 z-20 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-lg px-3 py-1.5">
                <span className="text-amber-400 font-mono text-sm font-bold">{fotoAtual + 1}</span>
                <span className="text-zinc-500 font-mono text-sm">/{fotos.length}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {fotos.slice(0, 6).map((foto, i) => (
                <button
                  key={i}
                  onClick={() => { setFotoAtual(i); setMsgAtual(i % mensagens.length); }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === fotoAtual 
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                      : 'border-zinc-700 hover:border-zinc-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={foto} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
              {fotos.length > 6 && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                  <span className="text-zinc-400 text-sm font-bold">+{fotos.length - 6}</span>
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
                  <p className={`leading-relaxed ${
                    i === 0 
                      ? "text-zinc-300 text-lg" 
                      : i === 1 
                        ? "text-zinc-400" 
                        : "text-zinc-500"
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a 
                href="#catalogo" 
                className="inline-flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
              >
                <Gem className="w-5 h-5" />
                Ver Catalogo
              </a>
              <a 
                href="#contato" 
                className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-700 hover:border-zinc-600 transition-all"
              >
                <MapPin className="w-5 h-5" />
                Nossas Lojas
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM MODAL */}
      {zoom && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setZoom(false)}
        >
          {/* Navegacao no zoom */}
          <button
            onClick={(e) => { e.stopPropagation(); prevFoto(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-800 border border-zinc-700 p-3 rounded-full hover:bg-amber-500 hover:border-amber-500 hover:text-zinc-900 transition-all text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextFoto(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-800 border border-zinc-700 p-3 rounded-full hover:bg-amber-500 hover:border-amber-500 hover:text-zinc-900 transition-all text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <img
            src={fotos[fotoAtual]}
            alt="Zoom"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Fechar */}
          <button
            className="absolute top-4 right-4 bg-zinc-800 border border-zinc-700 p-2.5 rounded-full hover:bg-red-500 hover:border-red-500 transition-all text-white"
            onClick={() => setZoom(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Contador no zoom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-lg px-4 py-2">
            <span className="text-amber-400 font-mono font-bold">{fotoAtual + 1}</span>
            <span className="text-zinc-500 font-mono"> / {fotos.length}</span>
          </div>
        </div>
      )}
    </section>
  );
};

import React from "react";
import { MapPin, Phone, Instagram, MessageCircle, Clock, Navigation, Gem, ExternalLink } from "lucide-react";

const CONTATO_FALLBACK = {
  titulo: "Contato",
  subtitulo: "Nossas lojas fisicas e atendimento direto",
  instagram_url:
    "https://www.instagram.com/centraljoiiasniq_minacu?igsh=YTNodWVuZmQ5OG9m&utm_source=qr",
  lojas: [
    {
      nome: "Loja Niqueiandia",
      destaque: "Matriz",
      titulo_card: "Central Joias - Niqueiandia / GO",
      endereco:
        "Avenida Brasil, n 77A\nBairro Centro - CEP 76420-000\nNiqueiandia - GO",
      whatsapp_url: "https://wa.me/556233541453",
      horario: "Seg a Sex: 8h as 18h",
    },
    {
      nome: "Loja Minacu",
      destaque: "Filial",
      titulo_card: "Central Joias - Minacu / GO",
      endereco:
        "Av. Maranhao, entre as Ruas 12 e 13\nCentro - N 1240\nCEP 76450-000 - Minacu / GO",
      whatsapp_url: "https://wa.me/556299647220",
      horario: "Seg a Sex: 8h as 18h",
    },
  ],
};

export const ContatoSection = ({ homeContent }) => {
  const contato = homeContent?.contato || CONTATO_FALLBACK;
  const lojas =
    contato.lojas && contato.lojas.length > 0
      ? contato.lojas
      : CONTATO_FALLBACK.lojas;

  return (
    <section id="contato" className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header da secao */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Fale Conosco</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            {contato.titulo || CONTATO_FALLBACK.titulo}
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            {contato.subtitulo || CONTATO_FALLBACK.subtitulo}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full mt-6" />
        </div>

        {/* Cards das lojas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {lojas.map((loja, i) => (
            <div
              key={i}
              className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 group"
            >
              {/* Header do card */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">{loja.destaque || "Loja"}</span>
                    <h3 className="font-serif text-xl text-white">{loja.nome}</h3>
                  </div>
                </div>
                <Gem className="w-8 h-8 text-white/30" />
              </div>

              {/* Conteudo do card */}
              <div className="p-6 space-y-5">
                
                {/* Titulo completo */}
                <h4 className="text-white font-medium text-lg">{loja.titulo_card}</h4>

                {/* Info items */}
                <div className="space-y-4">
                  {/* Endereco */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">Endereco</span>
                      <p className="text-zinc-300 text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                        {loja.endereco}
                      </p>
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">Horario</span>
                      <p className="text-zinc-300 text-sm">{loja.horario || "Seg a Sex: 8h as 18h"}</p>
                    </div>
                  </div>
                </div>

                {/* Botoes de acao */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                  <a
                    href={loja.whatsapp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold px-5 py-3.5 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href={contato.instagram_url || CONTATO_FALLBACK.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-bold px-5 py-3.5 rounded-xl hover:bg-zinc-700 hover:border-zinc-600 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900 rounded-2xl border border-zinc-800 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Instagram className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Siga nosso Instagram</h4>
                <p className="text-zinc-400 text-sm">Novidades, lancamentos e promocoes exclusivas</p>
              </div>
            </div>
            <a
              href={contato.instagram_url || CONTATO_FALLBACK.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
            >
              Seguir Agora
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

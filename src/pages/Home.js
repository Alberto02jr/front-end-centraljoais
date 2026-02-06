// Importação do React e Hooks
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Star, Diamond, Shield } from "lucide-react";

// Importação das seções
import { Hero } from "../components/Hero";
import { SobreSection } from "../components/SobreSection";
import { ContatoSection } from "../components/ContatoSection";
import { Header } from "../components/Header"; // Importe o Header
import { Footer } from "../components/Footer"; // Importe o Footer

const API = "https://central-joias-backend.up.railway.app/api";

export const Home = () => {
  const [homeContent, setHomeContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const res = await axios.get(`${API}/home-content`);
      // MongoDB retorna array, pegamos a primeira posição [0]
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setHomeContent(data);
    } catch (err) {
      console.error("ERRO AO BUSCAR DADOS:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* 1. HEADER - Recebendo homeContent para atualizar Logo e Slogan */}
      <Header homeContent={homeContent} />

      <main>
        {/* 2. HERO - Já estava funcionando */}
        <Hero homeContent={homeContent} />

        {/* SEÇÃO DE DIFERENCIAIS (ESTÁTICA) */}
        <section className="py-24 px-6 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { icon: <Diamond />, title: "Prata 950 Certificada", text: "Autenticidade e qualidade superior." },
              { icon: <Star />, title: "Tradição e Confiança", text: "Compromisso com cada cliente." },
              { icon: <Shield />, title: "Qualidade Artesanal", text: "Atenção aos mínimos detalhes." },
              { icon: <Star />, title: "Alianças Personalizadas", text: "Modelos exclusivos sob medida." },
              { icon: <ChevronRight />, title: "Gravação a Laser", text: "Personalização com precisão." },
              { icon: <Diamond />, title: "Moeda Antiga", text: "Trabalho especializado." },
            ].map((item, i) => (
              <div key={i} className="group bg-zinc-900/40 p-6 rounded-xl border border-white/5 hover:border-yellow-400/40 transition">
                <div className="w-9 h-9 text-yellow-400 mb-3">{item.icon}</div>
                <h3 className="font-serif text-xl text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SOBRE - Recebendo conteúdo do banco */}
        <SobreSection homeContent={homeContent} />

        {/* 4. CONTATO */}
        <ContatoSection homeContent={homeContent} />
      </main>

      {/* 5. FOOTER - Agora recebendo homeContent para atualizar endereços e institucional */}
      <Footer homeContent={homeContent} />
    </div>
  );
};
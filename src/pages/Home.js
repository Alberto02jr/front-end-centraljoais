// Importação do React
import React from "react";
// Importação de ícones da biblioteca lucide-react para os diferenciais
import { ChevronRight, Star, Diamond, Shield } from "lucide-react";

// Importação das seções que compõem a página inicial
import { Hero } from "../components/Hero";
import { SobreSection } from "../components/SobreSection";
import { ContatoSection } from "../components/ContatoSection";

// Recebe homeContent como prop do Layout (App.js) que já busca os dados do backend
export const Home = ({ homeContent }) => {

  return (
    <div className="min-h-screen" data-testid="home-page">

      {/* SEÇÃO HERO: Banner principal. Passa os dados do banco (homeContent) como propriedade */}
      <Hero homeContent={homeContent} />

      {/* SEÇÃO DE DIFERENCIAIS (FEATURES) */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Mapeamento de um Array de objetos para criar os cards de diferenciais automaticamente */}
          {[
            {
              icon: <Diamond />,
              title: "Prata 950 Certificada",
              text: "Autenticidade e qualidade superior.",
            },
            {
              icon: <Star />,
              title: "Tradição e Confiança",
              text: "Compromisso com cada cliente.",
            },
            {
              icon: <Shield />,
              title: "Qualidade Artesanal",
              text: "Atenção aos mínimos detalhes.",
            },
            {
              icon: <Star />,
              title: "Alianças Personalizadas",
              text: "Modelos exclusivos sob medida.",
            },
            {
              icon: <ChevronRight />,
              title: "Gravação a Laser",
              text: "Personalização com precisão.",
            },
            {
              icon: <Diamond />,
              title: "Moeda Antiga",
              text: "Trabalho especializado.",
            },
          ].map((item, i) => (
            /* Card individual de cada diferencial */
            <div
              key={i}
              className="group bg-black-card p-6 rounded-xl border border-white/5 hover:border-yellow-400/40 transition"
            >
              {/* Ícone com cor amarela/dourada */}
              <div className="w-9 h-9 text-yellow-400 mb-3">
                {item.icon}
              </div>
              {/* Título do diferencial com fonte Serifada (elegante) */}
              <h3 className="font-serif text-xl text-white mb-1">
                {item.title}
              </h3>
              {/* Descrição curta */}
              <p className="text-sm text-gray-400">
                {item.text}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* SEÇÃO SOBRE: Exibe textos sobre a empresa, também usando dados do banco */}
      <SobreSection homeContent={homeContent} />

      {/* SEÇÃO DE CONTATO: Formulário ou informações de endereço/rede social */}
      <ContatoSection homeContent={homeContent} />

    </div>
  );
};

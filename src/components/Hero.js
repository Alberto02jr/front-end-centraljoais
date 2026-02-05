import { Link } from "react-router-dom";
import { Gem, ShieldCheck, Award, Sparkles, ChevronDown } from "lucide-react";

/* ===== CONTEUDO INICIAL (EXIBIDO ATE VOCE CONFIGURAR NO ADMIN) ===== */
const CONTEUDO_INICIAL = {
  titulo: "Central Joias",
  texto: [
    "Na Central Joias, trabalhamos com prata certificada 950, assegurando autenticidade, qualidade e acabamento de alto padrao em cada peca.",
    "Atuamos com semijoias cuidadosamente selecionadas, todas com 1 ano de garantia, alem de realizarmos manutencao, solda e conserto de joias. Tambem confeccionamos e comercializamos aliancas, pecas exclusivas e moedas antigas.",
    "Nosso principal diferencial esta nas aliancas confeccionadas a partir de moeda antiga, que recebem forro interno em prata e aco inox. Essa combinacao garante maior durabilidade, reduz a oxidacao e oferece mais conforto para a pele.",
    "Produzimos ainda aliancas de ouro 750 (18k) sob encomenda e aliancas de prata personalizadas, unindo resistencia, elegancia e precos acessiveis."
  ],
  frase_impacto: "Onde o luxo e a elegancia se encontram",
  cta_texto: "Conheca nosso catalogo",
  cta_link: "/catalogo",
};

const BADGES = [
  { icon: ShieldCheck, label: "Garantia Vitalicia" },
  { icon: Award, label: "Prata 950" },
  { icon: Sparkles, label: "Feito a Mao" },
];

export const Hero = ({ homeContent }) => {
  const hero = homeContent?.hero;

  const textos =
    hero?.texto && hero.texto.length > 0
      ? hero.texto
      : CONTEUDO_INICIAL.texto;

  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 pt-28 pb-16 relative overflow-hidden">
      
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Linhas decorativas */}
      <div className="absolute top-32 left-8 w-px h-32 bg-gradient-to-b from-amber-500/50 to-transparent hidden lg:block" />
      <div className="absolute top-32 right-8 w-px h-32 bg-gradient-to-b from-amber-500/50 to-transparent hidden lg:block" />

      <div className="max-w-5xl text-center relative z-10">

        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-5 py-2.5 mb-8">
          <Gem className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-medium tracking-wide">Joalheria Artesanal</span>
        </div>

        {/* TITULO */}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white tracking-wide mb-6">
          <span className="block">{(hero?.titulo || CONTEUDO_INICIAL.titulo).split(' ')[0]}</span>
          <span className="text-amber-400">{(hero?.titulo || CONTEUDO_INICIAL.titulo).split(' ').slice(1).join(' ')}</span>
        </h1>

        {/* Linha decorativa */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
          <Gem className="w-5 h-5 text-amber-500" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>

        {/* TEXTO PRINCIPAL */}
        <div className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 space-y-4 max-w-3xl mx-auto">
          {textos.slice(0, 2).map((p, i) => (
            <p key={i} className={i === 0 ? "text-zinc-300" : ""}>{p}</p>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {BADGES.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
              <badge.icon className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300 text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* FRASE DE IMPACTO */}
        <div className="relative mb-12">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-amber-400 leading-relaxed">
            "{hero?.frase_impacto || CONTEUDO_INICIAL.frase_impacto}"
          </p>
        </div>

        {/* BOTOES CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={hero?.cta_link || CONTEUDO_INICIAL.cta_link}
            className="inline-flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            <Gem className="w-5 h-5" />
            {hero?.cta_texto || CONTEUDO_INICIAL.cta_texto}
          </Link>
          <a
  href="#sobre"
  className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm hover:bg-zinc-800 hover:border-zinc-600 transition-all"
>
  Saiba Mais
</a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-600 text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

      </div>
    </section>
  );
};

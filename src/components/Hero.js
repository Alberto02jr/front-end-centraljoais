import { Link } from "react-router-dom";
import { Gem, ShieldCheck, Award, Sparkles, ChevronDown } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "Garantia Vitalícia" },
  { icon: Award, label: "Prata 950" },
  { icon: Sparkles, label: "Feito à Mão" },
];

export const Hero = ({ homeContent }) => {
  const hero = homeContent?.hero;

  // Se não existir hero ainda, não renderiza
  if (!hero) return null;

  const textos = hero.texto ?? [];

  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 pt-28 pb-16 relative overflow-hidden">

      {/* IMAGEM DO HERO (se existir) */}
      {hero.imagem && (
        <img
          src={hero.imagem}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950 pointer-events-none" />

      <div className="max-w-5xl text-center relative z-10">

        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-5 py-2.5 mb-8">
          <Gem className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-medium tracking-wide">
            Joalheria Artesanal
          </span>
        </div>

        {/* TITULO */}
        {hero.titulo && (
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white tracking-wide mb-6">
            <span className="block">
              {hero.titulo.split(" ")[0]}
            </span>
            <span className="text-amber-400">
              {hero.titulo.split(" ").slice(1).join(" ")}
            </span>
          </h1>
        )}

        {/* TEXTO */}
        {textos.length > 0 && (
          <div className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 space-y-4 max-w-3xl mx-auto">
            {textos.slice(0, 2).map((p, i) => (
              <p key={i} className={i === 0 ? "text-zinc-300" : ""}>
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {BADGES.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2"
            >
              <badge.icon className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300 text-sm font-medium">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* FRASE DE IMPACTO */}
        {hero.frase_impacto && (
          <div className="mb-12">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-amber-400">
              "{hero.frase_impacto}"
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {hero.cta_texto && hero.cta_link && (
            <Link
              to={hero.cta_link}
              className="inline-flex items-center gap-2 bg-amber-500 text-zinc-900 font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <Gem className="w-5 h-5" />
              {hero.cta_texto}
            </Link>
          )}

          <a
            href="#sobre"
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm hover:bg-zinc-800 hover:border-zinc-600 transition-all"
          >
            Saiba Mais
          </a>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-600 text-xs uppercase tracking-widest">
              Scroll
            </span>
            <ChevronDown className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

      </div>
    </section>
  );
};

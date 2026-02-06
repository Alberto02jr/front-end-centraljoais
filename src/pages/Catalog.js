'use client';

import { useEffect, useRef, useState, useMemo } from "react"
import { 
  ChevronLeft, ChevronRight, X, Search, ShieldCheck, CreditCard, 
  Truck, Star, Heart, SlidersHorizontal, Package, Award, 
  Sparkles, ChevronDown, Clock, Gem, Scale, Ruler, 
  Palette, Info, Check, Minus, Plus, Share2, ZoomIn, Crown
} from "lucide-react"
import { useCart } from "../context/CartContext"

// --- ADICIONE ESTAS DUAS LINHAS ABAIXO ---
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
// -----------------------------------------

const API = "https://central-joias-backend.up.railway.app/api";

const CAROUSELS = [
  { slug: "aliancas-prata-950", title: "Aliancas de Prata 950", icon: "ring" },
  { slug: "aliancas-moeda-antiga", title: "Aliancas de Moeda Antiga", icon: "coin" },
  { slug: "aneis-prata-950", title: "Aneis de Prata 950", icon: "gem" },
  { slug: "correntes-pulseiras-prata-950", title: "Correntes e Pulseiras", icon: "chain" },
  { slug: "semi-joias", title: "Semi Joias", icon: "sparkle" },
  { slug: "brincos-variedades-prata-950", title: "Brincos e Variedades", icon: "earring" },
  { slug: "relogios", title: "Relogios", icon: "watch" },
]

const PRICE_RANGES = [
  { label: "Todos os precos", min: 0, max: Infinity },
  { label: "Ate R$ 100", min: 0, max: 100 },
  { label: "R$ 100 - R$ 300", min: 100, max: 300 },
  { label: "R$ 300 - R$ 500", min: 300, max: 500 },
  { label: "R$ 500 - R$ 1.000", min: 500, max: 1000 },
  { label: "Acima de R$ 1.000", min: 1000, max: Infinity },
]

const SPEC_ICONS = {
  material: Gem,
  peso: Scale,
  tamanho: Ruler,
  cor: Palette,
  garantia: ShieldCheck,
  parcelamento: CreditCard,
  default: Info
}

export const Catalog = () => {
  const { addToCart } = useCart()
  const scrollRefs = useRef({})

  const [products, setProducts] = useState([])
  const [activeProduct, setActiveProduct] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("specs")
  const [quantity, setQuantity] = useState(1)
  const [imageZoom, setImageZoom] = useState(false)

  // ... (mantenha todos os seus useEffects e useMemos aqui embaixo)

  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data =>
        setProducts(Array.isArray(data) ? data.filter((p) => p.active) : [])
      )
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    if (activeProduct) {
      setActiveImageIndex(0)
      setQuantity(1)
      setActiveTab("specs")
    }
  }, [activeProduct])

  const hasPromo = (p) => {
    if (!p || !p.promo_active) return false;
    const price = parseFloat(p.price);
    const promo = parseFloat(p.promo_price);
    return !isNaN(promo) && promo < price;
  };

  const getDiscount = (p) => {
    if (!hasPromo(p)) return 0;
    const price = parseFloat(p.price);
    const promo = parseFloat(p.promo_price);
    return Math.round(((price - promo) / price) * 100);
  };

  const searchResults = useMemo(() => {
    if (!searchTerm && selectedCategory === "all" && selectedPriceRange === 0) return []
    
    return products.filter(p => {
      // Filtro de texto
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const text = `${p.name || ""} ${p.category || ""} ${Object.values(p.specifications || {}).join(" ")}`.toLowerCase()
        if (!text.includes(term)) return false
      }
      
      // Filtro de categoria
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false
      
      // Filtro de preco
      const range = PRICE_RANGES[selectedPriceRange]
      const price = hasPromo(p) ? parseFloat(p.promo_price) : parseFloat(p.price)
      if (price < range.min || price > range.max) return false
      
      return true
    })
  }, [searchTerm, products, selectedCategory, selectedPriceRange])

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  function scroll(slug, dir) {
    scrollRefs.current[slug]?.scrollBy({
      left: dir * 320,
      behavior: "smooth",
    })
  }

  const fPrice = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? "0,00" : num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getSpecIcon = (key) => {
    const normalizedKey = key.toLowerCase()
    for (const [specKey, Icon] of Object.entries(SPEC_ICONS)) {
      if (normalizedKey.includes(specKey)) return Icon
    }
    return SPEC_ICONS.default
  }

 return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER NO TOPO DE TUDO */}
      <Header />

      {/* CONTEÚDO DO CATÁLOGO */}
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 lg:px-16 bg-background text-foreground relative">
        
        {/* Linha decorativa no topo (Z-index aumentado para 60) */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark z-[60]" />

        {/* BOTAO BUSCA FLUTUANTE (Top ajustado para 28 para não cobrir o Header) */}
        <button
          onClick={() => setSearchOpen(true)}
          className="fixed top-28 right-4 md:right-8 z-40 bg-card border border-gold/30 p-3.5 rounded-full hover:bg-gold hover:border-gold transition-all duration-300 shadow-lg hover:shadow-gold/25 group"
          aria-label="Buscar produtos"
        ></button>
          <Search className="w-5 h-5 text-gold group-hover:text-background transition-colors" />

      {/* MODAL DE BUSCA */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/97 backdrop-blur-md flex items-start justify-center pt-20 md:pt-28 px-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOpen(false)
              setSearchTerm("")
              setSelectedCategory("all")
              setSelectedPriceRange(0)
            }
          }}
        >
          <div className="bg-card w-full max-w-4xl rounded-2xl border border-gold/20 shadow-2xl shadow-gold/5 overflow-hidden animate-in slide-in-from-top-4 duration-300">
            {/* Header da Busca */}
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
                  <input
                    autoFocus
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome, material, categoria..."
                    className="w-full bg-secondary border border-border rounded-xl text-lg pl-12 pr-4 py-4 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-muted-foreground text-foreground"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-4 rounded-xl border transition-all ${showFilters ? 'bg-gold text-background border-gold' : 'bg-secondary border-border hover:border-gold/50 text-foreground'}`}
                  aria-label="Filtros"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedPriceRange(0)
                  }}
                  className="p-4 rounded-xl bg-secondary border border-border hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive transition-all text-foreground"
                  aria-label="Fechar busca"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filtros Expandiveis */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Categoria */}
                  <div>
                    <label className="text-xs font-semibold text-gold uppercase tracking-wider mb-2 block">Categoria</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 outline-none focus:border-gold appearance-none cursor-pointer text-foreground"
                      >
                        <option value="all">Todas as categorias</option>
                        {CAROUSELS.map(c => (
                          <option key={c.slug} value={c.slug}>{c.title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Faixa de Preco */}
                  <div>
                    <label className="text-xs font-semibold text-gold uppercase tracking-wider mb-2 block">Faixa de Preco</label>
                    <div className="relative">
                      <select
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 outline-none focus:border-gold appearance-none cursor-pointer text-foreground"
                      >
                        {PRICE_RANGES.map((range, i) => (
                          <option key={i} value={i}>{range.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="max-h-[55vh] overflow-y-auto">
              {(searchTerm || selectedCategory !== "all" || selectedPriceRange !== 0) && (
                <div className="p-4 border-b border-border bg-secondary/50">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-gold">{searchResults.length}</span> produto(s) encontrado(s)
                  </p>
                </div>
              )}

              {searchResults.length > 0 ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProduct(p)
                        setSearchOpen(false)
                        setSearchTerm("")
                        setSelectedCategory("all")
                        setSelectedPriceRange(0)
                      }}
                      className="flex gap-4 items-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary cursor-pointer border border-transparent hover:border-gold/30 transition-all group"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gold/10">
                        <img
                          src={p.images?.[0] || "/placeholder.jpg"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          alt={p.name}
                          crossOrigin="anonymous"
                        />
                        {hasPromo(p) && (
                          <div className="absolute top-1 left-1 bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                            -{getDiscount(p)}%
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base truncate group-hover:text-gold transition-colors text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{p.category?.replace(/-/g, ' ')}</p>
                        <div className="mt-2">
                          {hasPromo(p) ? (
                            <div className="flex items-center gap-2">
                              <span className="line-through text-muted-foreground text-xs">R$ {fPrice(p.price)}</span>
                              <span className="text-destructive font-bold">R$ {fPrice(p.promo_price)}</span>
                            </div>
                          ) : (
                            <span className="text-gold font-bold">R$ {fPrice(p.price)}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (searchTerm || selectedCategory !== "all" || selectedPriceRange !== 0) ? (
                <div className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum produto encontrado</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Tente ajustar os filtros ou buscar por outros termos</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Sparkles className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Digite algo para buscar</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">ou use os filtros para explorar nosso catalogo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HERO / TITULO DO CATALOGO */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
          <Crown className="w-6 h-6 text-gold" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight text-balance">
          Nosso <span className="text-gold">Catalogo</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto leading-relaxed">
          Pecas exclusivas em prata 950, moeda antiga e semi joias
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/40" />
          <Gem className="w-4 h-4 text-gold/60" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </div>

      {/* CARROSSEIS */}
      {CAROUSELS.map(c => {
        const list = products.filter(p => p.category === c.slug)
        if (!list.length) return null

        return (
          <section key={c.slug} className="mb-20">
            {/* Header da Categoria */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-gradient-to-b from-gold to-gold-dark rounded-full" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground tracking-tight">
                    {c.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {list.length} {list.length === 1 ? 'peca disponivel' : 'pecas disponiveis'}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll(c.slug, -1)}
                  className="p-2.5 rounded-full bg-card border border-border hover:border-gold/50 hover:bg-gold/10 transition-all text-muted-foreground hover:text-gold"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll(c.slug, 1)}
                  className="p-2.5 rounded-full bg-card border border-border hover:border-gold/50 hover:bg-gold/10 transition-all text-muted-foreground hover:text-gold"
                  aria-label="Proximo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative group">
              {/* Botao Esquerda - mobile */}
              <button
                onClick={() => scroll(c.slug, -1)}
                className="md:hidden absolute -left-1 top-1/2 -translate-y-1/2 z-10 bg-card border border-gold/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-background shadow-lg text-gold"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Grid de Produtos */}
              <div
                ref={el => { scrollRefs.current[c.slug] = el }}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 -mx-2 px-2"
              >
                {list.map(p => (
                  <div
                    key={p.id}
                    className="min-w-[280px] max-w-[280px] bg-card rounded-2xl overflow-hidden border border-border hover:border-gold/40 transition-all duration-500 flex flex-col group/card hover:shadow-2xl hover:shadow-gold/8 hover:-translate-y-1"
                    onMouseEnter={() => setHoveredProduct(p.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Imagem do Produto */}
                    <div className="relative h-72 overflow-hidden bg-secondary">
                      <img
                        src={
                          hoveredProduct === p.id && p.images?.[1] 
                            ? p.images[1] 
                            : p.images?.[0] || "/placeholder.jpg"
                        }
                        className="w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110"
                        alt={p.name}
                        crossOrigin="anonymous"
                      />
                      
                      {/* Overlay sutil na base */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveProduct(p)
                            }}
                            className="
flex-1 bg-amber-500  text-zinc-900  py-3  rounded-xl  font-bold  text-sm  hover:bg-amber-400 transition-all  shadow-xl  shadow-amber-500/40  backdrop-blur  flex  items-center justify-center  gap-2 
"
                          >
                            <Gem className="w-4 h-4" />
                            Ver Detalhes
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(p.id)
                            }}
                            className={`p-3 rounded-xl border-2 transition-all shadow-lg ${
                              favorites.includes(p.id) 
                                ? 'bg-destructive border-destructive text-destructive-foreground shadow-destructive/30' 
                                : 'bg-card/90 border-gold/30 text-gold hover:bg-destructive hover:border-destructive hover:text-destructive-foreground'
                            }`}
                            aria-label={favorites.includes(p.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(p.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Badge de Promocao */}
                      {hasPromo(p) && (
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-destructive/30 flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive-foreground"></span>
                          </span>
                          -{getDiscount(p)}% OFF
                        </div>
                      )}

                      {/* Favorito visivel no card */}
                      {favorites.includes(p.id) && (
                        <div className="absolute top-3 right-3">
                          <Heart className="w-5 h-5 text-destructive fill-destructive drop-shadow-md" />
                        </div>
                      )}
                    </div>

                    {/* Conteudo do Card */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-gold/70 font-medium uppercase tracking-widest mb-1.5">
                        {c.title}
                      </p>
                      <h3 className="font-serif text-lg mb-3 line-clamp-2 leading-snug text-foreground group-hover/card:text-gold transition-colors duration-300">
                        {p.name}
                      </h3>

                      {/* Precos */}
                      <div className="mb-4">
                        {hasPromo(p) ? (
                          <div className="space-y-1">
                            <span className="line-through text-muted-foreground text-sm block">R$ {fPrice(p.price)}</span>
                            <span className="text-destructive text-2xl font-bold block">R$ {fPrice(p.promo_price)}</span>
                          </div>
                        ) : (
                          <span className="text-gold text-2xl font-bold block">R$ {fPrice(p.price)}</span>
                        )}
                      </div>

                      {/* Trust Badges */}
                      <div className="mt-auto pt-4 border-t border-border space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-xs font-medium text-foreground/80">
                            {p.specifications?.parcelamento || "Ate 10x sem juros"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                          </div>
                          <span className="text-xs font-medium text-foreground/80">
                            {p.specifications?.garantia || "Garantia Vitalicia"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botao Direita - mobile */}
              <button
                onClick={() => scroll(c.slug, 1)}
                className="md:hidden absolute -right-1 top-1/2 -translate-y-1/2 z-10 bg-card border border-gold/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-background shadow-lg text-gold"
                aria-label="Proximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )
      })}

      {/* MODAL DE PRODUTO DETALHADO */}
      {activeProduct && (
        <div 
          className="fixed inset-0 z-[100] bg-background/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setActiveProduct(null)}
        >
          <div className="bg-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gold/20 shadow-2xl shadow-gold/5 animate-in zoom-in-95 duration-300">
            
            {/* Header Fixo */}
            <div className="sticky top-0 z-20 bg-card/98 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-gold" />
                <span className="text-sm text-foreground/70 font-medium">Detalhes do Produto</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: activeProduct.name, url: window.location.href })
                    }
                  }}
                  className="p-2 rounded-lg bg-secondary border border-border hover:border-gold/40 hover:text-gold transition-colors text-muted-foreground"
                  aria-label="Compartilhar"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleFavorite(activeProduct.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    favorites.includes(activeProduct.id) 
                      ? 'bg-destructive/15 border-destructive/40 text-destructive' 
                      : 'bg-secondary border-border hover:border-gold/40 hover:text-gold text-muted-foreground'
                  }`}
                  aria-label="Favoritar"
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(activeProduct.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="p-2 rounded-lg bg-secondary border border-border hover:bg-destructive/15 hover:border-destructive/40 hover:text-destructive transition-colors text-muted-foreground"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Galeria de Imagens */}
              <div className="space-y-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border cursor-zoom-in group"
                  onClick={() => setImageZoom(true)}
                >
                  <img
                    src={activeProduct.images?.[activeImageIndex] || "/placeholder.jpg"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={activeProduct.name}
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                  
                  {hasPromo(activeProduct) && (
                    <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive-foreground"></span>
                      </span>
                      {getDiscount(activeProduct)}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {activeProduct.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {activeProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImageIndex 
                            ? 'border-gold shadow-lg shadow-gold/20' 
                            : 'border-border hover:border-gold/40'
                        }`}
                      >
                        <img src={img || "/placeholder.svg"} className="w-full h-full object-cover" alt="" crossOrigin="anonymous" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informacoes do Produto */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gold font-semibold mb-1.5 capitalize tracking-widest uppercase">
                    {activeProduct.category?.replace(/-/g, ' ')}
                  </p>
                  <h2 className="font-serif text-xl text-foreground leading-tight">
                    {activeProduct.name}
                  </h2>
                </div>

                {/* Badges de Confianca */}
                <div className="flex flex-wrap gap-1.5">
                  {hasPromo(activeProduct) && (
                    <span className="bg-destructive/15 text-destructive text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-destructive/25 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> OFERTA LIMITADA
                    </span>
                  )}
                  <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-emerald-800/40 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> 10X S/ JUROS
                  </span>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> GARANTIA
                  </span>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> FRETE GRATIS
                  </span>
                </div>

                {/* Bloco de Preco */}
                <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                  {hasPromo(activeProduct) ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-zinc-500 text-sm">R$ {fPrice(activeProduct.price)}</span>
                        <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{getDiscount(activeProduct)}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-400">R$ {fPrice(activeProduct.promo_price)}</span>
                      </div>
                      <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> a vista no PIX ou Cartao
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-amber-400">R$ {fPrice(activeProduct.price)}</span>
                      </div>
                      <p className="text-zinc-400 text-xs">
                        ou em ate <span className="text-white font-semibold">10x de R$ {fPrice(parseFloat(activeProduct.price) / 10)}</span> sem juros
                      </p>
                    </div>
                  )}
                </div>

                {/* Quantidade e Adicionar */}
                <div className="flex gap-3">
                  <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-zinc-700 transition-colors text-zinc-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-semibold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 hover:bg-zinc-700 transition-colors text-zinc-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        addToCart(activeProduct)
                      }
                      setActiveProduct(null)
                    }}
                    className="flex-1 bg-amber-500 text-zinc-900 font-bold rounded-lg py-3 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </button>
                </div>

                {/* Tabs de Informacoes */}
                <div className="border-t border-zinc-700 pt-4">
                  <div className="flex gap-1 bg-zinc-800 p-1 rounded-lg mb-4">
                    {[
                      { id: 'specs', label: 'Specs', icon: Info },
                      { id: 'shipping', label: 'Envio', icon: Truck },
                      { id: 'warranty', label: 'Garantia', icon: ShieldCheck },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                          activeTab === tab.id 
                            ? 'bg-zinc-700 text-white shadow-sm' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Conteudo das Tabs */}
                  {activeTab === 'specs' && activeProduct.specifications && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {Object.entries(activeProduct.specifications).map(([key, value]) => {
                        const IconComponent = getSpecIcon(key)
                        return (
                          <div 
                            key={key} 
                            className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
                                <IconComponent className="w-4 h-4 text-amber-400" />
                              </div>
                              <span className="text-zinc-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                            </div>
                            <span className="font-semibold text-white text-sm">{value}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-emerald-400 text-sm">Frete Gratis</span>
                        </div>
                        <p className="text-xs text-zinc-400">Para todo o Brasil em compras acima de R$ 199</p>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-white text-sm">Prazo de Entrega</span>
                        </div>
                        <p className="text-xs text-zinc-400">Receba em ate 7 dias uteis apos confirmacao</p>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-white text-sm">Embalagem Premium</span>
                        </div>
                        <p className="text-xs text-zinc-400">Joias enviadas em embalagem de presente</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'warranty' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-amber-400 text-sm">Garantia Vitalicia</span>
                        </div>
                        <p className="text-xs text-zinc-400">Garantia vitalicia contra defeitos de fabricacao</p>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-white text-sm">Certificado de Autenticidade</span>
                        </div>
                        <p className="text-xs text-zinc-400">Certificado de qualidade do material incluso</p>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-white text-sm">Satisfacao Garantida</span>
                        </div>
                        <p className="text-xs text-zinc-400">Devolucao gratis em ate 30 dias</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Zoom da Imagem */}
      {imageZoom && activeProduct && (
        <div 
          className="fixed inset-0 z-[110] bg-background/98 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setImageZoom(false)}
        >
          <button
            type="button"
            onClick={() => setImageZoom(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-card border border-border"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={activeProduct.images?.[activeImageIndex] || "/placeholder.jpg"}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            alt="Zoom"
          />

          {/* Paginação das Imagens (Dots) */}
          {activeProduct?.images?.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-card/90 backdrop-blur p-2 rounded-full border border-border">
              {activeProduct.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeImageIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Ir para imagem ${idx + 1}`}
                />
              ))}
            </div>
          )}
        {/* Aqui fecha a div do card ou container do activeProduct */}
        </div> 
      )} 

    </main>

    <Footer />

  </div>
  ); // Fecha o return
}; // Fecha o componente
'use client';

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Plus, Trash2, Edit, Package, Tag, Loader2, Upload, Ruler, X, Percent, ShieldCheck, CreditCard,
  Search, Eye, ChevronRight, ImageIcon, Sparkles, Box
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API = "https://central-joias-backend.up.railway.app/api";

const CATEGORIES = [
  { slug: "aliancas-prata-950", nome: "Alianças de Prata 950" },
  { slug: "aliancas-moeda-antiga", nome: "Alianças de Moeda Antiga" },
  { slug: "aneis-prata-950", nome: "Anéis de Prata 950" },
  { slug: "correntes-pulseiras-prata-950", nome: "Correntes e Pulseiras de Prata 950" },
  { slug: "semi-joias", nome: "Semi Joias" },
  { slug: "brincos-variedades-prata-950", nome: "Brincos e Variedades de Prata 950" },
  { slug: "relogios", nome: "Relógios" },
];

const CATEGORY_FIELDS = {
  "aliancas-prata-950": ["modelo", "material", "peso", "largura", "espessura"],
  "aliancas-moeda-antiga": ["modelo", "material", "largura", "espessura"],
  "aneis-prata-950": ["modelo", "material", "peso", "largura", "espessura"],
  "correntes-pulseiras-prata-950": ["modelo", "material", "peso", "largura", "espessura", "comprimento"],
  "semi-joias": ["modelo", "material", "largura", "espessura", "numeracao", "comprimento"],
  "brincos-variedades-prata-950": ["modelo", "material", "largura", "espessura", "numeracao", "comprimento"],
  "relogios": ["marca", "modelo", "tipo", "movimento"],
};

const emptyProduct = {
  name: "",
  category: "",
  price: "",
  promo_active: false,
  promo_price: "",
  active: true,
  images: [],
  specifications: {
    garantia: "Garantia Vitalícia",
    parcelamento: "Até 10x sem juros"
  },
};

/* ─── inline styles ─── */
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(165deg, #09090b 0%, #0c0c10 40%, #0f0f14 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#fafafa',
    padding: '0',
    margin: '0',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(9,9,11,0.80)',
    borderBottom: '1px solid rgba(212,175,55,0.10)',
  },
  topBarInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #d4af37 0%, #b8941e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(212,175,55,0.25)',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    color: '#fafafa',
  },
  logoSub: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#71717a',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  statsRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  statChip: {
    padding: '6px 14px',
    borderRadius: '100px',
    background: 'rgba(39,39,42,0.6)',
    border: '1px solid rgba(63,63,70,0.5)',
    fontSize: '12px',
    fontWeight: 600,
    color: '#a1a1aa',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },
  statValue: {
    color: '#fafafa',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #d4af37 0%, #c9a22e 100%)',
    color: '#09090b',
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(212,175,55,0.30), inset 0 1px 0 rgba(255,255,255,0.2)',
    transition: 'all 0.2s ease',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px 80px',
  },
  catSection: {
    marginBottom: '48px',
  },
  catHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  catIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(212,175,55,0.10)',
    border: '1px solid rgba(212,175,55,0.20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#fafafa',
    letterSpacing: '-0.3px',
  },
  catCount: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#71717a',
    marginLeft: '4px',
  },
  grid: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '16px',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
  },
  productCard: {
    minWidth: '220px',
    maxWidth: '220px',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#18181b',
    border: '1px solid #27272a',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    scrollSnapAlign: 'start',
    position: 'relative',
  },
  productCardHover: {
    borderColor: 'rgba(212,175,55,0.40)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40), 0 0 0 1px rgba(212,175,55,0.15)',
    transform: 'translateY(-2px)',
  },
  cardImgWrap: {
    position: 'relative',
    height: '180px',
    background: '#0f0f12',
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.3) 50%, transparent 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '14px',
    gap: '8px',
    opacity: 0,
    transition: 'opacity 0.25s ease',
  },
  cardOverlayVisible: {
    opacity: 1,
  },
  overlayBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0',
  },
  overlayBtnSpec: {
    background: 'rgba(250,250,250,0.10)',
    backdropFilter: 'blur(8px)',
    color: '#fafafa',
  },
  overlayBtnEdit: {
    background: '#d4af37',
    color: '#09090b',
    boxShadow: '0 4px 12px rgba(212,175,55,0.35)',
  },
  overlayBtnDel: {
    background: 'rgba(239,68,68,0.85)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(239,68,68,0.30)',
  },
  cardBody: {
    padding: '14px 16px 16px',
  },
  cardName: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#e4e4e7',
    letterSpacing: '0.2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  cardPriceRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '8px',
  },
  priceOriginal: {
    fontSize: '11px',
    color: '#52525b',
    textDecoration: 'line-through',
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    fontWeight: 500,
    lineHeight: 1,
  },
  pricePromo: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#34d399',
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    lineHeight: 1,
  },
  priceNormal: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#d4af37',
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    lineHeight: 1,
  },
  promoBadge: {
    padding: '3px 8px',
    borderRadius: '6px',
    background: 'rgba(52,211,153,0.12)',
    border: '1px solid rgba(52,211,153,0.25)',
    color: '#34d399',
    fontSize: '9px',
    fontWeight: 800,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  /* ─── Dialog / Modal ─── */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 50,
  },
  modalScroll: {
    maxHeight: '88vh',
    overflowY: 'auto',
    padding: '28px',
  },
  sectionBlock: {
    borderRadius: '14px',
    background: '#18181b',
    border: '1px solid #27272a',
    padding: '20px',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: '#71717a',
    marginBottom: '16px',
  },
  sectionLabelGold: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: '#d4af37',
    marginBottom: '16px',
  },
  fieldLabel: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: '#71717a',
    marginBottom: '6px',
    display: 'block',
  },
  fieldInput: {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    borderRadius: '10px',
    border: '1.5px solid #27272a',
    background: '#0f0f12',
    color: '#fafafa',
    fontSize: '14px',
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  priceInput: {
    width: '100%',
    height: '52px',
    padding: '0 14px 0 44px',
    borderRadius: '10px',
    border: '1.5px solid #27272a',
    background: '#0f0f12',
    color: '#fafafa',
    fontSize: '20px',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  pricePrefix: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    fontWeight: 800,
    color: '#d4af37',
  },
  promoActiveBox: {
    borderRadius: '12px',
    background: 'rgba(52,211,153,0.06)',
    border: '1.5px solid rgba(52,211,153,0.25)',
    padding: '16px',
  },
  promoLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  promoTag: {
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#34d399',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  removeBtn: {
    padding: '4px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(239,68,68,0.3)',
    background: 'rgba(239,68,68,0.10)',
    color: '#ef4444',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activatePromoBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    height: '52px',
    borderRadius: '10px',
    border: '1.5px dashed rgba(212,175,55,0.40)',
    background: 'rgba(212,175,55,0.05)',
    color: '#d4af37',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  uploadArea: {
    width: '100%',
    borderRadius: '12px',
    border: '2px dashed #27272a',
    background: 'rgba(15,15,18,0.5)',
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    gap: '8px',
  },
  uploadLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  uploadHint: {
    fontSize: '11px',
    color: '#3f3f46',
    fontWeight: 500,
  },
  previewBox: {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid #d4af37',
    flexShrink: 0,
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewDel: {
    position: 'absolute',
    top: '-1px',
    right: '-1px',
    width: '24px',
    height: '24px',
    borderRadius: '0 10px 0 8px',
    background: '#ef4444',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  saveBtn: {
    width: '100%',
    height: '56px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #d4af37 0%, #c9a22e 100%)',
    color: '#09090b',
    fontSize: '15px',
    fontWeight: 800,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(212,175,55,0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  /* ─── Spec Modal ─── */
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #1e1e22',
  },
  specKey: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  specVal: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e4e4e7',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'rgba(39,39,42,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  scrollbarHide: `
    .scroll-hide::-webkit-scrollbar { display: none; }
    .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .focus-gold:focus { border-color: #d4af37 !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.12) !important; }
    .hover-gold:hover { border-color: rgba(212,175,55,0.40) !important; background: rgba(212,175,55,0.04) !important; }
  `,
};

export function ProductsManager({ token }) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [specProduct, setSpecProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Erro ao carregar produtos.");
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const updateSpec = (key, value) => {
    setProduct(prev => ({
      ...prev,
      specifications: { ...prev?.specifications, [key]: value }
    }));
  };

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" }
      });
      setProduct(prev => ({ ...prev, images: [res.data.url] }));
      toast.success("Imagem carregada!");
    } catch {
      toast.error("Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProduct() {
    if (!product.name || !product.category || !product.price) {
      return toast.error("Preencha nome, categoria e preço!");
    }
    setSaving(true);
    try {
      const payload = {
        ...product,
        price: parseFloat(product.price) || 0,
        promo_price: product.promo_active ? parseFloat(product.promo_price) : null,
      };
      if (product.id) {
        await axios.put(`${API}/products/${product.id}`, payload, { headers });
      } else {
        await axios.post(`${API}/products`, payload, { headers });
      }
      setDialogOpen(false);
      loadProducts();
      toast.success("Salvo com sucesso!");
    } catch {
      toast.error("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Tem certeza que deseja excluir esta joia?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      toast.success("Produto removido!");
      loadProducts();
    } catch {
      toast.error("Erro ao deletar.");
    }
  }

  const grouped = products.reduce((acc, p) => {
    acc[p.category] = [...(acc[p.category] || []), p];
    return acc;
  }, {});

  const totalProducts = products.length;
  const promoCount = products.filter(p => p.promo_active).length;

  return (
    <div style={styles.page}>
      <style>{styles.scrollbarHide}</style>

      {/* ─── TOP BAR ─── */}
      <div style={styles.topBar}>
        <div style={styles.topBarInner}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>
              <Package size={20} color="#09090b" strokeWidth={2.5} />
            </div>
            <div>
              <div style={styles.logoText}>Inventario</div>
              <div style={styles.logoSub}>Gerenciamento de Produtos</div>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statChip}>
              <Box size={13} />
              <span style={styles.statValue}>{totalProducts}</span> produtos
            </div>
            {promoCount > 0 && (
              <div style={{...styles.statChip, borderColor: 'rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.06)'}}>
                <Sparkles size={13} color="#34d399" />
                <span style={{...styles.statValue, color: '#34d399'}}>{promoCount}</span> 
                <span style={{color: '#34d399'}}>em oferta</span>
              </div>
            )}
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button style={styles.addBtn} onClick={() => setProduct(emptyProduct)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(212,175,55,0.40), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = styles.addBtn.boxShadow; }}
              >
                <Plus size={16} strokeWidth={3} /> Novo Produto
              </button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-2xl p-0 border-none bg-transparent shadow-none outline-none [&>button]:hidden max-h-[90vh] overflow-hidden" style={{ background: 'none' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#111113', border: '1px solid #27272a', boxShadow: '0 24px 80px rgba(0,0,0,0.60)' }}>
                {/* Modal Header */}
                <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e1e22', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4af37, #b8941e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {product?.id ? <Edit size={16} color="#09090b" strokeWidth={2.5} /> : <Plus size={16} color="#09090b" strokeWidth={2.5} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#fafafa' }}>
                        {product?.id ? "Editar Produto" : "Novo Produto"}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>
                        Preencha os dados abaixo
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDialogOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #27272a', background: '#18181b', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#fafafa'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#71717a'; }}
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Modal Body */}
                <div style={styles.modalScroll}>
                  {product && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                      {/* Nome + Categoria */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={styles.fieldLabel}>Nome da Peca</label>
                          <input
                            className="focus-gold"
                            style={styles.fieldInput}
                            value={product.name}
                            onChange={e => setProduct(prev => ({...prev, name: e.target.value}))}
                            placeholder="Ex: Alianca Diamantada"
                          />
                        </div>
                        <div>
                          <label style={styles.fieldLabel}>Categoria</label>
                          <Select
                            value={product.category}
                            onValueChange={val => setProduct(prev => ({
                              ...prev,
                              category: val,
                              specifications: { ...prev.specifications }
                            }))}
                          >
                            <SelectTrigger className="h-[44px] rounded-[10px] border-[1.5px] border-[#27272a] bg-[#0f0f12] text-[#fafafa] text-sm font-medium focus:border-[#d4af37] focus:ring-0 focus:ring-offset-0">
                              <SelectValue placeholder="Escolha a categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#18181b] border-[#27272a] rounded-[12px]">
                              {CATEGORIES.map(c => (
                                <SelectItem key={c.slug} value={c.slug} className="text-[#e4e4e7] focus:bg-[#d4af37] focus:text-[#09090b] font-semibold py-3 rounded-lg">
                                  {c.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Precos */}
                      <div style={styles.sectionBlock}>
                        <div style={styles.sectionLabelGold}>
                          <CreditCard size={13} /> Precificacao
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={styles.fieldLabel}>Preco Normal</label>
                            <div style={{ position: 'relative' }}>
                              <span style={styles.pricePrefix}>R$</span>
                              <input
                                type="number"
                                className="focus-gold"
                                style={styles.priceInput}
                                placeholder="0,00"
                                value={product.price}
                                onChange={e => setProduct(prev => ({...prev, price: e.target.value}))}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={styles.fieldLabel}>Promocao</label>
                            {!product.promo_active ? (
                              <button
                                type="button"
                                style={styles.activatePromoBtn}
                                onClick={() => setProduct(prev => ({ ...prev, promo_active: true }))}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.60)'; e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.40)'; e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; }}
                              >
                                <Percent size={14} /> Ativar Promocao
                              </button>
                            ) : (
                              <div style={styles.promoActiveBox}>
                                <div style={styles.promoLabel}>
                                  <span style={styles.promoTag}>
                                    <Sparkles size={12} /> Promo Ativa
                                  </span>
                                  <button
                                    style={styles.removeBtn}
                                    onClick={() => setProduct(prev => ({ ...prev, promo_active: false, promo_price: "" }))}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.20)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; }}
                                  >
                                    Remover
                                  </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                  <span style={{...styles.pricePrefix, color: '#34d399'}}>R$</span>
                                  <input
                                    type="number"
                                    className="focus-gold"
                                    style={{...styles.priceInput, borderColor: 'rgba(52,211,153,0.3)'}}
                                    placeholder="0,00"
                                    value={product.promo_price}
                                    onChange={e => setProduct(prev => ({ ...prev, promo_price: e.target.value }))}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Garantia e Parcelamento */}
                      <div style={styles.sectionBlock}>
                        <div style={styles.sectionLabelGold}>
                          <ShieldCheck size={13} /> Condicoes de Venda
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={styles.fieldLabel}>Garantia</label>
                            <input
                              className="focus-gold"
                              style={styles.fieldInput}
                              placeholder="Ex: Vitalicia"
                              value={product.specifications?.garantia || ""}
                              onChange={e => updateSpec("garantia", e.target.value)}
                            />
                          </div>
                          <div>
                            <label style={styles.fieldLabel}>Parcelamento</label>
                            <input
                              className="focus-gold"
                              style={styles.fieldInput}
                              placeholder="Ex: 10x sem juros"
                              value={product.specifications?.parcelamento || ""}
                              onChange={e => updateSpec("parcelamento", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detalhes Tecnicos */}
                      {product.category && (
                        <div style={styles.sectionBlock}>
                          <div style={styles.sectionLabel}>
                            <Ruler size={13} /> Detalhes Tecnicos
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            {CATEGORY_FIELDS[product.category]?.map(field => (
                              <div key={field}>
                                <label style={styles.fieldLabel}>{field}</label>
                                <input
                                  className="focus-gold"
                                  style={{...styles.fieldInput, height: '40px', fontSize: '13px'}}
                                  value={product.specifications?.[field] || ""}
                                  onChange={e => updateSpec(field, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Imagem */}
                      <div>
                        <label style={{...styles.fieldLabel, marginBottom: '12px'}}>Imagem do Produto</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <label
                            className="hover-gold"
                            style={styles.uploadArea}
                          >
                            {uploading ? (
                              <Loader2 size={28} color="#d4af37" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <ImageIcon size={28} color="#3f3f46" />
                            )}
                            <span style={styles.uploadLabel}>
                              {uploading ? 'Enviando...' : 'Enviar Foto'}
                            </span>
                            <span style={styles.uploadHint}>JPG, PNG ou WEBP</span>
                            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleUpload} disabled={uploading} />
                          </label>
                          {product.images?.[0] && (
                            <div style={styles.previewBox}>
                              <img src={product.images[0] || "/placeholder.svg"} style={styles.previewImg} alt="Preview" />
                              <button
                                onClick={() => setProduct(prev => ({...prev, images: []}))}
                                style={styles.previewDel}
                                onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; }}
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Salvar */}
                      <button
                        onClick={saveProduct}
                        disabled={saving || uploading}
                        style={{
                          ...styles.saveBtn,
                          opacity: (saving || uploading) ? 0.6 : 1,
                          cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => { if (!saving && !uploading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.40), inset 0 1px 0 rgba(255,255,255,0.15)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = styles.saveBtn.boxShadow; }}
                      >
                        {saving ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Salvar no Estoque'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={styles.content}>
        {Object.keys(grouped).length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Package size={28} color="#3f3f46" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#52525b', marginBottom: '4px' }}>
              Nenhum produto cadastrado
            </div>
            <div style={{ fontSize: '13px', color: '#3f3f46' }}>
              Clique em "Novo Produto" para comecar
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([catSlug, items]) => (
          <div key={catSlug} style={styles.catSection}>
            <div style={styles.catHeader}>
              <div style={styles.catIcon}>
                <Tag size={16} color="#d4af37" />
              </div>
              <span style={styles.catTitle}>
                {CATEGORIES.find(c => c.slug === catSlug)?.nome || catSlug}
              </span>
              <span style={styles.catCount}>({items.length})</span>
            </div>

            <div className="scroll-hide" style={styles.grid}>
              {items.map(p => (
                <div
                  key={p.id}
                  style={{
                    ...styles.productCard,
                    ...(hoveredCard === p.id ? styles.productCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={styles.cardImgWrap}>
                    <img
                      src={p.images?.[0] || "/placeholder.svg"}
                      style={{
                        ...styles.cardImg,
                        transform: hoveredCard === p.id ? 'scale(1.08)' : 'scale(1)',
                      }}
                      alt={p.name}
                    />
                    <div style={{
                      ...styles.cardOverlay,
                      ...(hoveredCard === p.id ? styles.cardOverlayVisible : {}),
                    }}>
                      <button style={{...styles.overlayBtn, ...styles.overlayBtnSpec}} onClick={() => setSpecProduct(p)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,250,250,0.20)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,250,250,0.10)'; }}
                      >
                        <Ruler size={15} />
                      </button>
                      <button style={{...styles.overlayBtn, ...styles.overlayBtnEdit}} onClick={() => { setProduct(p); setDialogOpen(true); }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Edit size={15} />
                      </button>
                      <button style={{...styles.overlayBtn, ...styles.overlayBtnDel}} onClick={() => deleteProduct(p.id)}
                        onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.85)'; }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {p.promo_active && (
                      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        <span style={styles.promoBadge}>Oferta</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.cardName}>{p.name}</div>
                    <div style={styles.cardPriceRow}>
                      <div>
                        {p.promo_active ? (
                          <>
                            <div style={styles.priceOriginal}>R$ {Number(p.price).toFixed(2)}</div>
                            <div style={styles.pricePromo}>R$ {Number(p.promo_price).toFixed(2)}</div>
                          </>
                        ) : (
                          <div style={styles.priceNormal}>R$ {Number(p.price).toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── MODAL DE ESPECIFICACOES ─── */}
      <Dialog open={!!specProduct} onOpenChange={() => setSpecProduct(null)}>
        <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none outline-none [&>button]:hidden max-h-[90vh] overflow-hidden" style={{ background: 'none' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#111113', border: '1px solid #27272a', boxShadow: '0 24px 80px rgba(0,0,0,0.60)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e22', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ruler size={16} color="#d4af37" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fafafa' }}>Especificacoes</div>
                <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>Detalhes tecnicos do produto</div>
              </div>
            </div>
            {specProduct && (
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#d4af37', marginBottom: '16px' }}>{specProduct.name}</div>
                <div style={{ borderRadius: '12px', background: '#18181b', border: '1px solid #27272a', padding: '4px 16px' }}>
                  {specProduct.specifications && Object.keys(specProduct.specifications).length > 0 ? (
                    Object.entries(specProduct.specifications).map(([key, value], i, arr) => (
                      <div key={key} style={{...styles.specRow, borderBottom: i === arr.length - 1 ? 'none' : styles.specRow.borderBottom}}>
                        <span style={styles.specKey}>{key}</span>
                        <span style={styles.specVal}>{value}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#52525b', fontStyle: 'italic' }}>Nenhuma especificacao cadastrada</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Spin keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

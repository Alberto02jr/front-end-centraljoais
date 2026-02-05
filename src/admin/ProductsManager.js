'use client';

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Plus, Trash2, Edit, Package, Tag, Loader2, Upload, Ruler, X, Percent, ShieldCheck, CreditCard
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

const API = process.env.REACT_APP_API_URL


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

// Modificado para já iniciar com os campos novos
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

export function ProductsManager({ token }) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [specProduct, setSpecProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-zinc-950 min-h-screen font-sans">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Package className="text-amber-500" /> Painel de Inventário
        </h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setProduct(emptyProduct)} className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase">
              <Plus className="w-5 h-5 mr-2" /> Novo Produto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-zinc-900">
            <div className="bg-zinc-900 m-2 rounded-lg shadow-2xl overflow-hidden border-t-4 border-amber-500">
              <div className="p-6 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                    {product?.id ? "Editar Joia" : "Cadastrar Nova Joia"}
                  </DialogTitle>
                </DialogHeader>

                {product && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-bold uppercase text-xs">Nome da Peca</Label>
                        <Input 
                          className="bg-zinc-800 border-2 border-zinc-700 text-white focus:border-amber-500 h-10 font-medium"
                          value={product.name} 
                          onChange={e => setProduct(prev => ({...prev, name: e.target.value}))} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-bold uppercase text-xs">Categoria</Label>
                        <Select 
                          value={product.category} 
                          onValueChange={val => setProduct(prev => ({
                            ...prev, 
                            category: val, 
                            specifications: { 
                              ...prev.specifications
                            }
                          }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-2 border-zinc-700 text-white h-10">
                            <SelectValue placeholder="Escolha a categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-2 border-amber-500">
                            {CATEGORIES.map(c => (
                              <SelectItem key={c.slug} value={c.slug} className="text-white focus:bg-amber-500 focus:text-black font-bold py-3 border-b border-zinc-800 last:border-0">
                                {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-zinc-800 shadow-2xl border-l-4 border-amber-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-zinc-400 font-bold text-[10px] uppercase">Preco Normal (R$)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-amber-500 font-bold">R$</span>
                            <Input 
                              type="number" 
                              className="bg-zinc-900 border-zinc-700 text-white font-mono text-xl focus:border-amber-500 h-12 pl-10"
                              placeholder="0,00"
                              value={product.price} 
                              onChange={e => setProduct(prev => ({...prev, price: e.target.value}))} 
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          {!product.promo_active ? (
                            <Button
                              type="button"
                              onClick={() => setProduct(prev => ({ ...prev, promo_active: true }))}
                              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-black uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                              <Percent className="w-5 h-5" /> Ativar Promocao
                            </Button>
                          ) : (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-emerald-400 font-black uppercase text-xs tracking-widest">Promocao Ativa</span>
                                <Button
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={() => setProduct(prev => ({ ...prev, promo_active: false, promo_price: "" }))}
                                >
                                  Remover
                                </Button>
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-emerald-400 font-black">R$</span>
                                <Input
                                  type="number"
                                  placeholder="Valor promocional"
                                  className="h-14 pl-10 text-xl font-mono bg-zinc-900 border-emerald-500 text-white"
                                  value={product.promo_price}
                                  onChange={e => setProduct(prev => ({ ...prev, promo_price: e.target.value }))}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* --- Garantia e Parcelamento --- */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex items-center gap-2 text-amber-400 font-black text-xs uppercase">
                        <ShieldCheck className="w-4 h-4" /> Condicoes de Venda
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black text-zinc-400 uppercase">Garantia</Label>
                        <Input 
                          placeholder="Ex: Vitalicia"
                          className="h-9 bg-zinc-800 border-zinc-700 text-white focus:border-amber-500"
                          value={product.specifications?.garantia || ""}
                          onChange={e => updateSpec("garantia", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black text-zinc-400 uppercase">Parcelamento</Label>
                        <Input 
                          placeholder="Ex: 10x sem juros"
                          className="h-9 bg-zinc-800 border-zinc-700 text-white focus:border-amber-500"
                          value={product.specifications?.parcelamento || ""}
                          onChange={e => updateSpec("parcelamento", e.target.value)}
                        />
                      </div>
                    </div>

                    {product.category && (
                      <div className="p-4 rounded-lg bg-zinc-800 border-2 border-zinc-700 grid grid-cols-2 gap-4">
                        <div className="col-span-2 flex items-center gap-2 text-zinc-400 font-black text-xs uppercase">
                          <Ruler className="w-4 h-4" /> Detalhes Tecnicos
                        </div>
                        {CATEGORY_FIELDS[product.category]?.map(field => (
                          <div key={field} className="space-y-1">
                            <Label className="text-[10px] font-black text-zinc-500 uppercase">{field}</Label>
                            <Input 
                              className="h-9 bg-zinc-900 border-zinc-700 text-white focus:border-amber-500"
                              value={product.specifications?.[field] || ""}
                              onChange={e => updateSpec(field, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2 border-t border-zinc-700 pt-4">
                      <Label className="text-zinc-300 font-bold text-xs uppercase">Imagem da Joia</Label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 border-2 border-dashed border-zinc-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-500/10 transition-all bg-zinc-800 group">
                          {uploading ? <Loader2 className="animate-spin text-amber-500" /> : <Upload className="w-8 h-8 text-zinc-500 group-hover:text-amber-500 mb-2" />}
                          <span className="text-xs font-black text-zinc-400 group-hover:text-amber-400 uppercase">Enviar Foto</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                        {product.images?.[0] && (
                          <div className="relative h-28 w-28 rounded-lg border-2 border-amber-500 p-1 bg-zinc-800 shadow-xl">
                            <img src={product.images[0]} className="w-full h-full object-cover rounded shadow-md" alt="Preview" />
                            <button onClick={() => setProduct(prev => ({...prev, images: []}))} className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={saveProduct} 
                      disabled={saving || uploading} 
                      className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-black text-xl shadow-xl shadow-amber-500/20 uppercase border-b-4 border-amber-600"
                    >
                      {saving ? <Loader2 className="animate-spin h-6 w-6" /> : "Salvar no Estoque"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-12 pb-20">
        {Object.entries(grouped).map(([catSlug, items]) => (
          <div key={catSlug} className="space-y-4">
            <h2 className="text-xl font-black text-white border-b-4 border-amber-500 inline-block pr-8 pb-1 flex items-center gap-2 uppercase tracking-tighter">
              <Tag className="text-amber-500 w-5 h-5" />
              {CATEGORIES.find(c => c.slug === catSlug)?.nome || catSlug}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide pt-2">
              {items.map(p => (
                <Card key={p.id} className="min-w-[210px] max-w-[210px] overflow-hidden group border-2 border-zinc-800 hover:border-amber-500/50 transition-all shadow-md bg-zinc-900">
                  <div className="relative h-44 bg-zinc-800">
                    <img src={p.images?.[0] || "/placeholder.svg"} className="h-full w-full object-cover" alt={p.name} />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                      <Button size="icon" className="rounded-full bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600" onClick={() => setSpecProduct(p)}>
                        <Ruler className="w-4 h-4" />
                      </Button>
                      <Button size="icon" className="bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-full shadow-lg shadow-amber-500/20" onClick={() => { setProduct(p); setDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" className="rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" onClick={() => deleteProduct(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-900">
                    <p className="text-[11px] font-bold text-white truncate uppercase">{p.name}</p>
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col">
                          {p.promo_active ? (
                            <>
                              <span className="text-[10px] text-zinc-500 line-through font-mono">R$ {Number(p.price).toFixed(2)}</span>
                              <span className="text-sm font-black text-emerald-400 font-mono">R$ {Number(p.promo_price).toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-black text-amber-400 font-mono">R$ {Number(p.price).toFixed(2)}</span>
                          )}
                        </div>
                        {p.promo_active && <Badge className="bg-emerald-500 text-[9px] h-4 border-none text-white">OFERTA</Badge>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE ESPECIFICACOES */}
      <Dialog open={!!specProduct} onOpenChange={() => setSpecProduct(null)}>
        <DialogContent className="max-w-md bg-zinc-900 border border-zinc-700">
          <DialogHeader>
            <DialogTitle className="font-black uppercase text-white flex items-center gap-2">
              <Ruler className="w-5 h-5 text-amber-500" /> Especificacoes
            </DialogTitle>
          </DialogHeader>
          {specProduct && (
            <div className="space-y-4">
              <p className="font-bold text-amber-400">{specProduct.name}</p>
              <div className="border border-zinc-700 rounded-lg p-3 bg-zinc-800 space-y-1">
                {specProduct.specifications && Object.keys(specProduct.specifications).length > 0 ? (
                  Object.entries(specProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs border-b border-zinc-700 last:border-0 py-2">
                      <span className="font-bold uppercase text-zinc-400">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-zinc-500">Nenhuma especificacao cadastrada</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

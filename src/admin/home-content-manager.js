import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Save, Upload, Store, FileText, Phone, MapPin, Clock, Award, Gem, Instagram, Plus, X, Loader2, ImageIcon, Sparkles, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const API = process.env.REACT_APP_API_URL

// Componente de secao colapsavel
function Section({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
      </button>
      {open && <div className="p-5 pt-0 space-y-4 border-t border-zinc-800">{children}</div>}
    </section>
  )
}

// Componente de input estilizado
function StyledInput({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{label}</Label>
      <Input 
        className="bg-zinc-800 border-zinc-700 text-white focus:border-amber-500 h-11" 
        {...props} 
      />
    </div>
  )
}

function StyledTextarea({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{label}</Label>
      <Textarea 
        className="bg-zinc-800 border-zinc-700 text-white focus:border-amber-500 min-h-[100px]" 
        {...props} 
      />
    </div>
  )
}

export function HomeContentManager({ token }) {
  const [home, setHome] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Memoize headers
  const authHeader = React.useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token])

  const loadHome = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/home-content`)
      const data = res.data || {}

      setHome({
        branding: {
          nome_loja: data.branding?.nome_loja || "",
          slogan: data.branding?.slogan || "",
          logo_url: data.branding?.logo_url || "",
        },
        hero: {
          titulo: data.hero?.titulo || "",
          // CORREÇÃO: Lê 'subtitulo' ou 'texto' para compatibilidade
          texto: Array.isArray(data.hero?.subtitulo) ? data.hero.subtitulo.join("\n\n") : (data.hero?.subtitulo || ""),
          frase_impacto: data.hero?.frase_impacto || "",
          // CORREÇÃO: Mapeia botao_texto
          cta_texto: data.hero?.botao_texto || "",
          cta_link: data.hero?.cta_link || "",
          // CORREÇÃO: Mapeia background_url
          imagem: data.hero?.background_url || "",
        },
        sobre: {
          titulo: data.sobre?.titulo || "",
          textos: Array.isArray(data.sobre?.textos) ? data.sobre.textos.join("\n\n") : "",
          mensagens: Array.isArray(data.sobre?.mensagens) ? data.sobre.mensagens.join("\n") : "",
          fotos: data.sobre?.fotos || [],
        },
        contato: data.contato || { titulo: "", subtitulo: "", instagram_url: "", lojas: [] },
        footer: data.footer || { institucional: "", cnpj: "", selo_texto: "", lojas: [], certificados: [] },
      })
    } catch (err) {
      console.error("Erro ao carregar API:", err)
      setHome({
        branding: { nome_loja: "", slogan: "", logo_url: "" },
        hero: { titulo: "", texto: "", frase_impacto: "", cta_texto: "", cta_link: "", imagem: "" },
        sobre: { titulo: "", textos: "", mensagens: "", fotos: [] },
        contato: { titulo: "", subtitulo: "", instagram_url: "", lojas: [] },
        footer: { institucional: "", cnpj: "", selo_texto: "", lojas: [], certificados: [] }
      })
    }
  }, [])

  useEffect(() => {
    loadHome()
  }, [loadHome])

  async function uploadImage(file) {
    const form = new FormData()
    form.append("file", file)
    const res = await axios.post(`${API}/upload`, form, authHeader)
    return res.data.url
  }

  async function uploadAndSet(file, callback) {
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file)
      callback(url)
    } catch {
      toast.error("Erro ao enviar imagem")
    } finally {
      setUploading(false)
    }
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    await uploadAndSet(file, url => {
      setHome(p => ({
        ...p,
        branding: { ...p.branding, logo_url: url },
      }))
    })
    e.target.value = ""
  }

  async function handleHeroImageChange(e) {
    const file = e.target.files?.[0]
    await uploadAndSet(file, url => {
      setHome(p => ({
        ...p,
        hero: { ...p.hero, imagem: url },
      }))
    })
    e.target.value = ""
  }

  function addContatoLoja() {
    setHome(p => ({
      ...p,
      contato: {
        ...p.contato,
        lojas: [...(p.contato.lojas || []), {
          nome: "",
          destaque: "",
          titulo_card: "",
          endereco: "",
          whatsapp_url: "",
          horario: "Seg a Sex: 8h as 18h"
        }]
      }
    }))
  }

  function updateContatoLoja(index, field, value) {
    setHome(p => ({
      ...p,
      contato: {
        ...p.contato,
        lojas: p.contato.lojas.map((loja, i) => 
          i === index ? { ...loja, [field]: value } : loja
        )
      }
    }))
  }

  function removeContatoLoja(index) {
    setHome(p => ({
      ...p,
      contato: {
        ...p.contato,
        lojas: p.contato.lojas.filter((_, i) => i !== index)
      }
    }))
  }

  function addFooterLoja() {
    setHome(p => ({
      ...p,
      footer: {
        ...p.footer,
        lojas: [...(p.footer.lojas || []), {
          nome: "",
          endereco: "",
          telefone: "",
          tel_link: "",
          horario: "Segunda a Sexta: 8h as 18h"
        }]
      }
    }))
  }

  function updateFooterLoja(index, field, value) {
    setHome(p => ({
      ...p,
      footer: {
        ...p.footer,
        lojas: (p.footer.lojas || []).map((loja, i) => 
          i === index ? { ...loja, [field]: value } : loja
        )
      }
    }))
  }

  function removeFooterLoja(index) {
    setHome(p => ({
      ...p,
      footer: {
        ...p.footer,
        lojas: p.footer.lojas.filter((_, i) => i !== index)
      }
    }))
  }

  async function saveHome() {
    try {
      setSaving(true)

      // AQUI ESTÁ O AJUSTE DE CHAVES PARA O SITE RECONHECER
      const payload = {
        slug: "home",
        branding: home.branding,
        hero: {
          titulo: home.hero.titulo,
          subtitulo: home.hero.texto, // Mapeado de 'texto' para 'subtitulo'
          frase_impacto: home.hero.frase_impacto,
          botao_texto: home.hero.cta_texto, // Mapeado de 'cta_texto' para 'botao_texto'
          cta_link: home.hero.cta_link,
          background_url: home.hero.imagem, // Mapeado de 'imagem' para 'background_url'
        },
        sobre: {
          ...home.sobre,
          textos: home.sobre.textos
            .split("\n")
            .map(t => t.trim())
            .filter(Boolean),
          mensagens: home.sobre.mensagens
            .split("\n")
            .map(t => t.trim())
            .filter(Boolean),
        },
        contato: home.contato,
        footer: home.footer,
      }

      await axios.put(`${API}/home-content`, payload, authHeader)
      toast.success("Página principal atualizada com sucesso")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao salvar conteúdo")
    } finally {
      setSaving(false)
    }
  }

  if (!home) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen bg-zinc-950">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-zinc-950 min-h-screen">
      
      {/* Header da pagina */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Gerenciar Página Inicial</h1>
            <p className="text-zinc-500 text-sm">Edite o conteúdo da sua home page</p>
          </div>
        </div>
        <Button 
          onClick={saveHome} 
          disabled={saving || uploading}
          className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold px-6 shadow-lg shadow-amber-500/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Tudo
        </Button>
      </div>

      {/* BRANDING */}
      <Section icon={Store} title="Branding da Loja">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Nome da Loja"
            value={home.branding.nome_loja}
            onChange={e => setHome(p => ({ ...p, branding: { ...p.branding, nome_loja: e.target.value } }))}
            placeholder="Central Joias"
          />
          <StyledInput
            label="Slogan"
            value={home.branding.slogan}
            onChange={e => setHome(p => ({ ...p, branding: { ...p.branding, slogan: e.target.value } }))}
            placeholder="Joias & Relojoaria"
          />
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          {home.branding.logo_url && (
            <div className="relative">
              <img src={home.branding.logo_url} className="h-20 bg-zinc-800 p-2 rounded-xl border border-zinc-700" alt="Logo" />
              <button
                onClick={() => setHome(p => ({ ...p, branding: { ...p.branding, logo_url: "" } }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <label className="flex-1 border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
            {uploading ? <Loader2 className="w-6 h-6 text-amber-500 animate-spin" /> : <Upload className="w-6 h-6 text-zinc-500 group-hover:text-amber-500" />}
            <span className="text-xs text-zinc-500 group-hover:text-amber-400 mt-2 font-bold uppercase">Enviar Logo</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} disabled={uploading} />
          </label>
        </div>
      </Section>

      {/* HERO */}
      <Section icon={Sparkles} title="Hero - Seção Principal">
        <StyledInput
          label="Título Principal"
          value={home.hero.titulo}
          onChange={e => setHome(p => ({ ...p, hero: { ...p.hero, titulo: e.target.value } }))}
          placeholder="Central Joias"
        />
        
        <StyledTextarea
          label="Subtítulo/Texto (aparece abaixo do título)"
          rows={6}
          value={home.hero.texto}
          onChange={e => setHome(p => ({ ...p, hero: { ...p.hero, texto: e.target.value } }))}
          placeholder="Na Central Joias, trabalhamos com prata certificada 950..."
        />

        <StyledInput
          label="Frase de Impacto"
          value={home.hero.frase_impacto}
          onChange={e => setHome(p => ({ ...p, hero: { ...p.hero, frase_impacto: e.target.value } }))}
          placeholder="Onde o luxo e a elegância se encontram"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Texto do Botão CTA"
            value={home.hero.cta_texto}
            onChange={e => setHome(p => ({ ...p, hero: { ...p.hero, cta_texto: e.target.value } }))}
            placeholder="Conheça nosso catálogo"
          />
          <StyledInput
            label="Link do Botão CTA"
            value={home.hero.cta_link}
            onChange={e => setHome(p => ({ ...p, hero: { ...p.hero, cta_link: e.target.value } }))}
            placeholder="/catalogo"
          />
        </div>

        <div className="flex items-center gap-4 mt-2">
          {home.hero.imagem && (
            <div className="relative">
              <img src={home.hero.imagem} className="w-40 h-24 object-cover rounded-xl border border-zinc-700" alt="Hero" />
              <button
                onClick={() => setHome(p => ({ ...p, hero: { ...p.hero, imagem: "" } }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <label className="flex-1 border-2 border-dashed border-zinc-700 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
            {uploading ? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" /> : <ImageIcon className="w-5 h-5 text-zinc-500 group-hover:text-amber-500" />}
            <span className="text-xs text-zinc-500 group-hover:text-amber-400 font-bold uppercase">Imagem do Banner (Background)</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageChange} disabled={uploading} />
          </label>
        </div>
      </Section>

      {/* SOBRE */}
      <Section icon={Gem} title="Seção Sobre">
        <StyledInput
          label="Título"
          value={home.sobre.titulo}
          onChange={e => setHome(p => ({ ...p, sobre: { ...p.sobre, titulo: e.target.value } }))}
          placeholder="Nossa História"
        />

        <StyledTextarea
          label="Textos (separe parágrafos com linha em branco)"
          rows={5}
          value={home.sobre.textos}
          onChange={e => setHome(p => ({ ...p, sobre: { ...p.sobre, textos: e.target.value } }))}
        />

        <StyledTextarea
          label="Mensagens Rotativas (uma por linha)"
          rows={4}
          value={home.sobre.mensagens}
          onChange={e => setHome(p => ({ ...p, sobre: { ...p.sobre, mensagens: e.target.value } }))}
          placeholder="Mais de 15 anos no mercado&#10;Joias artesanais feitas a mão&#10;Referência em Niquelândia"
        />

        <div className="space-y-2">
          <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Galeria de Fotos</Label>
          <div className="flex flex-wrap gap-3">
            {home.sobre.fotos.map((f, i) => (
              <div key={i} className="relative group">
                <img src={f} className="w-24 h-24 object-cover rounded-xl border-2 border-zinc-700 group-hover:border-amber-500 transition-colors" alt="" />
                <button
                  onClick={() => setHome(p => ({ ...p, sobre: { ...p.sobre, fotos: p.sobre.fotos.filter((_, idx) => idx !== i) } }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-500/5 transition-all group">
              {uploading ? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" /> : <Plus className="w-5 h-5 text-zinc-500 group-hover:text-amber-500" />}
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                disabled={uploading}
                onChange={async e => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    await uploadAndSet(file, url =>
                      setHome(p => ({ ...p, sobre: { ...p.sobre, fotos: [...p.sobre.fotos, url] } }))
                    )
                  }
                  e.target.value = ""
                }}
              />
            </label>
          </div>
        </div>
      </Section>

      {/* CONTATO */}
      <Section icon={Phone} title="Seção Contato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="Título"
            value={home.contato.titulo}
            onChange={e => setHome(p => ({ ...p, contato: { ...p.contato, titulo: e.target.value } }))}
            placeholder="Contato"
          />
          <StyledInput
            label="Subtítulo"
            value={home.contato.subtitulo}
            onChange={e => setHome(p => ({ ...p, contato: { ...p.contato, subtitulo: e.target.value } }))}
            placeholder="Nossas lojas físicas e atendimento direto"
          />
        </div>

        <StyledInput
          label="URL do Instagram"
          value={home.contato.instagram_url}
          onChange={e => setHome(p => ({ ...p, contato: { ...p.contato, instagram_url: e.target.value } }))}
          placeholder="https://instagram.com/sua_loja"
        />

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Lojas - Contato</Label>
            <Button onClick={addContatoLoja} size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white">
              <Plus className="w-4 h-4 mr-1" /> Adicionar Loja
            </Button>
          </div>

          {(home.contato.lojas || []).map((loja, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl p-4 space-y-3 border border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-sm flex items-center gap-2">
                  <Store className="w-4 h-4" /> Loja {i + 1}
                </span>
                <button onClick={() => removeContatoLoja(i)} className="text-red-400 hover:text-red-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome (ex: Loja Niquelândia)"
                  className="bg-zinc-900 border-zinc-700 text-white h-10"
                  value={loja.nome}
                  onChange={e => updateContatoLoja(i, "nome", e.target.value)}
                />
                <Input
                  placeholder="Destaque (ex: Matriz)"
                  className="bg-zinc-900 border-zinc-700 text-white h-10"
                  value={loja.destaque}
                  onChange={e => updateContatoLoja(i, "destaque", e.target.value)}
                />
              </div>
              <Input
                placeholder="Título do Card"
                className="bg-zinc-900 border-zinc-700 text-white h-10"
                value={loja.titulo_card}
                onChange={e => updateContatoLoja(i, "titulo_card", e.target.value)}
              />
              <Textarea
                placeholder="Endereço completo"
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={2}
                value={loja.endereco}
                onChange={e => updateContatoLoja(i, "endereco", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="WhatsApp URL"
                  className="bg-zinc-900 border-zinc-700 text-white h-10"
                  value={loja.whatsapp_url}
                  onChange={e => updateContatoLoja(i, "whatsapp_url", e.target.value)}
                />
                <Input
                  placeholder="Horário"
                  className="bg-zinc-900 border-zinc-700 text-white h-10"
                  value={loja.horario}
                  onChange={e => updateContatoLoja(i, "horario", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <Section icon={FileText} title="Footer">
        <StyledTextarea
          label="Texto Institucional"
          rows={3}
          value={home.footer.institucional}
          onChange={e => setHome(p => ({ ...p, footer: { ...p.footer, institucional: e.target.value } }))}
          placeholder="Há mais de 15 anos oferecendo joias..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledInput
            label="CNPJ"
            value={home.footer.cnpj}
            onChange={e => setHome(p => ({ ...p, footer: { ...p.footer, cnpj: e.target.value } }))}
            placeholder="00.000.000/0000-00"
          />
          <StyledInput
            label="Texto do Selo"
            value={home.footer.selo_texto}
            onChange={e => setHome(p => ({ ...p, footer: { ...p.footer, selo_texto: e.target.value } }))}
            placeholder="Loja Premium - Referência na Cidade"
          />
        </div>

        {/* Lojas do Footer */}
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Lojas - Footer</Label>
            <Button onClick={addFooterLoja} size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white">
              <Plus className="w-4 h-4 mr-1" /> Adicionar Loja
            </Button>
          </div>

          {(home.footer.lojas || []).map((loja, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl p-4 space-y-3 border border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Loja Footer {i + 1}
                </span>
                <button onClick={() => removeFooterLoja(i)} className="text-red-400 hover:text-red-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Input
                placeholder="Nome da Loja"
                className="bg-zinc-900 border-zinc-700 text-white h-10"
                value={loja.nome}
                onChange={e => updateFooterLoja(i, "nome", e.target.value)}
              />
              <Textarea
                placeholder="Endereço"
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={2}
                value={loja.endereco}
                onChange={e => updateFooterLoja(i, "endereco", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Telefone"
                  className="bg-zinc-900 border-zinc-700 text-white h-10"
                  value={loja.telefone}
                  onChange={e => updateFooterLoja(i, "telefone", e.target.value)}
                />
                <Input
                  placeholder="Link Tel (tel:+55...)"
                  className="bg-zinc-900 border-zinc-700 text-white h-10"
                  value={loja.tel_link}
                  onChange={e => updateFooterLoja(i, "tel_link", e.target.value)}
                />
              </div>
              <Input
                placeholder="Horário de funcionamento"
                className="bg-zinc-900 border-zinc-700 text-white h-10"
                value={loja.horario}
                onChange={e => updateFooterLoja(i, "horario", e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Certificados */}
        <div className="space-y-2 mt-6 pt-4 border-t border-zinc-700">
          <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Certificados e Premiações
          </Label>
          <div className="flex flex-wrap gap-3">
            {(home.footer.certificados || []).map((c, i) => (
              <div key={i} className="relative group">
                <img src={c} className="w-24 h-24 object-contain bg-zinc-800 p-2 rounded-xl border-2 border-zinc-700 group-hover:border-amber-500 transition-colors" alt="" />
                <button
                  onClick={() => setHome(p => ({ ...p, footer: { ...p.footer, certificados: p.footer.certificados.filter((_, idx) => idx !== i) } }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group">
              {uploading ? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" /> : <Plus className="w-5 h-5 text-zinc-500 group-hover:text-amber-500" />}
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                disabled={uploading}
                onChange={async e => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    await uploadAndSet(file, url =>
                      setHome(p => ({ ...p, footer: { ...p.footer, certificados: [...(p.footer.certificados || []), url] } }))
                    )
                  }
                  e.target.value = ""
                }}
              />
            </label>
          </div>
        </div>
      </Section>

      {/* Botao salvar fixo */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={saveHome} 
          disabled={saving || uploading}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold px-6 py-3 rounded-xl shadow-2xl shadow-amber-500/30"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}

import { useState, useRef, DragEvent } from "react";
import {
  Upload,
  FileCode,
  Save,
  Tag,
  User,
  FileText,
  X,
  CheckCircle,
  Code2,
} from "lucide-react";
import { ALL_TAGS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const PLACEHOLDER_SQL = `-- Cole sua consulta SQL aqui
SELECT
  c.id_cliente,
  c.nome_completo,
  c.email,
  SUM(p.valor_total) AS valor_vitalicio,
  COUNT(p.id_pedido) AS total_pedidos,
  MAX(p.criado_em) AS ultimo_pedido
FROM tb_clientes c
LEFT JOIN tb_pedidos_venda p
  ON c.id_cliente = p.id_cliente
WHERE p.status = 'CONCLUIDO'
  AND p.criado_em >= DATEADD(month, -12, GETDATE())
GROUP BY c.id_cliente, c.nome_completo, c.email
ORDER BY valor_vitalicio DESC;`;

export default function NewQueryPage() {
  const [queryName, setQueryName] = useState("");
  const [owner, setOwner] = useState("");
  const [sqlCode, setSqlCode] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".sql") || file.name.endsWith(".txt"))) {
      setUploadedFile(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setSqlCode(text || "");
      };
      reader.readAsText(file);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setSqlCode(text || "");
      };
      reader.readAsText(file);
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !selectedTags.includes(t)) {
      setSelectedTags((prev) => [...prev, t]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  }

  const filteredSuggestions = ALL_TAGS.filter(
    (t) => t.includes(tagInput.toLowerCase()) && !selectedTags.includes(t)
  );

  function handleSave() {
    if (!queryName.trim()) {
      alert("Por favor, informe o nome da consulta.");
      return;
    }
    if (!sqlCode.trim()) {
      alert("Por favor, insira o código SQL.");
      return;
    }
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 4000);

    setQueryName("");
    setOwner("");
    setSqlCode("");
    setSelectedTags([]);
    setUploadedFile(null);
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Nova Consulta</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cadastre uma nova consulta SQL ou definição de tabela no catálogo.
        </p>
      </div>

      {/* Área de Upload */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Upload className="w-4 h-4 text-primary" />
          Enviar Arquivo SQL
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl py-10 px-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          {uploadedFile ? (
            <>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FileCode className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{uploadedFile}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Arquivo carregado · Clique para substituir</p>
              </div>
            </>
          ) : (
            <>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isDragging ? "bg-primary/15" : "bg-muted"
              )}>
                <Upload className={cn("w-6 h-6", isDragging ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? "Solte o arquivo aqui" : "Arraste e solte seu arquivo .sql"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ou <span className="text-primary font-medium">clique para selecionar</span> · Suporta arquivos .sql
                </p>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".sql,.txt"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </div>

      {/* Editor de Código SQL */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Code2 className="w-4 h-4 text-primary" />
            Editor de Código SQL
          </div>
          {sqlCode && (
            <button
              onClick={() => { setSqlCode(""); setUploadedFile(null); }}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Limpar
            </button>
          )}
        </div>
        <div className="relative rounded-lg overflow-hidden border border-border bg-slate-950">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-700">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-slate-400 font-mono">consulta.sql</span>
          </div>
          <textarea
            value={sqlCode}
            onChange={(e) => setSqlCode(e.target.value)}
            placeholder={PLACEHOLDER_SQL}
            rows={14}
            className="code-editor w-full bg-transparent text-slate-300 placeholder:text-slate-600 px-5 py-4 focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Metadados */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="w-4 h-4 text-primary" />
          Metadados da Consulta
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Nome da Consulta *
            </label>
            <input
              type="text"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              placeholder="ex: qry_resumo_vendas_mensal"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Responsável
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="ex: time-analytics"
                className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tags
          </label>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-0.5 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowTagSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addCustomTag(); }
                    if (e.key === "Escape") setShowTagSuggestions(false);
                  }}
                  onFocus={() => setShowTagSuggestions(true)}
                  placeholder="Digite uma tag ou escolha das sugestões..."
                  className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={addCustomTag}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-white hover:bg-muted transition-colors"
              >
                Adicionar
              </button>
            </div>

            {showTagSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-24 bg-white border border-border rounded-lg shadow-lg z-20 py-1 max-h-40 overflow-y-auto">
                {filteredSuggestions.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { toggleTag(tag); setTagInput(""); setShowTagSuggestions(false); }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-muted-foreground">* Campos obrigatórios</p>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-150"
        >
          <Save className="w-4 h-4" />
          Salvar e Catalogar
        </button>
      </div>

      {/* Toast de Sucesso */}
      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-xl animate-in slide-in-from-bottom-4 duration-300 z-50">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Consulta catalogada com sucesso!</p>
            <p className="text-xs opacity-80">Já está disponível no Catálogo de Dados.</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-2 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

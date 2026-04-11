import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, FilePlus, LayoutDashboard, MessageSquare, Table, Eye, Code2 } from "lucide-react";
import { MOCK_CATALOG } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const TAG_COLORS = [
  "bg-blue-50 text-blue-700",
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-sky-50 text-sky-700",
  "bg-teal-50 text-teal-700",
  "bg-slate-100 text-slate-600",
];

function tagColor(tag: string) {
  const idx = tag.charCodeAt(0) % TAG_COLORS.length;
  return TAG_COLORS[idx];
}

const TYPE_ICONS = {
  tabela: Table,
  visao: Eye,
  consulta: Code2,
};

const TYPE_COLORS: Record<string, string> = {
  tabela: "text-blue-600",
  visao: "text-purple-600",
  consulta: "text-emerald-600",
};

const ROW1_TAGS = ["vendas", "pedidos", "clientes", "crm", "join", "agregado", "receita"];
const ROW2_TAGS = ["financeiro", "mensal", "produtos", "estoque", "dados-mestre", "ranking"];

const CARDS = [
  {
    href: "/nova-consulta",
    icon: FilePlus,
    title: "Nova Consulta",
    description: "Cadastre uma nova consulta SQL ou definição de tabela no catálogo.",
  },
  {
    href: "/catalogo",
    icon: LayoutDashboard,
    title: "Catálogo de Dados",
    description: "Explore, pesquise e descubra consultas SQL e tabelas catalogadas.",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    title: "Assistente IA",
    description: "Converse com o assistente inteligente para extrair informações do catálogo.",
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_CATALOG.filter((entry) =>
      entry.tableName.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      entry.owner.toLowerCase().includes(q) ||
      entry.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setDropdownOpen(false);
    navigate(`/catalogo?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setDropdownOpen(false);
  }

  function handleSuggestionClick(id: string) {
    setDropdownOpen(false);
    navigate(`/catalogo/${id}`);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full py-16 px-6">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-foreground text-center mb-8">
        Olá, o que você procura?
      </h1>

      {/* Search bar + Advanced Search button */}
      <div className="flex items-center gap-3 w-full max-w-2xl mb-6">
        <div ref={containerRef} className="relative flex-1">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <button
              onClick={handleSearch}
              className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
              tabIndex={-1}
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => { if (query.trim()) setDropdownOpen(true); }}
              onKeyDown={handleKeyDown}
              placeholder="Pesquisar por nome, descrição, responsável ou tag..."
              className="flex-1 text-sm text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-none"
            />
          </div>

          {/* Dropdown */}
          {dropdownOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-border rounded-lg shadow-md overflow-hidden z-50">
              {suggestions.map((entry) => {
                const Icon = TYPE_ICONS[entry.type];
                return (
                  <button
                    key={entry.id}
                    onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(entry.id); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors"
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", TYPE_COLORS[entry.type])} />
                    <span className="text-sm text-foreground font-medium truncate">{entry.tableName}</span>
                    <span className="text-xs text-muted-foreground ml-auto truncate max-w-[160px]">{entry.description}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex-shrink-0 px-4 py-2.5 rounded-lg border border-border bg-white text-sm font-medium text-foreground shadow-sm cursor-default hover:border-primary/40 transition-colors duration-150"
          tabIndex={-1}
        >
          Busca Avançada
        </button>
      </div>

      {/* Tags section */}
      <div className="flex flex-col gap-2 w-full max-w-2xl mb-10">
        {/* Row 1 */}
        <div className="flex flex-wrap gap-2">
          {ROW1_TAGS.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-default select-none border border-transparent hover:border-current/25 transition-colors duration-150 ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Row 2 + "Confira mais tags" */}
        <div className="flex flex-wrap gap-2 items-center">
          {ROW2_TAGS.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-default select-none border border-transparent hover:border-current/25 transition-colors duration-150 ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
          <span className="text-xs font-medium text-primary underline underline-offset-2 cursor-default select-none px-2 py-1 rounded-full border border-transparent hover:border-primary/40 transition-colors duration-150">
            Confira mais tags
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-5 w-full max-w-2xl">
        {CARDS.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-sm transition-all duration-150 cursor-pointer h-full">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/60">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

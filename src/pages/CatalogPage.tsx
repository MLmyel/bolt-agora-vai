import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Trash2,
  Tag,
  Calendar,
  User,
  Table,
  Eye,
  Code2,
  Filter,
  Database,
  ChevronRight,
} from "lucide-react";
import { MOCK_CATALOG, ALL_TAGS, CatalogEntry } from "@/lib/mockData";
import { useRole } from "@/lib/roleContext";
import DeleteModal from "@/components/DeleteModal";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  tabela: Table,
  visao: Eye,
  consulta: Code2,
};

const TYPE_COLORS: Record<string, string> = {
  tabela: "bg-blue-50 text-blue-700 border-blue-100",
  visao: "bg-purple-50 text-purple-700 border-purple-100",
  consulta: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const TYPE_LABELS: Record<string, string> = {
  tabela: "Tabela",
  visao: "Visão",
  consulta: "Consulta",
};

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

export default function CatalogPage() {
  const { isManager } = useRole();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [tagFilter, setTagFilter] = useState<string>("todas");
  const [dbFilter, setDbFilter] = useState<string>("todos");
  const [entries, setEntries] = useState<CatalogEntry[]>(MOCK_CATALOG);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string;
    name: string;
    type: string;
  }>({ open: false, id: "", name: "", type: "" });

  const databases = useMemo(() => Array.from(new Set(entries.map(e => e.database))), [entries]);

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        entry.tableName.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.owner.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));
      const matchType = typeFilter === "todos" || entry.type === typeFilter;
      const matchTag = tagFilter === "todas" || entry.tags.includes(tagFilter);
      const matchDb = dbFilter === "todos" || entry.database === dbFilter;
      return matchSearch && matchType && matchTag && matchDb;
    });
  }, [entries, search, typeFilter, tagFilter, dbFilter]);

  function openDelete(id: string, name: string, type: string) {
    setDeleteModal({ open: true, id, name, type });
  }

  function confirmDelete() {
    setEntries((prev) => prev.filter((e) => e.id !== deleteModal.id));
    setDeleteModal({ open: false, id: "", name: "", type: "" });
  }

  function clearFilters() {
    setSearch("");
    setTypeFilter("todos");
    setTagFilter("todas");
    setDbFilter("todos");
  }

  const hasFilters = search || typeFilter !== "todos" || tagFilter !== "todas" || dbFilter !== "todos";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Catálogo de Dados</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Explore, pesquise e descubra consultas SQL e tabelas catalogadas.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white border border-border rounded-lg px-3 py-1.5">
          <Database className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{filtered.length}</span>
          <span>de {entries.length} entradas</span>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-xl border border-border p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar por nome, descrição, responsável ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Filtros:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="tabela">Tabelas</option>
            <option value="visao">Visões</option>
            <option value="consulta">Consultas</option>
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="todas">Todas as Tags</option>
            {ALL_TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={dbFilter}
            onChange={(e) => setDbFilter(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="todos">Todos os Bancos</option>
            {databases.map((db) => (
              <option key={db} value={db}>{db}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline px-2"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nome da Tabela / Consulta
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Descrição
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Responsável
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tags
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Criado em
                </th>
                {isManager && (
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="px-5 py-12 text-center">
                    <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhuma entrada encontrada para sua pesquisa.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      Limpar filtros
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const TypeIcon = TYPE_ICONS[entry.type];
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/catalogo/${entry.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
                            TYPE_COLORS[entry.type]
                          )}>
                            <TypeIcon className="w-3 h-3" />
                            {TYPE_LABELS[entry.type]}
                          </span>
                          <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {entry.tableName}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 pl-0.5">{entry.database}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground/80 leading-snug line-clamp-2 max-w-sm">
                          {entry.description}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <User className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">{entry.owner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              onClick={(e) => { e.stopPropagation(); setTagFilter(tag); }}
                              className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity",
                                tagColor(tag)
                              )}
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5" />
                          {entry.createdAt}
                        </div>
                      </td>
                      {isManager && (
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); openDelete(entry.id, entry.tableName, TYPE_LABELS[entry.type]); }}
                            className="p-1.5 rounded-md text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-150 opacity-0 group-hover:opacity-100"
                            title="Excluir entrada"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        open={deleteModal.open}
        itemName={deleteModal.name}
        itemType={deleteModal.type}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: "", name: "", type: "" })}
      />
    </div>
  );
}

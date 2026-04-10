import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  FilePlus,
  MessageSquare,
  LayoutDashboard,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { useRole } from "@/lib/roleContext";
import { cn } from "@/lib/utils";
import oracleLogo from "@assets/ORCL_1774809620248.png";
import UserProfileMenu from "./UserProfileMenu";

const NAV_ITEMS = [
  {
    label: "Catálogo",
    path: "/",
    icon: LayoutDashboard,
    description: "Explorar e pesquisar dados",
  },
  {
    label: "Nova Consulta",
    path: "/nova-consulta",
    icon: FilePlus,
    description: "Catalogar consultas SQL",
  },
  {
    label: "Assistente IA",
    path: "/chat",
    icon: MessageSquare,
    description: "Fazer perguntas ao catálogo",
  },
];

function OracleLogo({ expanded }: { expanded: boolean }) {
  return (
    <div className={cn(
      "flex items-center overflow-hidden transition-all duration-300",
      expanded ? "gap-3" : "justify-center"
    )}>
      <img src={oracleLogo} alt="Oracle" className="h-6 flex-shrink-0 object-contain" />
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        expanded ? "w-36 opacity-100" : "w-0 opacity-0"
      )}>
        <svg viewBox="0 0 116 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
          <text
            x="0" y="19"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="20"
            fontWeight="700"
            fill="#C74634"
            letterSpacing="1.5"
          >
            ORACLE
          </text>
        </svg>
        <p className="text-[10px] text-sidebar-foreground/40 leading-none mt-0.5 whitespace-nowrap font-medium tracking-wide uppercase">
          Data Catalog
        </p>
      </div>
    </div>
  );
}

function Sidebar() {
  const [location] = useLocation();
  const { isManager } = useRole();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isExpanded && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  function openSidebar() {
    setIsExpanded(true);
  }

  function closeSidebar() {
    setIsExpanded(false);
  }

  return (
    <aside ref={sidebarRef} className={cn(
      "relative flex-shrink-0 flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
      "transition-[width] duration-300 ease-in-out overflow-hidden",
      isExpanded ? "w-60" : "w-[60px]"
    )}>

      {/* Logo / Header */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border flex-shrink-0 h-[60px]",
        isExpanded ? "px-4 justify-between" : "justify-center px-0"
      )}>
        <OracleLogo expanded={isExpanded} />

        {/* Collapse button — only when expanded */}
        {isExpanded && (
          <button
            onClick={closeSidebar}
            title="Recolher barra lateral"
            className="w-7 h-7 flex items-center justify-center rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-hidden">
        {isExpanded && (
          <p className="px-4 mb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">
            Menu
          </p>
        )}

        {NAV_ITEMS.map(({ label, path, icon: Icon, description }) => {
          const isActive = location === path || (path !== "/" && location.startsWith(path));
          return (
            <Link key={path} href={path}>
              <button
                title={!isExpanded ? label : undefined}
                onClick={!isExpanded ? openSidebar : undefined}
                className={cn(
                  "relative flex items-center text-left transition-all duration-150",
                  isExpanded
                    ? "w-[calc(100%-16px)] mx-2 gap-3 px-3 py-2.5 rounded-lg"
                    : "w-full justify-center py-3",
                  isActive
                    ? isExpanded
                      ? "bg-sidebar-primary/18 text-sidebar-primary border border-sidebar-primary/25"
                      : "text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {/* Active strip for collapsed */}
                {isActive && !isExpanded && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-sidebar-primary rounded-r-full" />
                )}

                <Icon className={cn(
                  "flex-shrink-0",
                  isExpanded ? "w-4 h-4" : "w-5 h-5",
                  isActive ? "text-sidebar-primary" : ""
                )} />

                {/* Label — only when expanded */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out flex-1 min-w-0",
                  isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                )}>
                  <p className="text-sm font-medium leading-tight whitespace-nowrap">{label}</p>
                  <p className="text-[11px] leading-tight opacity-55 truncate whitespace-nowrap">{description}</p>
                </div>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Footer — role badge */}
      <div className={cn(
        "border-t border-sidebar-border flex-shrink-0",
        isExpanded ? "px-3 py-3" : "py-3 flex justify-center"
      )}>
        <div className={cn(
          "flex items-center gap-2 rounded-lg text-xs",
          isExpanded ? "px-3 py-2 w-full" : "justify-center w-10 h-10",
          isManager
            ? "bg-orange-500/12 text-orange-300 border border-orange-500/20"
            : "bg-sidebar-accent/60 text-sidebar-foreground/55"
        )}>
          <Shield className="w-3.5 h-3.5 flex-shrink-0" title={isExpanded ? undefined : (isManager ? "Modo Gestor" : "Modo Usuário")} />
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
          )}>
            <p className="font-semibold whitespace-nowrap">{isManager ? "Modo Gestor" : "Modo Usuário"}</p>
            <p className="opacity-65 whitespace-nowrap">{isManager ? "Acesso administrativo" : "Somente leitura"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header() {
  const { role, setRole } = useRole();

  return (
    <header className="h-[60px] flex items-center justify-between px-6 bg-white border-b border-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">Simular Perfil:</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setRole("user")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
              role === "user"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Usuário
          </button>
          <button
            onClick={() => setRole("manager")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
              role === "manager"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Gestor
          </button>
        </div>
        <UserProfileMenu />
      </div>
    </header>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

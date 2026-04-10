import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { useRole } from "@/lib/roleContext";
import { cn } from "@/lib/utils";

export default function UserProfileMenu() {
  const { user, role } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"menu" | "profile" | "settings">("menu");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeStyles = () => {
    if (role === "manager") {
      return "bg-orange-500/12 text-orange-600 border border-orange-500/20";
    }
    return "bg-blue-500/12 text-blue-600 border border-blue-500/20";
  };

  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  const handleSettingsClick = () => {
    setActiveSection("settings");
  };

  const handleMenuClick = () => {
    setActiveSection("menu");
  };

  const handleLogout = () => {
    setIsOpen(false);
    setActiveSection("menu");
  };

  return (
    <div className="relative">
      {/* Avatar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200",
          "hover:ring-2 hover:ring-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50",
          role === "manager"
            ? "bg-primary/15 text-primary border border-primary/20"
            : "bg-blue-500/15 text-blue-600 border border-blue-500/20"
        )}
        title={user.name}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement?.classList.add("flex");
              e.currentTarget.parentElement?.classList.add("items-center");
              e.currentTarget.parentElement?.classList.add("justify-center");
            }}
          />
        ) : (
          getInitials(user.name)
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Menu Principal */}
            {activeSection === "menu" && (
              <>
                {/* Profile Header */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 border-primary/20 flex-shrink-0 overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="p-4 space-y-3 border-b border-border">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Cargo
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {user.position}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Nível de Acesso
                    </p>
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 rounded-md text-xs font-semibold",
                        getRoleBadgeStyles()
                      )}
                    >
                      {role === "manager" ? "Gestor" : "Usuário"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-3 space-y-2 border-b border-border">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors duration-150 flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Meu Perfil
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="w-full px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors duration-150 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Configurações
                  </button>
                </div>

                {/* Logout Button */}
                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/5 rounded-md transition-colors duration-150 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </>
            )}

            {/* Profile View */}
            {activeSection === "profile" && (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Meu Perfil</h3>
                  <button
                    onClick={handleMenuClick}
                    className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wider"
                  >
                    Voltar
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 border-2 border-primary/20 overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-primary">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-center">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Nome Completo
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Cargo
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.position}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Nível de Acesso
                      </p>
                      <span
                        className={cn(
                          "inline-block px-2.5 py-1 rounded-md text-xs font-semibold",
                          getRoleBadgeStyles()
                        )}
                      >
                        {role === "manager" ? "Gestor" : "Usuário"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 mt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      ID do Usuário: {user.id}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Settings View */}
            {activeSection === "settings" && (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Configurações</h3>
                  <button
                    onClick={handleMenuClick}
                    className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wider"
                  >
                    Voltar
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Preferências
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-muted-foreground">
                          Notificações por email
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-muted-foreground">
                          Atualizações do catálogo
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground">
                      Simulação de Papel
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Mude o modo de acesso para testar a interface como Gestor.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        className="flex-1 px-3 py-2 text-xs font-medium rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors duration-150"
                        disabled={role === "user"}
                      >
                        Usuário
                      </button>
                      <button
                        className="flex-1 px-3 py-2 text-xs font-medium rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors duration-150"
                        disabled={role === "manager"}
                      >
                        Gestor
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground">
                      Sobre
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Data Catalog Pro v1.0.0
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

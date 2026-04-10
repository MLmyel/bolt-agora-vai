import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "user" | "manager";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  position: string;
  avatar: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isManager: boolean;
  user: UserData;
  setUser: (user: UserData) => void;
}

const DEFAULT_USER: UserData = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@empresa.com.br",
  role: "user",
  position: "Analista de Dados",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const RoleContext = createContext<RoleContextType>({
  role: "user",
  setRole: () => {},
  isManager: false,
  user: DEFAULT_USER,
  setUser: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("user");
  const [user, setUser] = useState<UserData>({ ...DEFAULT_USER, role });

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    setUser(prev => ({ ...prev, role: newRole }));
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, isManager: role === "manager", user, setUser }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

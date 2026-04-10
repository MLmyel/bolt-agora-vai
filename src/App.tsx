import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/lib/roleContext";
import Layout from "@/components/Layout";
import CatalogPage from "@/pages/CatalogPage";
import NewQueryPage from "@/pages/NewQueryPage";
import ChatPage from "@/pages/ChatPage";
import TableDetailPage from "@/pages/TableDetailPage";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-64">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Página não encontrada</h2>
        <p className="text-sm text-muted-foreground mt-1">Esta página não existe.</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={CatalogPage} />
        <Route path="/catalogo/:id" component={TableDetailPage} />
        <Route path="/nova-consulta" component={NewQueryPage} />
        <Route path="/chat" component={ChatPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RoleProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </RoleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

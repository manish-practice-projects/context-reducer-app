import { useState } from "react";
import { AppProviders } from "./components/layout/AppProviders";
import { NavBar } from "./components/layout/NavBar";
import { BasicPage } from "./pages/BasicPage";
import { IntermediatePage } from "./pages/IntermediatePage";
import { AdvancedPage } from "./pages/AdvancedPage";
import { NotificationToastList } from "./components/intermediate/NotificationToast";
import "./styles.css";

type Page = "basic" | "intermediate" | "advanced";

function AppContent() {
  const [page, setPage] = useState<Page>("basic");

  return (
    <>
      <NavBar activePage={page} onNavigate={(p) => setPage(p as Page)} />
      <main className="main-content">
        {page === "basic" && <BasicPage />}
        {page === "intermediate" && <IntermediatePage />}
        {page === "advanced" && <AdvancedPage />}
      </main>
      {/* Toast portal — renders at root, reads from context */}
      <NotificationToastList />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

import { StrictMode } from "react";
import Router from "./shared/infrastructure/ui/navigation/Router";
import { ErrorBoundary } from "./shared/infrastructure/components/ErrorBoundary";
import { AuthProvider } from "./core/auth/infrastructure/hooks/useAuth";

function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

export default App;

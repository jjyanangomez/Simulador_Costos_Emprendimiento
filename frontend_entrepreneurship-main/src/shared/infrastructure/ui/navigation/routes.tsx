import React from "react";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../../../../core/auth/infrastructure/ui/LoginPage";
import { ResetPasswordPage } from "../../../../core/auth/infrastructure/ui/ResetPasswordPage";
import { ModuleContentPage } from "../../../../core/modules/infrastructure/ui/pages/ModuleContentPage";
import { ProtectedRoute } from "../../../../core/auth/infrastructure/components/ProtectedRoute";
import { DashboardPage } from "../../../../core/dashboard/infrastructure/ui/DashboardPage";
import { BusinessSetupPage } from "../../../../core/business-setup/infrastructure/ui/BusinessSetupPage";
import { FixedCostsPage } from "../../../../core/fixed-costs/infrastructure/ui/FixedCostsPage";
import { VariableCostsPage } from "../../../../core/variable-costs/infrastructure/ui/VariableCostsPage";
import { ProfitabilityAnalysisPage } from "../../../../core/profitability-analysis/infrastructure/ui/ProfitabilityAnalysisPage";
import { ResultsPage } from "../../../../core/results/infrastructure/ui/ResultsPage";
import { HomePage } from "../../../../core/home/infrastructure/ui/HomePage";

export const Routes = {
  home: {
    path: "",
    layout: React.Fragment,
    routes: {
      redirect: {
        title: "",
        path: "",
        element: () => <Navigate to="/home" />,
      },
    },
  },

  mainHome: {
    path: "/home",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Inicio",
        path: "",
        element: HomePage,
      },
    },
  },
  
  auth: {
    path: "/login",
    layout: React.Fragment,
    routes: {
      login: {
        title: "Iniciar Sesión",
        path: "",
        element: LoginPage,
      },
    },
  },

  resetPassword: {
    path: "/reset-password",
    layout: React.Fragment,
    routes: {
      reset: {
        title: "",
        path: "",
        element: ResetPasswordPage,
      },
    },
  },

  businesses: {
    path: "/businesses",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Negocios",
        path: "",
        element: ModuleContentPage,
      },
    },
  },

  dashboard: {
    path: "/dashboard",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Dashboard",
        path: "",
        element: DashboardPage,
      },
    },
  },

  businessSetup: {
    path: "/business-setup",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Configuración del Negocio",
        path: "",
        element: BusinessSetupPage,
      },
    },
  },

  fixedCosts: {
    path: "/fixed-costs",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Costos Fijos",
        path: "",
        element: FixedCostsPage,
      },
    },
  },

  variableCosts: {
    path: "/variable-costs",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Costos Variables",
        path: "",
        element: VariableCostsPage,
      },
    },
  },

  profitabilityAnalysis: {
    path: "/profitability-analysis",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Análisis de Rentabilidad",
        path: "",
        element: ProfitabilityAnalysisPage,
      },
    },
  },

  results: {
    path: "/results",
    layout: ({ children }: { children: React.ReactNode }) => (
      <ProtectedRoute>{children}</ProtectedRoute>
    ),
    routes: {
      index: {
        title: "Resultados del Análisis",
        path: "",
        element: ResultsPage,
      },
    },
  },
};
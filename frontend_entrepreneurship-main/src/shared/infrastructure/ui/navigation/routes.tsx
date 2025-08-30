import React from "react";
import { BusinessesPage } from "../../../../core/businesses/infrastructure/ui/BusinessesPage";
import { BusinessForm } from "../../../../core/businesses/infrastructure/ui/BusinessForm";
import { LearningPathPage } from "../../../../core/learning-path/infrastructure/ui/pages/LearningPathPage";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../../../../core/auth/infrastructure/ui/LoginPage";
import { ResetPasswordPage } from "../../../../core/auth/infrastructure/ui/ResetPasswordPage";
import { ModuleContentPage } from "../../../../core/modules/infrastructure/ui/pages/ModuleContentPage";
import { ProtectedRoute } from "../../../../core/auth/infrastructure/components/ProtectedRoute";

export const Routes = {
  home: {
    path: "",
    layout: React.Fragment,
    routes: {
      redirect: {
        title: "",
        path: "",
        element: () => <Navigate to="/login" />,
      },
    },
  },
  auth: {
    path: "/login",
    layout: React.Fragment,
    routes: {
      login: {
        title: "",
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
      businessesList: {
        title: "Lista de Negocios",
        path: "", // Se renderiza en /businesses
        element: BusinessesPage,
      },
      businessesForm: {
        title: "Formulario de Negocio",
        path: "new", // Se renderiza en /businesses/new
        element: BusinessForm,
      },
      // 👇 AÑADE ESTA NUEVA RUTA ANIDADA AQUÍ
      learningPath: {
        title: "Camino de Aprendizaje",
        path: ":businessId/learning-path",
        layout: React.Fragment,
        routes: {
          index: {
            title: "Vista Principal",
            path: "", // index route
            element: LearningPathPage,
          },
          module: {
            title: "Module",
            path: ":moduleId", 
            element: ModuleContentPage,
          },
        },
      },
    },
  },

  
};
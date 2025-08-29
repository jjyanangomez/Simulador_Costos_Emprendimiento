import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";
import { Routes } from "./routes";
import PageNotFound from "../../components/PageNotFound";

// 🔧 Función recursiva para manejar rutas anidadas
const createRouteObject = (route: any): RouteObject => {
  const routeObject: RouteObject = {
    path: route.path,
    element: <route.element />,
  };

  // Si tiene rutas anidadas, procesarlas recursivamente
  if (route.routes) {
    routeObject.children = Object.values(route.routes).map((childRoute: any) => 
      createRouteObject(childRoute)
    );
  }

  return routeObject;
};

const RouteObjects: Array<RouteObject> = Object.values(Routes).map((section) => ({
  path: section.path,
  element: (
    <section.layout>
      <Outlet />
    </section.layout>
  ),
  children: Object.values(section.routes).map((route: any) => {
    // 🔧 Caso especial para rutas con subrutas anidadas
    if (route.routes) {
      return {
        path: route.path,
        element: route.layout ? (
          <route.layout>
            <Outlet />
          </route.layout>
        ) : <Outlet />,
        children: Object.values(route.routes).map((subRoute: any) => ({
          path: subRoute.path,
          element: <subRoute.element />,
        })),
      };
    }
    
    // Caso normal
    return {
      path: route.path,
      element: <route.element />,
    };
  }),
}));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      ...RouteObjects,
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
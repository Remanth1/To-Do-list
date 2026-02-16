import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthLayout } from "./components/AuthLayout";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
  {
    path: "/login",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
    ],
  },
  {
    path: "/register",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Register,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
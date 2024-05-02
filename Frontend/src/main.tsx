import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import Router from "@/pages/Router.tsx";
import { AuthProvider } from "./shared/hooks/auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={Router} />
  </AuthProvider>
);

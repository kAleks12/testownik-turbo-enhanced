import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home.tsx";
import ErrorPage from "@/pages/error-page/ErrorPage.tsx";
import StartingPage from "./starting-page/StartingPage";
import Layout from "./layout/Layout";
import LoadingPage from "./loading-page/LoadingPage";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <StartingPage />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/loading",
        element: <LoadingPage />,
      },
    ],
  },
]);

export default Router;

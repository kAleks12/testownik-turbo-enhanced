import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home.tsx";
import ErrorPage from "@/pages/error-page/ErrorPage.tsx";
import StartingPage from "./starting-page/StartingPage";
import Layout from "./layout/Layout";
import LoadingPage from "./loading-page/LoadingPage";
import PrivateRoute from "@/components/private-route/PrivateRoute";
import AddNew from "./add-new/AddNew";
import EditTest from "./edit-test/EditTest";
import SolveTest from "./solve-test/SolveTest";
import SearchCourse from "./search-test/SearchTest";
import Register from "./register/Register";
import Routes from "@/shared/utils/routes";
import Login from "./login/Login";

const Router = createBrowserRouter([
  {
    path: Routes.Root,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <StartingPage />,
      },
      {
        path: Routes.Home,
        element: <PrivateRoute Component={Home} />,
      },
      {
        path: Routes.AddNew,
        element: <PrivateRoute Component={AddNew} />,
      },
      {
        path: Routes.EditTest,
        element: <PrivateRoute Component={EditTest} />,
      },
      {
        path: Routes.SolveTest,
        element: <PrivateRoute Component={SolveTest} />,
      },
      {
        path: Routes.SearchCourse,
        element: <PrivateRoute Component={SearchCourse} />,
      },
      {
        path: Routes.Loading,
        element: <LoadingPage />,
      },
      {
        path: Routes.Login,
        element: <Login />,
      },
      {
        path: Routes.Register,
        element: <Register />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      }
    ],
  },
]);

export default Router;

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
import SearchCourse from "./search-course/SearchCourse";

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
        element: <PrivateRoute Component={Home} />,
      },
      {
        path: "/add-new",
        element: <PrivateRoute Component={AddNew} />,
      },
      {
        path: "/edit/:id",
        element: <PrivateRoute Component={EditTest} />,
      },
      {
        path: "/solve/:id",
        element: <PrivateRoute Component={SolveTest} />,
      },
      {
        path: "/search-course",
        element: <PrivateRoute Component={SearchCourse} />,
      },
      {
        path: "/loading",
        element: <LoadingPage />,
      },
    ],
  },
]);

export default Router;

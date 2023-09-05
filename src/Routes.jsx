import MainLayout from "./components/Layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";

const routes = [
  {
    path: "/",
    layout: MainLayout,
    element: <HomePage />,
    // exact: true,
  },
  {
    path: "/login",
    layout: MainLayout,
    element: <LoginPage />,
  },
  {
    path: "/error",
    layout: MainLayout,
    element: <ErrorPage />,
  },
];

export default routes;

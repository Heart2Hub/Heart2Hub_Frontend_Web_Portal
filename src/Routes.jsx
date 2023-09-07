import MainLayout from "./components/Layout/MainLayout";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import ErrorPage from "./pages/Error/ErrorPage";
import LoginLayout from "./components/Layout/LoginLayout";

const routes = [
  {
    path: "/",
    element: (
      <LoginLayout>
        <LoginPage />
      </LoginLayout>
    ),
    exact: true,
  },
  {
    path: "/home",
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: "/error",
    element: (
      <MainLayout>
        <ErrorPage />
      </MainLayout>
    ),
  },
];

export default routes;

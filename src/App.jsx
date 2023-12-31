import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// RTL plugins
// import rtlPlugin from "stylis-plugin-rtl";
// import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "Routes";

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import heartLogoWhite from "assets/projectImages/heartLogoWhite.png";
import heartSmall from "assets/projectImages/heartSmall.png";
import Outpatient from "layouts/outpatient";
import Home from "layouts/home";
import ErrorPage from "layouts/error";
import MDSnackbar from "components/MDSnackbar";

// redux
import { useDispatch, useSelector } from "react-redux";
import { selectSnackbar, closeMessage } from "./store/slices/snackbarSlice";
import GlobalSnackbar from "examples/GlobalSnackbar";
import LoadingOverlay from "examples/LoadingOverlay";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const location = useLocation();

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  //snackbar message
  const snackbar = useSelector(selectSnackbar);
  const reduxDispatch = useDispatch();

  const handleCloseSnackbar = () => {
    reduxDispatch(closeMessage());
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalSnackbar />
      <LoadingOverlay />
      <CssBaseline />
      {!(location.pathname === "/") && (
        <Sidenav
          color={sidenavColor}
          brand={heartLogoWhite}
          brandName="Heart2Hub"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}
      <Routes>{getRoutes(routes)}</Routes>
    </ThemeProvider>
  );
}

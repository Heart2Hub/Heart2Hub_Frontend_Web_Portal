import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import store from "store/index";
import { Provider } from "react-redux";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </React.StrictMode>
);

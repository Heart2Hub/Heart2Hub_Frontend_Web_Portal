import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/Layout/MainLayout";
import ErrorPage from "./pages/ErrorPage";
import routes from "./Routes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;

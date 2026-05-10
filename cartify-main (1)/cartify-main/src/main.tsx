import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import AppInitializer from "./AppInitializer";
import { Toaster } from "react-hot-toast";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer />
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </StrictMode>,
);
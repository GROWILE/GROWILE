import { StrictMode } from "react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import LoadingScreen from "../../../packages/ui/src/LoadingScreen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);


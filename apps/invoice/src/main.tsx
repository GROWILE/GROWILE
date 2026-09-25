// Mounts the invoice React app in the page.
import { StrictMode } from "react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LoadingScreen from "../../../packages/ui/src/LoadingScreen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <App />
    </Suspense>
  </StrictMode>,
);

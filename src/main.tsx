import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register SW (respect base)
if ("serviceWorker" in navigator) {
  const url = (import.meta as any).env.BASE_URL + "sw.js";
  navigator.serviceWorker.register(url).catch(() => {});
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Capture PWA install prompt as early as possible
window.notesInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  window.notesInstallPrompt = event;

  console.log("🔥 beforeinstallprompt CAPTURED", event);
});

// Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log(
        "Service Worker registered:",
        registration.scope
      );

      await navigator.serviceWorker.ready;

      console.log("Service Worker ready");

      if (!navigator.serviceWorker.controller) {
        console.log(
          "Reloading once so Service Worker can control the page..."
        );

        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Service Worker registration failed:",
        error
      );
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
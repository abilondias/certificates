import "@lowlighter/matcha/dist/matcha.css"
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { APIContextProvider } from "./contexts/APIClientContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <APIContextProvider>
      <App />
    </APIContextProvider>
  </React.StrictMode>,
);

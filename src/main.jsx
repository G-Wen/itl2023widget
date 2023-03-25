import React from "react";
import ReactDOM from "react-dom/client";
import ITLWidget from "./components/ITLWidget";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ITLWidget />
  </React.StrictMode>
);

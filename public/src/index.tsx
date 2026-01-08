import React from "react";
import { createRoot } from "react-dom/client";
import FinanzasHogarApp from "../App";

const el = document.getElementById("root");
if (!el) throw new Error("No se encontró #root");

createRoot(el).render(
  <React.StrictMode>
    <FinanzasHogarApp />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/index.css";
import "./styles/components/button.css";
import "./styles/components/pokemonCard.css";
import "./styles/components/loginPage.css";
import "./styles/components/tradePage.css";
import "./styles/components/tradeHistory.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

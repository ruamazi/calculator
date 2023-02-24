import React from "react";
//import ReactDOM from "react-dom";
import App from "./src/App.jsx";
import "./style.css";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App tab="home" />);

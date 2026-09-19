import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import "./styles.css";
import DesignsPage from "./page/DesignPage";
import AdminLogin from "./page/AdminLogin";
import AdminDashboard from "./page/AdminDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
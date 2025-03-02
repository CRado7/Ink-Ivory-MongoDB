import React from "react";
import { createRoot } from 'react-dom/client'; // Correct import
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";

// Use createRoot directly
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);



import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TaxDataProvider } from "./context/TaxDataProvider";

createRoot(document.getElementById("root")!).render(
  <TaxDataProvider>
    <App />
  </TaxDataProvider>
);

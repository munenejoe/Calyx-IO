import { createRoot } from "react-dom/client";
import App from "./App";

import "./index.css";
import "./calyx-homepage.css";
import "./styles/theme.css";
import "./styles/glass.css";
import { GlassFilter } from "@/components/ui/GlassFilter";

if (import.meta.env.DEV) {
  import("react-scan").then(({ scan }) => {
    scan({
      enabled: true,
      showToolbar: true,
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <App />
);

export default function Home() {
  return (
    <>
      <GlassFilter />

      {/* rest of homepage */}
    </>
  );
}
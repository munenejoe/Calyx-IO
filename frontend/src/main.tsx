import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./calyx-homepage.css";
// ── CALYX design tokens & glass utilities — loaded globally so every page
// has access to var(--calyx-*) CSS variables and .glass-* utility classes.
import "./styles/theme.css";
import "./styles/glass.css";

createRoot(document.getElementById("root")!).render(<App />);
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Shell } from "./app/Shell";
import { token } from "./core/http";
import { AuthPage } from "./features/auth";
import "./styles.css";

function App() {
  const [authed, setAuthed] = useState(Boolean(token()));
  return authed ? <Shell /> : <AuthPage onAuth={() => setAuthed(true)} />;
}

createRoot(document.getElementById("root")).render(<App />);

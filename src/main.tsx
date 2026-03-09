import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { bootstrapFromRemote } from "./services/remoteContentService";

async function start() {
  await bootstrapFromRemote();
  createRoot(document.getElementById("root")!).render(<App />);
}

start();

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
    <>
        <Helmet>
            <title>Putty to Open SSH Converter</title>
        </Helmet>
        <App />
    </>
);

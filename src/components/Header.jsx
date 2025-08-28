import React from "react";

export default function Header() {
    return (
        <div className="header">
            <h1>Sistema de nutricional de areas verdes</h1>
            <p>Monitoreo completo en tiempo real</p>
            <div
                className={`connection-badge ${connected ? "connected" : "disconnected"}`}
            >
                {connected ? "Conectado" : "Desconectado"}
            </div>
        </div>
    );
}

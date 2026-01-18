"use client";

import { useGame } from "@/lib/game-context";
import { Eye, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function RoleAssignmentView() {
  const { myRole } = useGame();
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    // Brief delay before revealing role for dramatic effect
    const timer = setTimeout(() => setShowRole(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isImpostor = myRole === "IMPOSTOR";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        {!showRole ? (
          <div className="space-y-4 animate-pulse">
            <Loader2 className="w-16 h-16 mx-auto text-muted-foreground animate-spin" />
            <p className="text-xl text-muted-foreground">Asignando roles...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-0 zoom-in-95 duration-500">
            <div
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                isImpostor
                  ? "bg-gradient-to-br from-destructive to-accent"
                  : "bg-gradient-to-br from-primary to-chart-5"
              }`}
            >
              {isImpostor ? (
                <Eye className="w-16 h-16 text-destructive-foreground" />
              ) : (
                <User className="w-16 h-16 text-primary-foreground" />
              )}
            </div>
            <h1
              className={`text-4xl md:text-5xl font-bold text-balance ${
                isImpostor ? "text-destructive" : "text-primary"
              }`}
            >
              {isImpostor ? "Eres el Impostor" : "Eres un Jugador"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              {isImpostor
                ? "Engaña a los demás y no te dejes atrapar"
                : "Encuentra al impostor entre tus amigos"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

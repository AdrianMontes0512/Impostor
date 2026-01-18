"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { Tag, Clock, Send, Check } from "lucide-react";

export function CategoryView() {
  const { myRole, submitCategory } = useGame();
  const [categoryInput, setCategoryInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isImpostor = myRole === "IMPOSTOR";

  const handleSubmit = () => {
    if (categoryInput.trim()) {
      submitCategory(categoryInput.trim());
      setSubmitted(true);
    }
  };

  // Impostor waiting view
  if (isImpostor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
          <CardContent className="py-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <Clock className="w-10 h-10 text-muted-foreground animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Esperando...</h2>
              <p className="text-muted-foreground">
                Los jugadores están eligiendo una categoría
              </p>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Player category input view
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Tag className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Elige una Categoría</CardTitle>
          <CardDescription>
            Escribe una categoría para el juego (ej: Animales, Países, Frutas)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!submitted ? (
            <>
              <Input
                placeholder="Escribe una categoría..."
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="h-12 bg-input border-border text-center text-lg"
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Button
                onClick={handleSubmit}
                disabled={!categoryInput.trim()}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Categoría
              </Button>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Categoría enviada. Esperando a los demás...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

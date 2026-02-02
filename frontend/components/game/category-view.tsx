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

  // Removed Impostor check so everyone can submit a category


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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGame } from "@/lib/game-context";
import { MessageSquare, Clock, Send, Check, AlertTriangle } from "lucide-react";

export function WordView() {
  const { myRole, category, submitWord } = useGame();
  const [wordInput, setWordInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isImpostor = myRole === "IMPOSTOR";

  const handleSubmit = () => {
    if (wordInput.trim()) {
      submitWord(wordInput.trim());
      setSubmitted(true);
    }
  };

  // Impostor waiting view
  if (isImpostor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
          <CardContent className="py-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Categoría</p>
              <h2 className="text-3xl font-bold text-foreground">{category}</h2>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
              <p className="text-muted-foreground">
                Los jugadores están eligiendo la palabra secreta...
              </p>
              <p className="text-accent font-semibold mt-2">
                ¡Prepárate para mentir!
              </p>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-destructive animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Player word input view
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Categoría elegida</p>
            <p className="text-2xl font-bold text-primary">{category}</p>
          </div>
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Elige la Palabra Secreta</CardTitle>
          <CardDescription>
            El impostor NO conocerá esta palabra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!submitted ? (
            <>
              <Input
                placeholder={`Escribe una palabra de ${category}...`}
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                className="h-12 bg-input border-border text-center text-lg"
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Button
                onClick={handleSubmit}
                disabled={!wordInput.trim()}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Palabra
              </Button>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Palabra enviada. Esperando a los demás...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

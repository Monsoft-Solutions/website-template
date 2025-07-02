"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  return (
    <Button size="lg" variant="outline" onClick={() => window.history.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Go Back
    </Button>
  );
}

"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

// Supprimez l'interface vide et utilisez directement le type de base
const Card = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))

Card.displayName = "Card"

export { Card }

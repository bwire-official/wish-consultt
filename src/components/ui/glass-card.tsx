import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        hover && "transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
        className
      )}
    >
      {children}
    </div>
  )
} 
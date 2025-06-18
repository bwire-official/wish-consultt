import { GlobeIcon } from "@/components/ui/globe-icon"

interface StatsCardProps {
  value: string
  label: string
}

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <GlobeIcon className="h-8 w-8 text-primary mb-2" />
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
} 
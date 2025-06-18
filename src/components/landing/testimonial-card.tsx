import { GlobeIcon } from "@/components/ui/globe-icon"

interface TestimonialCardProps {
  name: string
  content: string
}

export function TestimonialCard({ name, content }: TestimonialCardProps) {
  return (
    <div className="flex flex-col p-6 rounded-lg border bg-card">
      <GlobeIcon className="h-8 w-8 text-primary mb-4" />
      <p className="text-muted-foreground mb-4">{content}</p>
      <p className="font-semibold">{name}</p>
    </div>
  )
} 
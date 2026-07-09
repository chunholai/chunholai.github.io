"use client"

import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

function Textarea({
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
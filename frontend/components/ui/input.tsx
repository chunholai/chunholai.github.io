"use client"

import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/lib/utils'

function Input({
  className,
  ...props
}: InputPrimitive.Props) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
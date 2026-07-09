"use client"

import { Dialog } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'

const DialogRoot = Dialog.Root

const DialogTrigger = Dialog.Trigger

const DialogPortal = Dialog.Portal

const DialogBackdrop = Dialog.Backdrop

const DialogClose = Dialog.Close

const DialogViewport = Dialog.Viewport

const DialogTitle = Dialog.Title

const DialogDescription = Dialog.Description

function DialogPopup({
  className,
  ...props
}: Parameters<typeof Dialog.Popup>[0]) {
  return (
    <Dialog.Popup
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-xl",
        className
      )}
      {...props}
    />
  )
}

export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogClose,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
}
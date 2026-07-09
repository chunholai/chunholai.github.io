"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { AppShell } from "@/components/app-shell"

export default function Page() {
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  return <AppShell onLogout={() => setAuthed(false)} />
}

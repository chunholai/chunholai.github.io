"use client"

import { useState } from "react"
import { ShieldCheck, Lock, User, ArrowRight } from "lucide-react"

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("zhangwei@safety.gov.cn")
  const [password, setPassword] = useState("demo1234")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onLogin()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="size-8" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            安全物资仓库台账
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            应急安全物资智能管理系统
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-border bg-card p-8 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">账号</label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-card">
                <User className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="请输入账号邮箱"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">密码</label>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-card">
                <Lock className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99]"
            >
              登录系统
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            演示环境 · 任意账号密码即可进入
          </p>
        </form>
      </div>
    </main>
  )
}

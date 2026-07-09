"use client"

import { UserPlus, Shield, MoreHorizontal, Mail } from "lucide-react"
import { accounts } from "@/lib/mock-data"

export function AccountsView({ notify }: { notify: (msg: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">共 {accounts.length} 个账号</p>
        <button
          onClick={() => notify("新增账号表单已打开（演示）")}
          className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <UserPlus className="size-4" /> 新增账号
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {accounts.map((a) => (
          <div key={a.id} className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-base font-medium text-primary">
                  {a.name.slice(0, 1)}
                </div>
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.department}</p>
                </div>
              </div>
              <button
                onClick={() => notify("账号操作菜单（演示）")}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                <span className="truncate">{a.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="size-4" />
                <span>上次登录 {a.lastLogin}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  a.role === "管理员" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {a.role}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  a.status === "启用" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}
              >
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

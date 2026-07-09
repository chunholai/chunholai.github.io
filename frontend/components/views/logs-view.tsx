"use client"

import { useState } from "react"
import { logs, type LogEntry } from "@/lib/mock-data"

const types: (LogEntry["type"] | "全部")[] = ["全部", "登录", "库存", "账号", "导入导出", "系统"]

const typeTone: Record<LogEntry["type"], string> = {
  登录: "bg-primary/10 text-primary",
  库存: "bg-chart-2/10 text-chart-2",
  账号: "bg-accent text-accent-foreground",
  导入导出: "bg-warning/10 text-warning",
  系统: "bg-secondary text-muted-foreground",
}

export function LogsView() {
  const [filter, setFilter] = useState<(typeof types)[number]>("全部")
  const filtered = filter === "全部" ? logs : logs.filter((l) => l.type === filter)

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              filter === t
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="divide-y divide-border">
          {filtered.map((l) => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-muted-foreground">
                {l.actor.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{l.actor}</span>
                  <span className="text-muted-foreground"> {l.action}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">{l.target}</p>
              </div>
              <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline ${typeTone[l.type]}`}>
                {l.type}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

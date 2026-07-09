"use client"

import { Boxes, TriangleAlert, ClipboardList, ArrowDownToLine, TrendingUp, ArrowUpRight } from "lucide-react"
import { materials, trendStats, categoryStats, logs } from "@/lib/mock-data"

const stats = [
  { label: "物资总数", value: "194", unit: "件", icon: Boxes, trend: "+12", tone: "text-primary bg-primary/10" },
  { label: "库存预警", value: "4", unit: "项", icon: TriangleAlert, trend: "需处理", tone: "text-warning bg-warning/10" },
  { label: "今日领用", value: "6", unit: "笔", icon: ClipboardList, trend: "+2", tone: "text-chart-2 bg-chart-2/10" },
  { label: "本月入库", value: "80", unit: "件", icon: ArrowDownToLine, trend: "+34%", tone: "text-primary bg-primary/10" },
]

export function DashboardView({ onNavigate }: { onNavigate: (key: string) => void }) {
  const maxTrend = Math.max(...trendStats.flatMap((d) => [d.入库, d.领用]))
  const maxCat = Math.max(...categoryStats.map((c) => c.value))

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-3xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-2xl ${s.tone}`}>
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.trend}</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold tracking-tight">{s.value}</span>
                <span className="ml-1 text-sm text-muted-foreground">{s.unit}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Trend chart */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">出入库趋势</h2>
              <p className="text-sm text-muted-foreground">近 6 个月</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />入库
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-chart-2" />领用
              </span>
            </div>
          </div>
          <div className="flex h-52 items-end justify-between gap-4">
            {trendStats.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-44 w-full items-end justify-center gap-1.5">
                  <div
                    className="w-1/2 max-w-6 rounded-t-md bg-primary transition-all"
                    style={{ height: `${(d.入库 / maxTrend) * 100}%` }}
                    title={`入库 ${d.入库}`}
                  />
                  <div
                    className="w-1/2 max-w-6 rounded-t-md bg-chart-2 transition-all"
                    style={{ height: `${(d.领用 / maxTrend) * 100}%` }}
                    title={`领用 ${d.领用}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category distribution */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="mb-6 text-base font-semibold">分类库存分布</h2>
          <div className="space-y-4">
            {categoryStats.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.name}</span>
                  <span className="font-medium text-muted-foreground">{c.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(c.value / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Recent activity */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">最近动态</h2>
            <button
              onClick={() => onNavigate("logs")}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
            >
              查看全部 <ArrowUpRight className="size-4" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {logs.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center gap-3 py-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-muted-foreground">
                  {l.actor.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{l.actor}</span>
                    <span className="text-muted-foreground"> · {l.action}</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{l.target}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{l.time.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts preview */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-warning" />
            <h2 className="text-base font-semibold">需关注物资</h2>
          </div>
          <div className="space-y-3">
            {materials
              .filter((m) => m.status !== "正常")
              .slice(0, 4)
              .map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">库存 {m.quantity} {m.unit}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      m.status === "已过期"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

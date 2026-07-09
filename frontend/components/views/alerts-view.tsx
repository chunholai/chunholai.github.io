"use client"

import { TriangleAlert, PackageMinus, CalendarClock, XCircle } from "lucide-react"
import { materials } from "@/lib/mock-data"

export function AlertsView() {
  const lowStock = materials.filter((m) => m.status === "低库存")
  const expiring = materials.filter((m) => m.status === "临期")
  const expired = materials.filter((m) => m.status === "已过期")

  const summary = [
    { label: "低库存", count: lowStock.length, icon: PackageMinus, tone: "text-warning bg-warning/10" },
    { label: "临期预警", count: expiring.length, icon: CalendarClock, tone: "text-warning bg-warning/10" },
    { label: "已过期", count: expired.length, icon: XCircle, tone: "text-destructive bg-destructive/10" },
  ]

  const groups = [
    { title: "低库存物资", desc: "库存量已低于安全阈值，建议尽快补充", items: lowStock, danger: false },
    { title: "临期物资", desc: "临近有效期，请安排检查或更换", items: expiring, danger: false },
    { title: "已过期物资", desc: "已超过有效期，必须立即下架处理", items: expired, danger: true },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {summary.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-3xl border border-border bg-card p-5">
              <div className={`flex size-10 items-center justify-center rounded-2xl ${s.tone}`}>
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-3xl font-semibold">{s.count}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </div>

      {groups.map((g) => (
        <div key={g.title} className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-start gap-3">
            <TriangleAlert className={`mt-0.5 size-5 ${g.danger ? "text-destructive" : "text-warning"}`} />
            <div>
              <h2 className="text-base font-semibold">{g.title}</h2>
              <p className="text-sm text-muted-foreground">{g.desc}</p>
            </div>
          </div>
          {g.items.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">暂无相关物资</p>
          ) : (
            <div className="divide-y divide-border">
              {g.items.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.code} · 库位 {m.location} · 有效期 {m.expiry}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-semibold ${g.danger ? "text-destructive" : "text-warning"}`}>
                      {m.quantity} {m.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">阈值 {m.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

"use client"

import { Plus, Download, ArrowDownToLine } from "lucide-react"
import { inboundRecords } from "@/lib/mock-data"

export function InboundView({ notify }: { notify: (msg: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">共 {inboundRecords.length} 笔入库记录</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => notify("入库记录已导出（演示）")}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" /> <span className="hidden sm:inline">导出</span>
          </button>
          <button
            onClick={() => notify("入库登记表单已打开（演示）")}
            className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" /> 入库登记
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {inboundRecords.map((r) => (
          <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ArrowDownToLine className="size-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2">
                <p className="font-medium">{r.name}</p>
                <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                供应商 {r.supplier} · 批号 {r.batch}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                经办 {r.operator} · {r.time}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm">经办 {r.operator}</p>
              <p className="text-xs text-muted-foreground">{r.time}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-semibold text-primary">+{r.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

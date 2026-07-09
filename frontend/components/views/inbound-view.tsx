"use client"

import { useState } from "react"
import { Plus, Download, ArrowDownToLine } from "lucide-react"
import { inboundRecords, materials } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogPortal, DialogBackdrop, DialogViewport, DialogPopup, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function InboundView({ notify, scannedMaterial }: { notify: (msg: string) => void; scannedMaterial?: { code: string; name: string } | null }) {
  const [showInboundDialog, setShowInboundDialog] = useState(false)

  const [inboundForm, setInboundForm] = useState({
    materialId: "",
    quantity: "",
    operator: "",
    remark: "",
  })

  if (scannedMaterial && !showInboundDialog) {
    const material = materials.find((m) => m.code === scannedMaterial.code || m.id === scannedMaterial.code)
    if (material) {
      setInboundForm({
        materialId: material.id,
        quantity: "",
        operator: "",
        remark: "",
      })
      setShowInboundDialog(true)
    }
  }

  const handleInboundSubmit = () => {
    const selectedMaterial = materials.find((m) => m.id === inboundForm.materialId)
    console.log("入库登记表单内容:", {
      ...inboundForm,
      materialName: selectedMaterial?.name || "",
      materialCode: selectedMaterial?.code || "",
    })
    notify("入库登记已提交（演示）")
    setInboundForm({ materialId: "", quantity: "", operator: "", remark: "" })
    setShowInboundDialog(false)
  }

  const handleExport = () => {
    const exportData = inboundRecords.map((r) => ({
      编码: r.code,
      名称: r.name,
      供应商: r.supplier,
      批号: r.batch,
      数量: r.quantity,
      经办人: r.operator,
      时间: r.time,
    }))

    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(","))
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "入库记录.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("导出数据:", exportData)
    notify("入库记录已导出为 CSV 文件（演示）")
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">共 {inboundRecords.length} 笔入库记录</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" /> <span className="hidden sm:inline">导出</span>
          </button>

          <Dialog open={showInboundDialog} onOpenChange={setShowInboundDialog}>
            <DialogTrigger>
              <button
                className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" /> 入库登记
              </button>
            </DialogTrigger>
            <DialogPortal>
              <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
              <DialogViewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPopup>
                  <DialogTitle className="text-base font-semibold">入库登记</DialogTitle>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">选择物资</label>
                      <select
                        value={inboundForm.materialId}
                        onChange={(e) => setInboundForm({ ...inboundForm, materialId: e.target.value })}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                      >
                        <option value="">请选择物资</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">入库数量</label>
                      <Input
                        value={inboundForm.quantity}
                        onChange={(e) => setInboundForm({ ...inboundForm, quantity: e.target.value })}
                        type="number"
                        placeholder="请输入入库数量"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">入库人员</label>
                      <Input
                        value={inboundForm.operator}
                        onChange={(e) => setInboundForm({ ...inboundForm, operator: e.target.value })}
                        placeholder="请输入入库人员"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">备注</label>
                      <Textarea
                        value={inboundForm.remark}
                        onChange={(e) => setInboundForm({ ...inboundForm, remark: e.target.value })}
                        placeholder="请输入备注信息"
                      />
                    </div>
                    <div className="flex gap-3">
                      <DialogClose>
                        <Button variant="outline" className="flex-1">取消</Button>
                      </DialogClose>
                      <Button onClick={handleInboundSubmit} className="flex-1">确认入库</Button>
                    </div>
                  </div>
                </DialogPopup>
              </DialogViewport>
            </DialogPortal>
          </Dialog>
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
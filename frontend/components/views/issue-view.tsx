"use client"

import { useState } from "react"
import { Plus, Download, ClipboardList } from "lucide-react"
import { issueRecords, materials, currentUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogPortal, DialogBackdrop, DialogViewport, DialogPopup, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function IssueView({ notify }: { notify: (msg: string) => void }) {
  const [showIssueDialog, setShowIssueDialog] = useState(false)

  const [issueForm, setIssueForm] = useState({
    materialId: "",
    quantity: "",
    receiver: currentUser.name,
    purpose: "",
    remark: "",
  })

  const handleIssueSubmit = () => {
    const selectedMaterial = materials.find((m) => m.id === issueForm.materialId)
    console.log("领用登记表单内容:", {
      ...issueForm,
      materialName: selectedMaterial?.name || "",
      materialCode: selectedMaterial?.code || "",
    })
    notify("领用登记已提交（演示）")
    setIssueForm({ materialId: "", quantity: "", receiver: currentUser.name, purpose: "", remark: "" })
    setShowIssueDialog(false)
  }

  const handleExport = () => {
    const exportData = issueRecords.map((r) => ({
      编码: r.code,
      名称: r.name,
      数量: r.quantity,
      领用人: r.receiver,
      用途: r.purpose,
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
    link.setAttribute("download", "领用记录.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("导出数据:", exportData)
    notify("领用记录已导出为 CSV 文件（演示）")
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">共 {issueRecords.length} 笔领用记录</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" /> <span className="hidden sm:inline">导出</span>
          </button>

          <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
            <DialogTrigger>
              <button
                className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" /> 领用登记
              </button>
            </DialogTrigger>
            <DialogPortal>
              <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
              <DialogViewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPopup>
                  <DialogTitle className="text-base font-semibold">领用登记</DialogTitle>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">选择物资</label>
                      <select
                        value={issueForm.materialId}
                        onChange={(e) => setIssueForm({ ...issueForm, materialId: e.target.value })}
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
                      <label className="mb-2 block text-sm font-medium">领用数量</label>
                      <Input
                        value={issueForm.quantity}
                        onChange={(e) => setIssueForm({ ...issueForm, quantity: e.target.value })}
                        type="number"
                        placeholder="请输入领用数量"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">领用人员</label>
                      <Input
                        value={issueForm.receiver}
                        disabled
                        className="cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">领用用途</label>
                      <Input
                        value={issueForm.purpose}
                        onChange={(e) => setIssueForm({ ...issueForm, purpose: e.target.value })}
                        placeholder="请输入领用用途"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">备注</label>
                      <Textarea
                        value={issueForm.remark}
                        onChange={(e) => setIssueForm({ ...issueForm, remark: e.target.value })}
                        placeholder="请输入备注信息"
                      />
                    </div>
                    <div className="flex gap-3">
                      <DialogClose>
                        <Button variant="outline" className="flex-1">取消</Button>
                      </DialogClose>
                      <Button onClick={handleIssueSubmit} className="flex-1">确认领用</Button>
                    </div>
                  </div>
                </DialogPopup>
              </DialogViewport>
            </DialogPortal>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {issueRecords.map((r) => (
          <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-chart-2/10 text-chart-2">
              <ClipboardList className="size-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2">
                <p className="font-medium">{r.name}</p>
                <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                领用 {r.receiver} · {r.purpose}
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
              <p className="text-lg font-semibold text-chart-2">-{r.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
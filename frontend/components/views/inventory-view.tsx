"use client"

import { useState, useMemo } from "react"
import { Upload, Download, Search, Plus, Filter } from "lucide-react"
import { materials, statusColor, type MaterialStatus } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogPortal, DialogBackdrop, DialogViewport, DialogPopup, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"

const categories = ["全部", "呼吸防护", "消防器材", "防护用品", "应急装备", "医疗急救"]

export function InventoryView({ notify }: { notify: (msg: string) => void }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("全部")

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    spec: "",
    quantity: "",
    location: "",
    remark: "",
  })

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchQuery =
        m.name.includes(query) || m.code.toLowerCase().includes(query.toLowerCase())
      const matchCat = category === "全部" || m.category === category
      return matchQuery && matchCat
    })
  }, [query, category])

  const handleAddMaterial = () => {
    console.log("新增物资表单内容:", newMaterial)
    notify("新增物资表单已提交（演示）")
    setNewMaterial({ name: "", spec: "", quantity: "", location: "", remark: "" })
    setShowAddDialog(false)
  }

  const handleImport = () => {
    console.log("导入文件（演示）")
    notify("文件导入功能已触发（演示）")
    setShowImportDialog(false)
  }

  const handleExport = () => {
    const exportData = materials.map((m) => ({
      编码: m.code,
      名称: m.name,
      规格: m.spec,
      分类: m.category,
      库存: m.quantity,
      单位: m.unit,
      阈值: m.threshold,
      库位: m.location,
      有效期: m.expiry,
      状态: m.status,
    }))

    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(","))
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "物资台账.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("导出数据:", exportData)
    notify("台账已导出为 CSV 文件（演示）")
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索名称或编码"
              className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-56"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger>
              <button
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Upload className="size-4" /> <span className="hidden sm:inline">导入</span>
              </button>
            </DialogTrigger>
            <DialogPortal>
              <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
              <DialogViewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPopup>
                  <DialogTitle className="text-base font-semibold">导入台账数据</DialogTitle>
                  <div className="mt-4 space-y-4">
                    <FileUpload />
                    <div className="flex gap-3">
                      <DialogClose>
                        <Button variant="outline" className="flex-1">取消</Button>
                      </DialogClose>
                      <Button onClick={handleImport} className="flex-1">确认导入</Button>
                    </div>
                  </div>
                </DialogPopup>
              </DialogViewport>
            </DialogPortal>
          </Dialog>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" /> <span className="hidden sm:inline">导出</span>
          </button>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger>
              <button
                className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" /> <span className="hidden sm:inline">新增物资</span>
              </button>
            </DialogTrigger>
            <DialogPortal>
              <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
              <DialogViewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPopup>
                  <DialogTitle className="text-base font-semibold">新增物资</DialogTitle>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">物资名称</label>
                      <Input
                        value={newMaterial.name}
                        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                        placeholder="请输入物资名称"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">规格</label>
                      <Input
                        value={newMaterial.spec}
                        onChange={(e) => setNewMaterial({ ...newMaterial, spec: e.target.value })}
                        placeholder="请输入规格"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">数量</label>
                      <Input
                        value={newMaterial.quantity}
                        onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                        type="number"
                        placeholder="请输入数量"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">存放位置</label>
                      <Input
                        value={newMaterial.location}
                        onChange={(e) => setNewMaterial({ ...newMaterial, location: e.target.value })}
                        placeholder="请输入存放位置"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">备注</label>
                      <Textarea
                        value={newMaterial.remark}
                        onChange={(e) => setNewMaterial({ ...newMaterial, remark: e.target.value })}
                        placeholder="请输入备注信息"
                      />
                    </div>
                    <div className="flex gap-3">
                      <DialogClose>
                        <Button variant="outline" className="flex-1">取消</Button>
                      </DialogClose>
                      <Button onClick={handleAddMaterial} className="flex-1">确认新增</Button>
                    </div>
                  </div>
                </DialogPopup>
              </DialogViewport>
            </DialogPortal>
          </Dialog>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="size-4 shrink-0 text-muted-foreground" />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              category === c
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((m) => (
          <div key={m.id} className="rounded-3xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium leading-tight">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">{m.spec}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{m.code}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor[m.status as MaterialStatus]}`}
              >
                {m.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-2 border-t border-border pt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">分类</p>
                <p>{m.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">库存</p>
                <p>
                  <span className="font-medium">{m.quantity}</span>
                  <span className="text-xs text-muted-foreground"> / 阈值 {m.threshold} {m.unit}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">库位</p>
                <p>{m.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">有效期</p>
                <p>{m.expiry}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
            未找到匹配的物资
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl border border-border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">编码</th>
                <th className="px-5 py-3.5 font-medium">名称 / 规格</th>
                <th className="px-5 py-3.5 font-medium">分类</th>
                <th className="px-5 py-3.5 font-medium">库存</th>
                <th className="px-5 py-3.5 font-medium">库位</th>
                <th className="px-5 py-3.5 font-medium">有效期</th>
                <th className="px-5 py-3.5 font-medium">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-secondary/50">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{m.code}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.spec}</p>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{m.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium">{m.quantity}</span>
                    <span className="text-xs text-muted-foreground"> / 阈值 {m.threshold} {m.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{m.location}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{m.expiry}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor[m.status as MaterialStatus]}`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    未找到匹配的物资
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">共 {filtered.length} 条物资记录</p>
    </div>
  )
}
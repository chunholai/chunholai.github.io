"use client"

import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Download, Printer, QrCode } from "lucide-react"
import { materials } from "@/lib/mock-data"

export function QrcodeView() {
  const [selectedId, setSelectedId] = useState(materials[0].id)
  const selected = materials.find((m) => m.id === selectedId)!

  const payload = JSON.stringify({
    code: selected.code,
    name: selected.name,
    spec: selected.spec,
    location: selected.location,
    batch: selected.batch,
  })

  function downloadQR() {
    const canvas = document.querySelector("#material-qr canvas") as HTMLCanvasElement | null
    if (!canvas) return
    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `${selected.code}-二维码.png`
    a.click()
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-5">
      {/* Material list */}
      <div className="rounded-3xl border border-border bg-card p-4 lg:col-span-2">
        <p className="px-2 pb-3 text-sm font-medium text-muted-foreground">选择物资生成二维码</p>
        <div className="max-h-[520px] space-y-1 overflow-y-auto">
          {materials.map((m) => {
            const active = m.id === selectedId
            return (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                  active ? "bg-primary/10" : "hover:bg-secondary"
                }`}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <QrCode className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{m.code}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* QR preview */}
      <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
        <div className="flex flex-col items-center">
          <div id="material-qr" className="rounded-3xl border border-border bg-background p-6">
            <QRCodeCanvas value={payload} size={200} level="M" marginSize={2} />
          </div>

          <div className="mt-6 w-full max-w-sm space-y-2.5 text-sm">
            <Row label="物资编码" value={selected.code} />
            <Row label="物资名称" value={selected.name} />
            <Row label="规格型号" value={selected.spec} />
            <Row label="存放库位" value={selected.location} />
            <Row label="批号" value={selected.batch} />
          </div>

          <div className="mt-6 flex w-full max-w-sm gap-2">
            <button
              onClick={downloadQR}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="size-4" /> 下载二维码
            </button>
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Printer className="size-4" /> 打印标签
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

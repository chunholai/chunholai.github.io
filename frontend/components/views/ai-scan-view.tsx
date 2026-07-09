"use client"

import { useState, useRef } from "react"
import { ScanLine, ImagePlus, Sparkles, Check, RotateCcw } from "lucide-react"

type Recognized = {
  name: string
  category: string
  spec: string
  quantity: string
  unit: string
}

const mockResults: Recognized[] = [
  { name: "正压式空气呼吸器", category: "呼吸防护", spec: "6.8L 碳纤维瓶", quantity: "8", unit: "套" },
  { name: "干粉灭火器", category: "消防器材", spec: "4kg ABC", quantity: "15", unit: "具" },
  { name: "医用防护口罩 N95", category: "防护用品", spec: "独立包装", quantity: "20", unit: "盒" },
]

export function AiScanView({ notify }: { notify: (msg: string) => void }) {
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<Recognized | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImage(url)
    setResult(null)
    runScan()
  }

  function runScan() {
    setScanning(true)
    setResult(null)
    window.setTimeout(() => {
      setResult(mockResults[Math.floor(Math.random() * mockResults.length)])
      setScanning(false)
    }, 1400)
  }

  function reset() {
    setImage(null)
    setResult(null)
    setScanning(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-2">
      {/* Upload zone */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <ScanLine className="size-5 text-primary" />
          <h2 className="text-base font-semibold">拍照 / 上传识别</h2>
        </div>

        <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />

        {!image ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary hover:bg-secondary"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-card">
              <ImagePlus className="size-6" strokeWidth={1.75} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">点击拍照或上传物资照片</p>
              <p className="mt-1 text-xs">支持 JPG / PNG · 自动识别名称与数量</p>
            </div>
          </button>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image || "/placeholder.svg"} alt="待识别物资" className="size-full object-cover" />
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Sparkles className="size-6 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium">AI 识别中…</p>
                </div>
              </div>
            )}
            <button
              onClick={reset}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium backdrop-blur"
            >
              <RotateCcw className="size-3.5" /> 重新上传
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-base font-semibold">识别结果</h2>
        </div>

        {!result ? (
          <div className="flex h-[calc(100%-2.5rem)] min-h-64 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              {scanning ? "正在解析图片信息…" : "上传物资照片后，识别结果将自动填入下方表单"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="物资名称" value={result.name} />
            <Field label="分类" value={result.category} />
            <Field label="规格型号" value={result.spec} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="数量" value={result.quantity} />
              <Field label="单位" value={result.unit} />
            </div>
            <button
              onClick={() => {
                notify("已录入物资台账（演示）")
                reset()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Check className="size-4" /> 确认录入台账
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium">{value}</div>
    </div>
  )
}

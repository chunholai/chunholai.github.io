"use client"

import { useState, useCallback } from "react"
import {
  LayoutDashboard,
  Boxes,
  ArrowDownToLine,
  ClipboardList,
  TriangleAlert,
  QrCode,
  MessageSquareText,
  ScanLine,
  ScrollText,
  Users,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronDown,
  CheckCircle2,
} from "lucide-react"
import { currentUser } from "@/lib/mock-data"
import { DashboardView } from "@/components/views/dashboard-view"
import { InventoryView } from "@/components/views/inventory-view"
import { InboundView } from "@/components/views/inbound-view"
import { IssueView } from "@/components/views/issue-view"
import { AlertsView } from "@/components/views/alerts-view"
import { QrcodeView } from "@/components/views/qrcode-view"
import { AiChatView } from "@/components/views/ai-chat-view"
import { AiScanView } from "@/components/views/ai-scan-view"
import { LogsView } from "@/components/views/logs-view"
import { AccountsView } from "@/components/views/accounts-view"
import { Dialog, DialogTrigger, DialogPortal, DialogBackdrop, DialogViewport, DialogPopup, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { QrScanner } from "@/components/ui/qr-scanner"
import { getMaterialByCode } from "@/lib/api"

type ViewKey =
  | "dashboard"
  | "inventory"
  | "inbound"
  | "issue"
  | "alerts"
  | "qrcode"
  | "chat"
  | "scan"
  | "logs"
  | "accounts"

const navGroups: { label: string; items: { key: ViewKey; name: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    label: "总览",
    items: [
      { key: "dashboard", name: "首页", icon: LayoutDashboard },
      { key: "alerts", name: "库存预警", icon: TriangleAlert },
    ],
  },
  {
    label: "台账管理",
    items: [
      { key: "inventory", name: "物资台账", icon: Boxes },
      { key: "inbound", name: "入库记录", icon: ArrowDownToLine },
      { key: "issue", name: "领用记录", icon: ClipboardList },
      { key: "qrcode", name: "二维码管理", icon: QrCode },
    ],
  },
  {
    label: "智能助手",
    items: [
      { key: "chat", name: "AI 对话", icon: MessageSquareText },
      { key: "scan", name: "AI 识别录入", icon: ScanLine },
    ],
  },
  {
    label: "系统",
    items: [
      { key: "logs", name: "操作日志", icon: ScrollText },
      { key: "accounts", name: "账号管理", icon: Users },
    ],
  },
]

const titles: Record<ViewKey, string> = {
  dashboard: "首页",
  inventory: "物资台账",
  inbound: "入库记录",
  issue: "领用记录",
  alerts: "库存预警",
  qrcode: "二维码管理",
  chat: "AI 对话",
  scan: "AI 识别录入",
  logs: "操作日志",
  accounts: "账号管理",
}

export function AppShell({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<ViewKey>("dashboard")
  const [toast, setToast] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showScanDialog, setShowScanDialog] = useState(false)
  const [scannedMaterial, setScannedMaterial] = useState<{ code: string; name: string } | null>(null)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  function handleRefresh() {
    setRefreshing(true)
    window.setTimeout(() => {
      setRefreshing(false)
      notify("数据已刷新")
    }, 800)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">物资台账</p>
            <p className="text-xs text-muted-foreground">安全应急管理</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = view === item.key
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      onClick={() => setView(item.key)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" strokeWidth={active ? 2 : 1.75} />
                      {item.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {currentUser.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-5 py-3.5 backdrop-blur-xl sm:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">{titles[view]}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
              <DialogTrigger>
                <button
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <ScanLine className="size-4" />
                  <span className="hidden sm:inline">扫一扫</span>
                </button>
              </DialogTrigger>
              <DialogPortal>
                <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
                <DialogViewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <DialogPopup className="max-w-lg w-full">
                    <DialogTitle className="text-base font-semibold">扫码入库</DialogTitle>
                    <div className="mt-4">
                      <QrScanner
                        onScanSuccess={async (code) => {
                          console.log("扫描到二维码:", code)
                          notify(`识别到物资编码: ${code}`)
                          
                          const material = await getMaterialByCode(code)
                          if (material) {
                            setScannedMaterial({ code: material.code, name: material.name })
                            setShowScanDialog(false)
                            notify(`找到物资: ${material.name}`)
                            setView("inbound")
                          } else {
                            notify(`未找到编码为 ${code} 的物资`)
                          }
                        }}
                        onScanError={(error) => {
                          console.error("扫码错误:", error)
                          notify("扫码失败，请重试")
                        }}
                        onClose={() => setShowScanDialog(false)}
                      />
                    </div>
                  </DialogPopup>
                </DialogViewport>
              </DialogPortal>
            </Dialog>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">刷新</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:bg-secondary"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {currentUser.name.slice(0, 1)}
                </div>
                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.department}</p>
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lg">
                    <div className="border-b border-border px-3 py-3">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
                      <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {currentUser.role}
                      </span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      退出账号
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2 lg:hidden">
          {navGroups.flatMap((g) => g.items).map((item) => {
            const active = view === item.key
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-4" />
                {item.name}
              </button>
            )
          })}
        </div>

        <main className="flex-1 px-5 py-6 sm:px-8">
          {view === "dashboard" && <DashboardView onNavigate={(k) => setView(k as ViewKey)} />}
          {view === "inventory" && <InventoryView notify={notify} />}
          {view === "inbound" && <InboundView notify={notify} scannedMaterial={scannedMaterial} />}
          {view === "issue" && <IssueView notify={notify} />}
          {view === "alerts" && <AlertsView />}
          {view === "qrcode" && <QrcodeView />}
          {view === "chat" && <AiChatView />}
          {view === "scan" && <AiScanView notify={notify} />}
          {view === "logs" && <LogsView />}
          {view === "accounts" && <AccountsView notify={notify} />}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-border bg-popover px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="size-5 text-success" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  )
}

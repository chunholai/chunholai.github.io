"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Bot } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }

const suggestions = [
  "干粉灭火器还剩多少？",
  "哪些物资即将过期？",
  "本月领用最多的物资是什么？",
  "查询防化服的存放库位",
]

const cannedReplies: Record<string, string> = {
  灭火器: "当前「干粉灭火器（4kg ABC）」库存为 12 具，已低于安全阈值 30 具，建议尽快补充。存放于 A区-02-01。",
  过期: "目前有 1 项已过期物资：防化服（全封闭 B级），有效期至 2026-06-20，已超期，请立即下架处理。另有 2 项临期物资需关注：N95 口罩、防毒面具滤毒罐。",
  领用: "本月领用最多的是「干粉灭火器」，共领用 6 具，主要用于月度消防检查更换。",
  防化服: "「防化服（全封闭 B级）」存放于 C区-01-01，当前库存 5 套，批号 B2022-06，状态：已过期，建议停止领用。",
}

function getReply(text: string): string {
  for (const key of Object.keys(cannedReplies)) {
    if (text.includes(key)) return cannedReplies[key]
  }
  return "我是仓库智能助手，可以帮你查询库存数量、有效期、库位、出入库与领用记录等信息。你可以试着问我「哪些物资即将过期」或「某某物资还剩多少」。"
}

export function AiChatView() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好，我是安全物资仓库智能助手。可以帮你快速查询库存、预警和出入库情况，有什么可以帮你？" },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  function send(text: string) {
    const content = text.trim()
    if (!content || typing) return
    setMessages((m) => [...m, { role: "user", content }])
    setInput("")
    setTyping(true)
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: getReply(content) }])
      setTyping(false)
    }, 900)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col rounded-3xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-semibold">仓库智能助手</p>
          <p className="text-xs text-muted-foreground">基于台账数据的问答（演示）</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="size-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3.5">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3 sm:px-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2 focus-within:border-primary focus-within:bg-card">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) send(input)
            }}
            placeholder="输入你的问题…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

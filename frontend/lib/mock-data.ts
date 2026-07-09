export type Role = "管理员" | "操作员"

export type Account = {
  id: string
  name: string
  email: string
  role: Role
  department: string
  status: "启用" | "停用"
  lastLogin: string
}

export type MaterialStatus = "正常" | "低库存" | "临期" | "已过期"

export type Material = {
  id: string
  code: string
  name: string
  category: string
  spec: string
  unit: string
  quantity: number
  threshold: number
  location: string
  batch: string
  expiry: string
  status: MaterialStatus
}

export type InboundRecord = {
  id: string
  code: string
  name: string
  quantity: number
  batch: string
  supplier: string
  operator: string
  time: string
}

export type IssueRecord = {
  id: string
  code: string
  name: string
  quantity: number
  receiver: string
  purpose: string
  operator: string
  time: string
}

export type LogEntry = {
  id: string
  actor: string
  action: string
  target: string
  time: string
  type: "登录" | "库存" | "账号" | "导入导出" | "系统"
}

export const currentUser: Account = {
  id: "u-001",
  name: "张伟",
  email: "zhangwei@safety.gov.cn",
  role: "管理员",
  department: "应急管理科",
  status: "启用",
  lastLogin: "2026-07-09 08:32",
}

export const materials: Material[] = [
  { id: "m1", code: "AQ-2001", name: "正压式空气呼吸器", category: "呼吸防护", spec: "6.8L 碳纤维瓶", unit: "套", quantity: 42, threshold: 20, location: "A区-01-03", batch: "B2024-08", expiry: "2027-08-01", status: "正常" },
  { id: "m2", code: "AQ-2002", name: "干粉灭火器", category: "消防器材", spec: "4kg ABC", unit: "具", quantity: 12, threshold: 30, location: "A区-02-01", batch: "B2023-11", expiry: "2026-11-01", status: "低库存" },
  { id: "m3", code: "AQ-2003", name: "医用防护口罩 N95", category: "防护用品", spec: "独立包装", unit: "盒", quantity: 8, threshold: 15, location: "B区-01-05", batch: "B2024-02", expiry: "2026-08-15", status: "临期" },
  { id: "m4", code: "AQ-2004", name: "应急照明灯", category: "应急装备", spec: "LED 便携式", unit: "台", quantity: 66, threshold: 20, location: "B区-03-02", batch: "B2025-01", expiry: "2030-01-01", status: "正常" },
  { id: "m5", code: "AQ-2005", name: "防化服", category: "防护用品", spec: "全封闭 B级", unit: "套", quantity: 5, threshold: 10, location: "C区-01-01", batch: "B2022-06", expiry: "2026-06-20", status: "已过期" },
  { id: "m6", code: "AQ-2006", name: "急救包", category: "医疗急救", spec: "综合型 30件", unit: "个", quantity: 34, threshold: 15, location: "B区-02-04", batch: "B2024-09", expiry: "2027-09-01", status: "正常" },
  { id: "m7", code: "AQ-2007", name: "安全绳", category: "应急装备", spec: "直径12mm 30m", unit: "条", quantity: 18, threshold: 10, location: "C区-02-03", batch: "B2024-05", expiry: "2029-05-01", status: "正常" },
  { id: "m8", code: "AQ-2008", name: "防毒面具滤毒罐", category: "呼吸防护", spec: "3号综合型", unit: "个", quantity: 9, threshold: 20, location: "A区-01-06", batch: "B2023-08", expiry: "2026-08-10", status: "低库存" },
]

export const inboundRecords: InboundRecord[] = [
  { id: "in1", code: "AQ-2004", name: "应急照明灯", quantity: 30, batch: "B2025-01", supplier: "华安应急设备有限公司", operator: "张伟", time: "2026-07-08 14:20" },
  { id: "in2", code: "AQ-2001", name: "正压式空气呼吸器", quantity: 12, batch: "B2024-08", supplier: "安捷防护科技", operator: "李娜", time: "2026-07-06 10:05" },
  { id: "in3", code: "AQ-2006", name: "急救包", quantity: 20, batch: "B2024-09", supplier: "康明医疗器械", operator: "张伟", time: "2026-07-03 09:40" },
  { id: "in4", code: "AQ-2007", name: "安全绳", quantity: 18, batch: "B2024-05", supplier: "恒力安全用品", operator: "王强", time: "2026-06-28 16:15" },
]

export const issueRecords: IssueRecord[] = [
  { id: "is1", code: "AQ-2002", name: "干粉灭火器", quantity: 6, receiver: "生产一车间", purpose: "月度消防检查更换", operator: "李娜", time: "2026-07-09 09:12" },
  { id: "is2", code: "AQ-2003", name: "医用防护口罩 N95", quantity: 4, receiver: "巡检班组", purpose: "现场作业防护", operator: "王强", time: "2026-07-08 15:30" },
  { id: "is3", code: "AQ-2005", name: "防化服", quantity: 2, receiver: "危化品处置组", purpose: "应急演练", operator: "张伟", time: "2026-07-07 11:00" },
  { id: "is4", code: "AQ-2001", name: "正压式空气呼吸器", quantity: 3, receiver: "消防应急队", purpose: "受限空间作业", operator: "李娜", time: "2026-07-05 08:50" },
]

export const accounts: Account[] = [
  currentUser,
  { id: "u-002", name: "李娜", email: "lina@safety.gov.cn", role: "操作员", department: "仓储管理科", status: "启用", lastLogin: "2026-07-09 07:58" },
  { id: "u-003", name: "王强", email: "wangqiang@safety.gov.cn", role: "操作员", department: "巡检班组", status: "启用", lastLogin: "2026-07-08 17:22" },
  { id: "u-004", name: "赵敏", email: "zhaomin@safety.gov.cn", role: "操作员", department: "应急管理科", status: "停用", lastLogin: "2026-06-30 09:10" },
]

export const logs: LogEntry[] = [
  { id: "l1", actor: "李娜", action: "领用出库", target: "干粉灭火器 x6", time: "2026-07-09 09:12", type: "库存" },
  { id: "l2", actor: "张伟", action: "登录系统", target: "IP 10.12.3.44", time: "2026-07-09 08:32", type: "登录" },
  { id: "l3", actor: "王强", action: "导出台账", target: "全量物资 Excel", time: "2026-07-08 17:40", type: "导入导出" },
  { id: "l4", actor: "张伟", action: "新增账号", target: "赵敏 / 操作员", time: "2026-07-08 16:05", type: "账号" },
  { id: "l5", actor: "李娜", action: "入库登记", target: "应急照明灯 x30", time: "2026-07-08 14:20", type: "库存" },
  { id: "l6", actor: "系统", action: "库存预警", target: "干粉灭火器 低于阈值", time: "2026-07-08 00:00", type: "系统" },
]

export const categoryStats = [
  { name: "呼吸防护", value: 51 },
  { name: "消防器材", value: 12 },
  { name: "防护用品", value: 13 },
  { name: "应急装备", value: 84 },
  { name: "医疗急救", value: 34 },
]

export const trendStats = [
  { month: "2月", 入库: 40, 领用: 24 },
  { month: "3月", 入库: 30, 领用: 42 },
  { month: "4月", 入库: 55, 领用: 38 },
  { month: "5月", 入库: 48, 领用: 50 },
  { month: "6月", 入库: 62, 领用: 45 },
  { month: "7月", 入库: 80, 领用: 33 },
]

export const statusColor: Record<MaterialStatus, string> = {
  正常: "text-success bg-success/10 border-success/20",
  低库存: "text-warning bg-warning/10 border-warning/20",
  临期: "text-warning bg-warning/10 border-warning/20",
  已过期: "text-destructive bg-destructive/10 border-destructive/20",
}

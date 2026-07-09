import { materials, type Material } from "./mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface MaterialInfo {
  id: string
  code: string
  name: string
  spec: string
  category: string
  quantity: number
  unit: string
  threshold: number
  location: string
  expiry: string
  status: string
}

export async function getMaterialByCode(code: string): Promise<MaterialInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get-material-by-code?code=${encodeURIComponent(code)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.material || null
  } catch (error) {
    console.warn("API调用失败，使用本地mock数据:", error)
    
    const material = materials.find((m: Material) => m.code === code || m.id === code)
    if (material) {
      return {
        id: material.id,
        code: material.code,
        name: material.name,
        spec: material.spec,
        category: material.category,
        quantity: material.quantity,
        unit: material.unit,
        threshold: material.threshold,
        location: material.location,
        expiry: material.expiry,
        status: material.status,
      }
    }
    
    return null
  }
}
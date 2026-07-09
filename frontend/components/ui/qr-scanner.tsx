"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface QrScannerProps {
  onScanSuccess: (code: string) => void
  onScanError?: (error: string) => void
  onClose: () => void
}

const QR_CODE_PATTERN = /^[a-zA-Z0-9]{8,}$/

function decodeQRFromImage(imageData: ImageData): string | null {
  const { data, width, height } = imageData
  const pixels = []
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const brightness = (r + g + b) / 3
    pixels.push(brightness < 128 ? 0 : 1)
  }

  const finderPattern = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  const finderPatternLen = 9

  for (let y = 0; y < height - finderPatternLen; y++) {
    for (let x = 0; x < width - finderPatternLen; x++) {
      let match = true
      for (let fy = 0; fy < finderPatternLen && match; fy++) {
        for (let fx = 0; fx < finderPatternLen && match; fx++) {
          const px = x + fx
          const py = y + fy
          const idx = py * width + px
          const expected = (fx === 0 || fx === 8 || fy === 0 || fy === 8) ? 0 :
                          (fx === 1 || fx === 7 || fy === 1 || fy === 7) ? 1 :
                          (fx >= 3 && fx <= 5 && fy >= 3 && fy <= 5) ? 0 : 1
          if (pixels[idx] !== expected) {
            match = false
          }
        }
      }
      if (match) {
        return extractQRCodeContent(pixels, width, x, y)
      }
    }
  }

  return null
}

function extractQRCodeContent(pixels: number[], width: number, startX: number, startY: number): string | null {
  const moduleSize = 4
  const content = []
  
  let x = startX + 11 * moduleSize
  let y = startY + 11 * moduleSize
  
  let bitCount = 0
  let byte = 0
  let inData = false
  
  while (y < width - 11 * moduleSize && content.length < 100) {
    for (let i = 0; i < 2; i++) {
      const px = x + i * moduleSize
      const py = y
      const idx = py * width + px
      const bit = pixels[idx] || 0
      
      byte = (byte << 1) | bit
      bitCount++
      
      if (bitCount === 8) {
        if (byte === 0x00) {
          if (inData) break
          inData = true
        } else if (inData) {
          if (byte === 0xEC) break
          content.push(byte)
        }
        bitCount = 0
        byte = 0
      }
    }
    x += 2 * moduleSize
    
    if (x >= width - 11 * moduleSize) {
      x = startX + 11 * moduleSize
      y += moduleSize
    }
  }
  
  if (content.length > 0) {
    const text = String.fromCharCode(...content)
    if (QR_CODE_PATTERN.test(text)) {
      return text
    }
  }
  
  return null
}

export function QrScanner({ onScanSuccess, onScanError, onClose }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const [cameraReady, setCameraReady] = useState(false)

  const scanCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = decodeQRFromImage(imageData)

    if (code) {
      setIsScanning(false)
      onScanSuccess(code)
      return
    }

    if (isScanning) {
      requestAnimationFrame(scanCode)
    }
  }, [isScanning, onScanSuccess])

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        setError("")
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setCameraReady(true)
            setIsScanning(true)
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "无法访问摄像头"
        setError(errorMsg)
        onScanError?.(errorMsg)
      }
    }

    startCamera()

    return () => {
      setIsScanning(false)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [onScanError])

  useEffect(() => {
    if (isScanning && cameraReady) {
      requestAnimationFrame(scanCode)
    }
  }, [isScanning, cameraReady, scanCode])

  return (
    <div className="relative w-full">
      {error ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <p className="text-xs text-muted-foreground">请检查摄像头权限设置</p>
          <button
            onClick={() => {
              setCameraReady(false)
              setError("")
              navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then((stream) => {
                  if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.onloadedmetadata = () => {
                      videoRef.current?.play()
                      setCameraReady(true)
                      setIsScanning(true)
                    }
                  }
                })
                .catch((err) => {
                  const errorMsg = err instanceof Error ? err.message : "无法访问摄像头"
                  setError(errorMsg)
                })
            }}
            className="mt-4 px-4 py-2 text-sm text-primary hover:underline"
          >
            重试
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full aspect-video rounded-2xl object-cover bg-black"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-2xl border-2 border-primary/50">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
              </div>
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/80 whitespace-nowrap">
                将二维码对准扫描框
              </p>
            </div>
          </div>

          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs backdrop-blur"
            >
              关闭
            </button>
          </div>
        </>
      )}
    </div>
  )
}
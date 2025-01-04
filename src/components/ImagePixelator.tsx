'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Download } from 'lucide-react'

export default function ImagePixelator() {
  const [image, setImage] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(10)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const pixelateImage = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !image) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          const i = (y * canvas.width + x) * 4
          const avgColor = (data[i] + data[i + 1] + data[i + 2]) / 3
          const bwColor = avgColor > 128 ? 255 : 0

          for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
            for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
              const pixelIndex = ((y + py) * canvas.width + (x + px)) * 4
              data[pixelIndex] = bwColor
              data[pixelIndex + 1] = bwColor
              data[pixelIndex + 2] = bwColor
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }
    img.src = image
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'pixelated-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  useEffect(() => {
    if (image) {
      pixelateImage()
    }
  }, [image, pixelSize])

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Black&White Pixelator</h1>
      <div className="mb-4">
        <Label htmlFor="image-upload" className="block mb-2">Upload an image:</Label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>
      {image && (
        <>
          <div className="mb-4">
            <Label htmlFor="pixel-size" className="block mb-2">Pixel Size: {pixelSize}</Label>
            <Slider
              id="pixel-size"
              min={1}
              max={50}
              step={1}
              value={[pixelSize]}
              onValueChange={(value) => setPixelSize(value[0])}
              className="w-full"
            />
          </div>
          <div className="mt-4">
            <canvas ref={canvasRef} className="max-w-full h-auto border border-gray-300" />
          </div>
          <div className="mt-4">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download Pixelated Image
            </Button>
          </div>
        </>
      )}
    </div>
  )
}


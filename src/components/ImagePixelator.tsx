'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Download } from 'lucide-react'
import { faqItems, galleryImages } from '../data/content'

export default function ImagePixelator() {
  const [image, setImage] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(10)
  const [blackAndWhite, setBlackAndWhite] = useState(false)
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
          
          let r = 0, g = 0, b = 0
          let count = 0
          
          for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
            for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
              const idx = ((y + py) * canvas.width + (x + px)) * 4
              r += data[idx]
              g += data[idx + 1]
              b += data[idx + 2]
              count++
            }
          }
          
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)

          if (blackAndWhite) {
            const avg = (r + g + b) / 3
            const bwColor = avg > 128 ? 255 : 0
            r = g = b = bwColor
          }

          for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
            for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
              const pixelIndex = ((y + py) * canvas.width + (x + px)) * 4
              data[pixelIndex] = r
              data[pixelIndex + 1] = g
              data[pixelIndex + 2] = b
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
  }, [image, pixelSize, blackAndWhite])

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-7xl font-bold mb-4">
          Create{' '}
          <span className="text-8xl font-pixel text-violet-600">pixelated</span>
          {' '}images fast
        </h1>
      </div>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Free Image Pixelator</h1>
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
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => setBlackAndWhite(!blackAndWhite)}
                className={`${
                  blackAndWhite 
                    ? 'bg-gray-800 hover:bg-gray-900' 
                    : 'bg-violet-600 hover:bg-violet-700'
                }`}
              >
                {blackAndWhite ? 'Black&White' : 'Colored'}
              </Button>
              <Button onClick={handleDownload} className="bg-violet-600 hover:bg-violet-700">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
            <div className="mt-4">
              <canvas ref={canvasRef} className="max-w-full h-auto border border-gray-300" />
            </div>
          </>
        )}
      </div>
      <div className="container mx-auto p-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Galería de Ejemplos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={image.src} 
                alt="Ejemplo de imagen pixelada"
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto p-4 max-w-4xl mt-12 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


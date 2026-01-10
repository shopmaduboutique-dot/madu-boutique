"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface FlyingItem {
  id: string
  startX: number
  startY: number
  targetX: number
  targetY: number
  image: string
}

interface FlyingAnimationContainerProps {
  children: React.ReactNode
}

export const FlyingAnimationContainer = ({ children }: FlyingAnimationContainerProps) => {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([])

  useEffect(() => {
    window.addEventListener("startFlyingAnimation", handleStartAnimation as EventListener)
    return () => {
      window.removeEventListener("startFlyingAnimation", handleStartAnimation as EventListener)
    }
  }, [])

  const handleStartAnimation = (event: Event) => {
    const customEvent = event as CustomEvent
    const { startX, startY, targetX, targetY, image } = customEvent.detail
    const id = `fly-${Date.now()}-${Math.random()}`

    const newItem: FlyingItem = {
      id,
      startX,
      startY,
      targetX,
      targetY,
      image,
    }

    setFlyingItems((prev) => [...prev, newItem])

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== id))
    }, 600)
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 pointer-events-none">
        {flyingItems.map((item) => (
          <div
            key={item.id}
            className="fixed animate-fly-to-cart"
            style={
              {
                "--start-x": `${item.startX}px`,
                "--start-y": `${item.startY}px`,
                "--target-x": `${item.targetX}px`,
                "--target-y": `${item.targetY}px`,
              } as React.CSSProperties
            }
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg">
              <img src={item.image || "/placeholder.svg"} alt="flying" className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import Image from "next/image"
import { Gift, Volume2, VolumeX, Trophy, Sparkles, RotateCcw } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { useToast } from "../components/ui/toast"
import type { Prize } from "../types"

const prizes: Prize[] = [
  {
    id: 1,
    points: 250,
    color: "#FF0000",
    image: "/prizes/prix1.png",
    name: "YOURI BIG EYES",
  },
  {
    id: 2,
    points: 400,
    color: "#FFFF00",
    image: "/prizes/prix2.png?text=Prize2&width=200&height=200",
    name: "OLD YOURI BIKER STYLE",
  },
  {
    id: 3,
    points: 600,
    color: "#FFA500",
    image: "/prizes/prix3.png?text=Prize3&width=200&height=200",
    name: "YOURI CLASSICS",
  },
  {
    id: 4,
    points: 9990,
    color: "#FF69B4",
    image: "/prizes/prix4.png?text=Prize4&width=200&height=200",
    name: "YOURI SUPER SAIYAN",
  },
  {
    id: 5,
    points: 500,
    color: "#00FF00",
    image: "/prizes/prix5.png?text=Prize5&width=200&height=200",
    name: "YOURI PINKY",
  },
  {
    id: 6,
    points: 0,
    color: "#000000",
    image: "/prizes/prix6.png?text=Prize6&width=200&height=200",
    name: "YOURI SLUMDOG",
  },
  {
    id: 7,
    points: 650,
    color: "#00BFFF",
    image: "/prizes/prix7.png?text=Prize7&width=200&height=200",
    name: "YOURI MIGNON",
  },
  {
    id: 8,
    points: 250,
    color: "#FF0000",
    image: "/prizes/prix8.png?text=Prize8&width=200&height=200",
    name: "YOURI YELLOWSTONE",
  },
  {
    id: 9,
    points: 500,
    color: "#FFFF00",
    image: "/prizes/prix9.png?text=Prize9&width=200&height=200",
    name: "YOURI SWAG",
  },
  {
    id: 10,
    points: 0,
    color: "#FFA500",
    image: "/prizes/prix10.png?text=Prize10&width=200&height=200",
    name: "THIS IS NOT YOURI",
  },
  {
    id: 11,
    points: 100,
    color: "#FF69B4",
    image: "/prizes/prix11.png?text=Prize11&width=200&height=200",
    name: "YOURI SANTA DREAM",
  },
  {
    id: 12,
    points: 200,
    color: "#00FF00",
    image: "/prizes/prix12.png?text=Prize12&width=200&height=200",
    name: "YOURI GOLDEN ANGEL",
  },
  {
    id: 13,
    points: 750,
    color: "#000080",
    image: "/prizes/prix13.png?text=Prize13&width=200&height=200",
    name: "YOURI NO BEBAR",
  },
  {
    id: 14,
    points: 1000,
    color: "#00BFFF",
    image: "/prizes/prix13.png?text=Prize14&width=200&height=200",
    name: "YOURI NO BEBAR",
  },
  {
    id: 15,
    points: 250,
    color: "#FF0000",
    image: "/prizes/prix11.png?text=Prize15&width=200&height=200",
    name: "YOURI SANTA DREAM",
  },
  {
    id: 16,
    points: 300,
    color: "#FFFF00",
    image: "/prizes/prix8.png?text=Prize16&width=200&height=200",
    name: "YOURI YELLOWSTONE",
  },
].map((prize) => ({
  ...prize,
  rarity: prize.points >= 750 ? "legendary" : prize.points >= 500 ? "rare" : "common",
}))

export default function WheelOfFortune() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showPrize, setShowPrize] = useState(false)
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isUnwrapping, setIsUnwrapping] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const sounds = useRef<Record<string, HTMLAudioElement | null>>({
    spin: null,
    win: null,
    unwrap: null,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      sounds.current = {
        spin: new Audio("/spin.mp3"),
        win: new Audio("/win.mp3"),
        unwrap: new Audio("/unwrap.mp3"),
      }
    }
  }, [])

  const pointsToNextLevel = level * 1000

  useEffect(() => {
    const progressValue = ((points % pointsToNextLevel) / pointsToNextLevel) * 100
    setProgress(progressValue)

    if (points >= level * 1000) {
      setLevel((prev) => prev + 1)
      toast({
        title: "Niveau supérieur !",
        description: `Félicitations ! Vous avez atteint le niveau ${level + 1}`,
      })
      triggerLevelUpConfetti()
    }
  }, [points, level, pointsToNextLevel, toast])

  const playSound = (soundType: "spin" | "win" | "unwrap") => {
    if (!isSoundEnabled || !sounds.current[soundType]) return

    const audio = sounds.current[soundType]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Silently handle any audio playback errors
      })
    }
  }

  const spinWheel = () => {
    if (isSpinning) return
  
    setIsSpinning(true)
    setShowPrize(false)
    playSound("spin")
  
    const spins = 5 + Math.floor(Math.random() * 5)
    const segmentSize = 360 / prizes.length
    const extraDegrees = Math.floor(Math.random() * 360)
    const totalRotation = spins * 360 + extraDegrees
  
    // Correction du calcul pour aligner avec la flèche à 0°
    const normalizedDegrees = extraDegrees % 360
    const prizeIndex = prizes.length - 1 - Math.floor(normalizedDegrees / segmentSize)
    
    setSelectedPrize(prizeIndex)
    setHasSpun(true)
    setRotation(totalRotation)
  
    console.log({
      extraDegrees,
      normalizedDegrees,
      segmentSize,
      prizeIndex,
      prizeName: prizes[prizeIndex]?.name,
      prizeColor: prizes[prizeIndex]?.color
    })
        
    setTimeout(() => {
      setIsSpinning(false)
      setShowPrize(true)
      playSound("win")
      triggerWinConfetti()
      if (selectedPrize !== null) {
        setPoints((prev) => prev + prizes[prizeIndex].points)
      }
    }, 5000)
  }

  const resetWheel = () => {
    setRotation(0)
    setSelectedPrize(null)
    setShowPrize(false)
    setIsUnwrapping(false)
  }

  const triggerWinConfetti = () => {
    const end = Date.now() + 1000

    const colors = prizes.map((p) => p.color)
    ;(function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }

  const triggerLevelUpConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const unwrapPrize = () => {
    setIsUnwrapping(true)
    playSound("unwrap")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
      {/* Header avec points et niveau */}
      <div className="fixed top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Niveau {level}</span>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-bold">{points} points</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
          {isSoundEnabled ? <Volume2 /> : <VolumeX />}
        </Button>
      </div>
  
      {/* Container de la roue avec flèche fixe */}
      <div className="relative w-full max-w-2xl aspect-square mt-16">
       {/* Flèche fixe positionnée dans la zone noire (environ 225 degrés) */}
       <div className="absolute left-[0%] bottom-[30%] transform w-10 h-15 z-10" style={{ transform: 'rotate(245deg)' }}>
        <div className="w-0 h-0 
      border-l-[12px] 
      border-r-[12px] 
      border-t-[24px] 
      border-l-transparent 
      border-r-transparent 
      border-t-white" 
        />
      </div>

       {/* Roue rotative */}
        <motion.div
          ref={wheelRef}
          className="relative w-full h-full"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: "easeOut" }}

        >
          <div className="absolute inset-0 rounded-full border-8 border-purple-600 overflow-hidden shadow-2xl">
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index
              const textAngle = angle + 360 / prizes.length / 2
              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full origin-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="absolute w-1/2 h-1/2 right-1/2 bottom-1/2 origin-bottom-right overflow-hidden"
                    style={{
                      transform: "rotate(-90deg) skewY(67.5deg)",
                    }}
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <div className="relative w-full h-full" style={{ transform: "skewY(-67.5deg) rotate(90deg)" }}>
                        <Image
                          src={prize.image}
                          alt={prize.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: prize.color,
                        opacity: 0.7,
                      }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{
                        transform: `rotate(${90 - textAngle}deg)`,
                        color: prize.color === "#000000" ? "#FFFFFF" : prize.color === "#FFFF00" ? "#000000" : "#FFFFFF",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.75)",
                        fontSize: prize.points.toString().length > 2 ? "1rem" : "1.25rem",
                        fontWeight: "bold",
                        zIndex: 10,
                      }}
                    >
                      {prize.points}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="absolute inset-[20%] rounded-full bg-purple-600 z-10" />
          </div>
        </motion.div>
  
        <AnimatePresence>
          {showPrize && selectedPrize !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <Card className="p-6 bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <motion.div
                    animate={
                      isUnwrapping
                        ? {
                            scale: [1, 1.2, 0],
                            rotate: [0, 15, -15, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {!isUnwrapping && (
                      <Gift className="w-24 h-24 mx-auto mb-4" style={{ color: prizes[selectedPrize].color }} />
                    )}
                  </motion.div>
  
                  <motion.div
                    initial={isUnwrapping ? { scale: 0 } : { scale: 1 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: isUnwrapping ? 0.3 : 0 }}
                    className="text-center"
                  >
                    <div className="relative w-64 h-64 mx-auto mb-4">
                      <Image
                        src={prizes[selectedPrize].image}
                        alt={prizes[selectedPrize].name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="text-center mt-6">
                      <h3 className="text-4xl font-bold" style={{ color: prizes[selectedPrize].color }}>
                        {prizes[selectedPrize].points} Points !
                      </h3>
                      <p className="text-xl mt-2">{prizes[selectedPrize].name}</p>
                    </div>
                  </motion.div>
  
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => setShowPrize(false)}
                      className="flex-1"
                      style={{
                        backgroundColor: prizes[selectedPrize].color,
                        color: prizes[selectedPrize].color === "#FFFF00" ? "#000000" : "#FFFFFF",
                      }}
                    >
                      Continuer
                    </Button>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  
      <div className="flex gap-4 mt-8">
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          size="lg"
        >
          {isSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              ⭐
            </motion.div>
          ) : (
            "Tourner la roue !"
          )}
        </Button>
  
        {hasSpun && !isSpinning && (
          <Button onClick={resetWheel} variant="outline" size="lg" className="text-lg px-8 py-4">
            <RotateCcw className="mr-2 h-4 w-4" />
            Relancer
          </Button>
        )}
      </div>
    </div>
  )
}
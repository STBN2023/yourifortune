"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { Gift, Volume2, VolumeX, Trophy, Sparkles, RotateCcw } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import type { Prize } from "../types"

// --- Liste des prix ---
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

// --- Matériau plastique (sans dégradé) ---
function createPlasticMaterial(baseColor: string) {
  return new THREE.MeshPhysicalMaterial({
    color: baseColor,
    roughness: 0.4,
    metalness: 0,
    reflectivity: 0.3,
  })
}

// --- Segment de la roue ---
type WheelSegmentProps = {
  index: number
  totalSegments: number
  prize: Prize
}

const WheelSegment: React.FC<WheelSegmentProps> = ({ index, totalSegments, prize }) => {
  const outerRadius = 5
  const segmentAngle = (2 * Math.PI) / totalSegments

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(outerRadius, 0)
    shape.absarc(0, 0, outerRadius, 0, segmentAngle, false)
    shape.lineTo(0, 0)
    const extrudeSettings = {
      steps: 1,
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 1,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [outerRadius, segmentAngle])

  const material = useMemo(() => createPlasticMaterial(prize.color), [prize.color])

  return (
    <mesh geometry={geometry} material={material} rotation={[0, 0, index * segmentAngle]} />
  )
}

// --- Groupe de segments avec rotation animée ---
type WheelProps = {
  prizes: Prize[]
  targetRotation: number
}

const WheelWithSpin: React.FC<WheelProps> = ({ prizes, targetRotation }) => {
  const groupRef = useRef<THREE.Group>(null)
  const currentRotation = useRef(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      currentRotation.current = THREE.MathUtils.lerp(
        currentRotation.current,
        targetRotation,
        delta * 1
      )
      groupRef.current.rotation.z = currentRotation.current
    }
  })

  return (
    <group ref={groupRef}>
      {prizes.map((prize, index) => (
        <WheelSegment key={prize.id} index={index} totalSegments={prizes.length} prize={prize} />
      ))}
    </group>
  )
}

export default function WheelOfFortune() {
  const [targetRotation, setTargetRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
  const [showPrizeModal, setShowPrizeModal] = useState(false)

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
      toast.success(`Félicitations ! Vous avez atteint le niveau ${level + 1}`)
      triggerLevelUpConfetti()
    }
  }, [points, level, pointsToNextLevel])

  const playSound = (soundType: "spin" | "win" | "unwrap") => {
    if (!isSoundEnabled || !sounds.current[soundType]) return
    const audio = sounds.current[soundType]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
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
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
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

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    playSound("spin")
    const spins = 5 + Math.floor(Math.random() * 5)
    const extra = Math.random() * 2 * Math.PI
    const newTarget = spins * 2 * Math.PI + extra
    setTargetRotation(newTarget)

    setTimeout(() => {
      setIsSpinning(false)
      const segmentAngle = (2 * Math.PI) / prizes.length
      const normalized = newTarget % (2 * Math.PI)
      let computedIndex = prizes.length - 1 - Math.floor(normalized / segmentAngle)
      // On s'assure que l'index reste dans [0, prizes.length-1]
      const prizeIndex = Math.max(0, Math.min(prizes.length - 1, computedIndex))
      const prizeWon = prizes[prizeIndex]
      setSelectedPrize(prizeWon)
      setShowPrizeModal(true)
      playSound("win")
      triggerWinConfetti()
      setPoints((prev) => prev + prizeWon.points)
    }, 5000)
  }

  const resetWheel = () => {
    setTargetRotation(0)
    setSelectedPrize(null)
    setShowPrizeModal(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
      {/* En-tête */}
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

      {/* Conteneur de la roue avec la flèche positionnée comme à l'origine */}
      <div className="relative w-full max-w-2xl h-96">
        <div
          className="absolute left-[70%] bottom-[40%] w-20 h-15 z-10"
          style={{ transform: "rotate(89deg)" }}
        >
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-white" />
        </div>
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <WheelWithSpin prizes={prizes} targetRotation={targetRotation} />
        </Canvas>
      </div>

      {/* Boutons */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          size="lg"
        >
          {isSpinning ? "Spinning..." : "Tourner la roue !"}
        </Button>
        {!isSpinning && targetRotation !== 0 && (
          <Button onClick={resetWheel} variant="outline" size="lg" className="text-lg px-8 py-4">
            <RotateCcw className="mr-2 h-4 w-4" />
            Relancer
          </Button>
        )}
      </div>

      {/* Modal d'affichage du gain */}
      <AnimatePresence>
        {showPrizeModal && selectedPrize && (
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
                <motion.div className="flex justify-center mb-4">
                  <Gift className="w-24 h-24" style={{ color: selectedPrize.color }} />
                </motion.div>
                <div className="text-center">
                  <div className="relative w-64 h-64 mx-auto mb-4">
                    <Image
                      src={selectedPrize.image}
                      alt={selectedPrize.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="text-4xl font-bold" style={{ color: selectedPrize.color }}>
                    {selectedPrize.points} Points !
                  </h3>
                  <p className="text-xl mt-2">{selectedPrize.name}</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => setShowPrizeModal(false)}
                    className="flex-1"
                    style={{
                      backgroundColor: selectedPrize.color,
                      color: selectedPrize.color === "#FFFF00" ? "#000000" : "#FFFFFF",
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
  )
}

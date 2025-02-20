"use client"

import React, { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Button } from "../components/ui/button"
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

// Fonction utilitaire qui crée une texture dégradée via un canvas
function createGradientTexture(baseColor: string): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext("2d")!
  const gradient = context.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, baseColor)
  gradient.addColorStop(1, "#ffffff")
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Composant pour un segment (wedge) de la roue en 3D
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
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 1,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [outerRadius, segmentAngle])

  const texture = useMemo(() => createGradientTexture(prize.color), [prize.color])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ map: texture }), [texture])

  // Chaque segment est tourné de index * segmentAngle
  return (
    <mesh geometry={geometry} material={material} rotation={[0, 0, index * segmentAngle]} />
  )
}

// Composant regroupant l'ensemble des segments et animant la rotation de la roue
type WheelProps = {
  prizes: Prize[]
  targetRotation: number
}

const WheelWithSpin: React.FC<WheelProps> = ({ prizes, targetRotation }) => {
  const groupRef = useRef<THREE.Group>(null)
  const currentRotation = useRef(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Interpolation linéaire pour une animation fluide
      currentRotation.current = THREE.MathUtils.lerp(
        currentRotation.current,
        targetRotation,
        delta * 1 // Ajustez ce facteur pour la vitesse d'animation
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
  const toast = useToast()

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    // Calcul d'une rotation aléatoire : un certain nombre de tours + un extra en radians
    const spins = 5 + Math.floor(Math.random() * 5)
    const extra = Math.random() * 2 * Math.PI
    const newTarget = spins * 2 * Math.PI + extra
    setTargetRotation(newTarget)

    // Après 5 secondes, déterminer le segment gagnant et afficher une notification
    setTimeout(() => {
      setIsSpinning(false)
      const segmentAngle = (2 * Math.PI) / prizes.length
      const normalized = newTarget % (2 * Math.PI)
      const prizeIndex = prizes.length - Math.floor(normalized / segmentAngle) - 1
      toast({
        title: "Félicitations !",
        description: `Vous avez gagné ${prizes[prizeIndex].points} points : ${prizes[prizeIndex].name}`,
      })
    }, 5000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
      {/* Zone d'affichage Three.js */}
      <div className="w-full max-w-2xl h-96">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <WheelWithSpin prizes={prizes} targetRotation={targetRotation} />
        </Canvas>
      </div>

      {/* Bouton pour lancer la roue */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          size="lg"
        >
          {isSpinning ? "Spinning..." : "Tourner la roue !"}
        </Button>
      </div>
    </div>
  )
}

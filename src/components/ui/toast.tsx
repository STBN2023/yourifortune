"use client"

import * as React from "react"
import { toast } from "react-hot-toast"

interface ToastProps {
  title: string
  description: string
}

export const useToast = () => {
  return {
    toast: ({ title, description }: ToastProps) => {
      toast(
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      )
    },
  }
}
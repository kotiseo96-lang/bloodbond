"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) => {
  if (!isOpen) return null

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getIconColors = () => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700"
      case "error":
        return "bg-red-600 hover:bg-red-700"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700"
      default:
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-lg max-w-sm w-full border ${getColors()}`}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-foreground">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t justify-end">
          {showCancel && (
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              if (onConfirm) onConfirm()
              onClose()
            }}
            className={getButtonColor()}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

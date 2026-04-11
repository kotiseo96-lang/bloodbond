"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useThemeSettings } from "@/hooks/useThemeSettings"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Palette, RotateCcw } from "lucide-react"

const DEFAULT_COLORS = {
  primary_color: "#dc2626",
  secondary_color: "#f97316",
  accent_color: "#06b6d4",
  background_color: "#ffffff",
  text_color: "#000000",
  card_background: "#f9fafb",
  border_color: "#e5e7eb",
}

const ThemeEditor: React.FC = () => {
  const { theme, isLoading, updateTheme } = useThemeSettings()
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (theme) {
      setColors({
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        accent_color: theme.accent_color,
        background_color: theme.background_color,
        text_color: theme.text_color,
        card_background: theme.card_background,
        border_color: theme.border_color,
      })
    }
  }, [theme])

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setColors({ ...colors, [key]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    await updateTheme(colors)
    setIsSaving(false)
  }

  const handleReset = () => {
    setColors(DEFAULT_COLORS)
  }

  const colorFields = [
    {
      key: "primary_color" as const,
      label: "Primary Color",
      description: "Main brand color for buttons and highlights",
    },
    { key: "secondary_color" as const, label: "Secondary Color", description: "Secondary accent color" },
    { key: "accent_color" as const, label: "Accent Color", description: "Accent for special highlights" },
    { key: "background_color" as const, label: "Background Color", description: "Page background color" },
    { key: "text_color" as const, label: "Text Color", description: "Primary text color" },
    { key: "card_background" as const, label: "Card Background", description: "Card and container background" },
    { key: "border_color" as const, label: "Border Color", description: "Border and divider color" },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Theme & Style Settings</h1>
          <p className="text-muted-foreground mt-1">Customize website colors and visual appearance with live preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Color Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Palette
              </h2>

              <div className="space-y-6">
                {colorFields.map(({ key, label, description }) => (
                  <div key={key} className="space-y-3">
                    <div>
                      <Label className="text-base font-medium">{label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={colors[key]}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="h-12 w-16 cursor-pointer"
                        />
                      </div>
                      <Input
                        type="text"
                        value={colors[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="font-mono text-sm flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Theme"
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Live Preview Panel */}
          <div className="space-y-6">
            <Card
              className="p-6 sticky top-8"
              style={{
                backgroundColor: colors.background_color,
                color: colors.text_color,
                borderColor: colors.border_color,
              }}
            >
              <h2 className="font-heading text-lg font-semibold mb-6">Live Preview</h2>

              <div className="space-y-4">
                {/* Primary Color Preview */}
                <div
                  className="p-4 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.primary_color }}
                >
                  Primary Button
                </div>

                {/* Secondary Color Preview */}
                <div
                  className="p-4 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.secondary_color }}
                >
                  Secondary Button
                </div>

                {/* Accent Color Preview */}
                <div className="p-4 rounded-lg text-white font-medium" style={{ backgroundColor: colors.accent_color }}>
                  Accent Badge
                </div>

                {/* Card Background Preview */}
                <div
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: colors.card_background,
                    borderColor: colors.border_color,
                    color: colors.text_color,
                  }}
                >
                  <p className="font-medium">Card Example</p>
                  <p className="text-sm mt-2">This shows how cards will appear with your colors</p>
                </div>

                {/* Text Color Preview */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.background_color,
                    color: colors.text_color,
                    border: `2px solid ${colors.border_color}`,
                  }}
                >
                  <p className="font-medium">Text Preview</p>
                  <p className="text-sm mt-2">This is how regular text will look</p>
                </div>

                {/* Combined Preview */}
                <div
                  className="p-6 rounded-lg space-y-3"
                  style={{
                    backgroundColor: colors.card_background,
                    borderColor: colors.border_color,
                    border: "1px solid",
                  }}
                >
                  <p className="font-semibold" style={{ color: colors.primary_color }}>
                    Section Title
                  </p>
                  <p style={{ color: colors.text_color }} className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <button
                    className="px-4 py-2 rounded text-white font-medium mt-2"
                    style={{ backgroundColor: colors.accent_color }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ThemeEditor

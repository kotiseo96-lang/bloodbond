"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCmsContent } from "@/hooks/useCmsContent"
import type { ContentSection } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import TipTapEditor from "@/components/admin/TipTapEditor"

interface ContentEditorProps {
  section: ContentSection
}

const ContentEditor: React.FC<ContentEditorProps> = ({ section }) => {
  const { content, isLoading, saveContent } = useCmsContent(section)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")
  const [contentText, setContentText] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (content.length > 0) {
      const firstContent = content[0]
      setTitle(firstContent.title)
      setSubtitle(firstContent.subtitle || "")
      setDescription(firstContent.description || "")
      setContentText(firstContent.content)
      setIsPublished(firstContent.is_published)
    }
  }, [content])

  const handleSave = async () => {
    setIsSaving(true)
    await saveContent({
      section,
      title: title || `${section} Content`,
      subtitle: subtitle || null,
      description: description || null,
      content: contentText,
      is_published: isPublished,
    })
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter section title" />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Enter subtitle (optional)" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <TipTapEditor value={contentText} onChange={setContentText} placeholder="Start typing your content..." />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm font-medium cursor-pointer">
          Publish this content
        </label>
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Content"
        )}
      </Button>
    </div>
  )
}

export default ContentEditor

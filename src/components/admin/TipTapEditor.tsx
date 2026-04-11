"use client"

import React from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  LinkIcon,
  ImageIcon,
  Redo,
  Undo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, placeholder }) => {
  const [showLinkInput, setShowLinkInput] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState("")
  const [showImageInput, setShowImageInput] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value || `<p>${placeholder || ""}</p>`,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const handleAddImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageInput(false)
    }
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run()
  const undo = () => editor.chain().focus().undo().run()
  const redo = () => editor.chain().focus().redo().run()

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted border-b p-2 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleBold}
          className={cn(editor.isActive("bold") && "bg-primary text-primary-foreground")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={toggleItalic}
          className={cn(editor.isActive("italic") && "bg-primary text-primary-foreground")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="border-l mx-1" />

        <Button
          size="sm"
          variant="outline"
          onClick={toggleHeading2}
          className={cn(editor.isActive("heading", { level: 2 }) && "bg-primary text-primary-foreground")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={toggleHeading3}
          className={cn(editor.isActive("heading", { level: 3 }) && "bg-primary text-primary-foreground")}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="border-l mx-1" />

        <Button
          size="sm"
          variant="outline"
          onClick={toggleBulletList}
          className={cn(editor.isActive("bulletList") && "bg-primary text-primary-foreground")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={toggleOrderedList}
          className={cn(editor.isActive("orderedList") && "bg-primary text-primary-foreground")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={toggleBlockquote}
          className={cn(editor.isActive("blockquote") && "bg-primary text-primary-foreground")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="border-l mx-1" />

        <div className="relative">
          <Button size="sm" variant="outline" onClick={() => setShowLinkInput(!showLinkInput)} title="Add Link">
            <LinkIcon className="h-4 w-4" />
          </Button>
          {showLinkInput && (
            <div className="absolute top-full mt-2 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 min-w-64">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLink()
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddLink}>
                    Add Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Button size="sm" variant="outline" onClick={() => setShowImageInput(!showImageInput)} title="Add Image">
            <ImageIcon className="h-4 w-4" />
          </Button>
          {showImageInput && (
            <div className="absolute top-full mt-2 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 min-w-64">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddImage()
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowImageInput(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddImage}>
                    Add Image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-l mx-1" />

        <Button size="sm" variant="outline" onClick={undo} disabled={!editor.can().undo()} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="outline" onClick={redo} disabled={!editor.can().redo()} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <EditorContent editor={editor} className="min-h-80 p-4" />
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex gap-1 bg-white border rounded-lg shadow-lg p-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleBold}
              className={cn(editor.isActive("bold") && "bg-primary text-primary-foreground")}
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleItalic}
              className={cn(editor.isActive("italic") && "bg-primary text-primary-foreground")}
            >
              <Italic className="h-3 w-3" />
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  )
}

export default TipTapEditor

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";

import {
  Bold,
  Italic,
  Strikethrough,
  UnderlineIcon,
  Undo2,
  Redo2,
  List,
  ListOrdered,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  editable = true,
}: Props) {
  const editor = useEditor({
    extensions: [
      // heading is handled separately below so we can restrict levels
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
    ],
    content: value || "",
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const [blockType, setBlockType] = useState<"0" | "1" | "2" | "3">("0");
  const [, forceUpdate] = useState({});

  // Keep external `value` changes (e.g. loading a page for edit) in sync
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  // Track which heading level (if any) the cursor is in, for the dropdown
  useEffect(() => {
    if (!editor) return;

    const syncBlockType = () => {
      if (editor.isActive("heading", { level: 1 })) setBlockType("1");
      else if (editor.isActive("heading", { level: 2 })) setBlockType("2");
      else if (editor.isActive("heading", { level: 3 })) setBlockType("3");
      else setBlockType("0");
    };

    syncBlockType();
    editor.on("selectionUpdate", syncBlockType);
    editor.on("update", syncBlockType);

    return () => {
      editor.off("selectionUpdate", syncBlockType);
      editor.off("update", syncBlockType);
    };
  }, [editor]);

  // Re-render toolbar so active-state highlighting (bold/italic/etc.) stays current
  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => forceUpdate({});

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden prose prose-neutral">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-muted/30">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 hover:bg-muted rounded"
        >
          <Undo2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 hover:bg-muted rounded"
        >
          <Redo2 size={18} />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Heading dropdown */}
        <select
          value={blockType}
          onChange={(e) => {
            const level = Number(e.target.value) as 0 | 1 | 2 | 3;
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
              setBlockType("0");
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run();
              setBlockType(String(level) as "1" | "2" | "3");
            }
          }}
          className="border rounded px-2 py-1 text-sm bg-background"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive("bold") ? "bg-muted" : ""}`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive("italic") ? "bg-muted" : ""}`}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive("underline") ? "bg-muted" : ""}`}
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive("strike") ? "bg-muted" : ""}`}
        >
          <Strikethrough size={18} />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive("bulletList") ? "bg-muted" : ""}`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive("orderedList") ? "bg-muted" : ""}`}
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  );
}
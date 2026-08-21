"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import RichTextEditor from "@/components/RichTextEditor"

interface CMSPage {
  id: string
  title: string
  slug: string
  content: string
  status: string
}

interface SEOData {
  id?: string
  meta_title: string
  meta_description: string
  meta_keywords: string[]
  canonical_url: string
  og_image: string
  schema_json: string
}

export default function EditCMSPage() {
  const params = useParams()
  const router = useRouter()

  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("draft")

  const [seo, setSeo] = useState<SEOData>({
    meta_title: "",
    meta_description: "",
    meta_keywords: [],
    canonical_url: "",
    og_image: "",
    schema_json: "",
  })

  const [keywordsText, setKeywordsText] = useState("")

  useEffect(() => {
    loadPage()
  }, [id])

  async function loadPage() {
    setLoading(true)

    const { data: page, error: pageError } = await supabase
      .from("cms_pages")
      .select("*")
      .eq("id", id)
      .single()

    if (pageError) {
      console.error(pageError)
      alert(pageError.message)
      router.push("/admin/cms")
      return
    }

    setTitle(page.title)
    setSlug(page.slug)
    setContent(page.content)
    setStatus(page.status || "draft")

    const { data: seoData, error: seoError } = await supabase
      .from("seo_metadata")
      .select("*")
      .eq("page_id", id)
      .maybeSingle()

    if (seoError) {
      console.error("SEO error:", seoError)
    }

    if (seoData) {
      setSeo({
        id: seoData.id,
        meta_title: seoData.meta_title || "",
        meta_description: seoData.meta_description || "",
        meta_keywords: seoData.meta_keywords || [],
        canonical_url: seoData.canonical_url || "",
        og_image: seoData.og_image || "",
        schema_json: seoData.schema_json
          ? JSON.stringify(seoData.schema_json, null, 2)
          : "",
      })

      setKeywordsText(
        (seoData.meta_keywords || []).join(", ")
      )
    }

    setLoading(false)
  }

  async function save() {
    // content from the rich text editor is HTML, e.g. "<p></p>" when empty,
    // so we can't just check content.trim() the way we could with plain text
    const isContentEmpty =
      !content.trim() || content.replace(/<[^>]*>/g, "").trim() === ""

    if (!title.trim() || !slug.trim() || isContentEmpty) {
      alert("Title, slug and content are required.")
      return
    }

    setSaving(true)

    try {
      // Update CMS page
      const { error: pageError } = await supabase
        .from("cms_pages")
        .update({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          content: content.trim(),
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (pageError) {
        throw pageError
      }

      // Convert keyword text into array
      const keywords = keywordsText
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)

      // Convert schema JSON
      let schemaJson = null

      if (seo.schema_json.trim()) {
        try {
          schemaJson = JSON.parse(seo.schema_json)
        } catch {
          alert("Schema JSON is invalid.")
          return
        }
      }

      // Save SEO
      const { error: seoError } = await supabase
        .from("seo_metadata")
        .upsert(
          {
            page_type: "cms_page",
            page_id: id,
            meta_title: seo.meta_title.trim(),
            meta_description: seo.meta_description.trim(),
            meta_keywords: keywords,
            canonical_url: seo.canonical_url.trim() || null,
            og_image: seo.og_image.trim() || null,
            schema_json: schemaJson,
          },
          {
            onConflict: "page_id",
          }
        )

      if (seoError) {
        throw seoError
      }

      alert("Page and SEO updated successfully.")

      router.push("/admin/cms")
    } catch (error) {
      console.error("Save error:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/cms"
            className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CMS
          </Link>

          <h1 className="text-2xl font-bold">
            Edit Page
          </h1>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* PAGE */}
      <section className="rounded-lg border p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">
            Page Content
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage the page content and publishing status.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Slug
          </label>

          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Example: about-bloodbond
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Content
          </label>

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Enter page content..."
          />
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-lg border p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">
            SEO Settings
          </h2>

          <p className="text-sm text-muted-foreground">
            Configure search engine and social sharing metadata
            for this page.
          </p>
        </div>

        {/* Meta title */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Meta Title
          </label>

          <input
            value={seo.meta_title}
            onChange={(e) =>
              setSeo({
                ...seo,
                meta_title: e.target.value,
              })
            }
            maxLength={60}
            className="w-full rounded-md border px-3 py-2"
            placeholder="About BloodBond | Blood Donation Platform"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            {seo.meta_title.length}/60 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Meta Description
          </label>

          <textarea
            value={seo.meta_description}
            onChange={(e) =>
              setSeo({
                ...seo,
                meta_description: e.target.value,
              })
            }
            maxLength={160}
            className="min-h-[100px] w-full rounded-md border px-3 py-2"
            placeholder="Learn more about BloodBond..."
          />

          <p className="mt-1 text-xs text-muted-foreground">
            {seo.meta_description.length}/160 characters
          </p>
        </div>

        {/* Keywords */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Keywords
          </label>

          <input
            value={keywordsText}
            onChange={(e) =>
              setKeywordsText(e.target.value)
            }
            className="w-full rounded-md border px-3 py-2"
            placeholder="blood donation, blood donors, BloodBond"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Separate keywords with commas.
          </p>
        </div>

        {/* Canonical */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Canonical URL
          </label>

          <input
            value={seo.canonical_url}
            onChange={(e) =>
              setSeo({
                ...seo,
                canonical_url: e.target.value,
              })
            }
            className="w-full rounded-md border px-3 py-2"
            placeholder="https://example.com/about-bloodbond"
          />
        </div>

        {/* OG image */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Open Graph Image URL
          </label>

          <input
            value={seo.og_image}
            onChange={(e) =>
              setSeo({
                ...seo,
                og_image: e.target.value,
              })
            }
            className="w-full rounded-md border px-3 py-2"
            placeholder="https://example.com/images/about-og.jpg"
          />
        </div>

        {/* Schema */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Schema JSON-LD
          </label>

          <textarea
            value={seo.schema_json}
            onChange={(e) =>
              setSeo({
                ...seo,
                schema_json: e.target.value,
              })
            }
            className="min-h-[250px] w-full rounded-md border px-3 py-2 font-mono text-sm"
            placeholder={`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "About BloodBond"
}`}
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Enter valid JSON-LD.
          </p>
        </div>
      </section>

    </div>
  )
}
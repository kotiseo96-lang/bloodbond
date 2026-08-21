"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/integrations/supabase/client"
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  Search,
} from "lucide-react"

interface CMSPage {
  id: string
  title: string
  slug: string
  content: string
  status: string
  created_at: string
  updated_at: string
}

export default function CMSPagesPage() {
  const [pages, setPages] = useState<CMSPage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  async function loadPages() {
    setLoading(true)

    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading CMS pages:", error)
      alert(error.message)
      setLoading(false)
      return
    }

    setPages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadPages()
  }, [])

  async function deletePage(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this page?"
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("cms_pages")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    setPages((current) =>
      current.filter((page) => page.id !== id)
    )
  }

  const filteredPages = pages.filter((page) => {
    const query = search.toLowerCase()

    return (
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query)
    )
  })

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            CMS Pages
          </h1>

          <p className="text-muted-foreground">
            Create and manage website pages.
          </p>
        </div>

        <Link
          href="/admin/cms/create"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Create Page
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages..."
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && filteredPages.length === 0 && (
        <div className="rounded-lg border p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h2 className="text-lg font-semibold">
            No pages found
          </h2>

          <p className="mt-1 text-muted-foreground">
            Create your first CMS page.
          </p>
        </div>
      )}

      {/* Pages */}
      {!loading && filteredPages.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Page
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Slug
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Updated
                </th>

                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <div className="font-medium">
                      {page.title}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    /{page.slug}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        page.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">

                      <Link
                        href={`/admin/cms/${page.id}`}
                        className="rounded-md border p-2 hover:bg-muted"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => deletePage(page.id)}
                        className="rounded-md border p-2 text-destructive hover:bg-muted"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
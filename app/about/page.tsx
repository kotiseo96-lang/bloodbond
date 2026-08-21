import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DOMPurify from "isomorphic-dompurify"
import { supabase } from "@/integrations/supabase/client"
import Header from "@/src/components/site/Header"
import Footer from "@/src/components/site/Footer"

const SLUG = "about"

async function getPage() {
  const { data: page } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", SLUG)
    .eq("status", "published")
    .maybeSingle()

  if (!page) {
    return null
  }

  const { data: seo } = await supabase
    .from("seo_metadata")
    .select("*")
    .eq("page_id", page.id)
    .maybeSingle()

  return { page, seo }
}

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPage()

  if (!result) {
    return {}
  }

  const { page, seo } = result

  const title = seo?.meta_title || page.title
  const description = seo?.meta_description || undefined
  const keywords = seo?.meta_keywords?.length ? seo.meta_keywords : undefined

  return {
    title,
    description,
    keywords,
    alternates: seo?.canonical_url
      ? { canonical: seo.canonical_url }
      : undefined,
    openGraph: {
      title,
      description,
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
  }
}

export default async function AboutPage() {
  const result = await getPage()

  if (!result) {
    notFound()
  }

  const { page, seo } = result

  const safeContent = DOMPurify.sanitize(page.content)

  return (
    <>
      <Header />
      {seo?.schema_json ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo.schema_json),
          }}
        />
      ) : null}

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">{page.title}</h1>

        <div
          className="prose prose-neutral mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </article>
      <Footer />
    </>
  )
}
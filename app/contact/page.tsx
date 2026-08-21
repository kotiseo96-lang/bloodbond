import type { Metadata } from "next"
import DOMPurify from "isomorphic-dompurify"
import { supabase } from "@/integrations/supabase/client"
import Header from "@/src/components/site/Header"
import Footer from "@/src/components/site/Footer"
import ContactForm from "@/src/components/site/ContactForm"

const SLUG = "contact"

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
    return {
      title: "Contact Us | BloodBond",
      description: "Get in touch with the BloodBond team.",
    }
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

export default async function ContactPage() {
  const result = await getPage()
  const page = result?.page
  const seo = result?.seo

  const safeContent = page?.content ? DOMPurify.sanitize(page.content) : null

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
        <h1 className="text-3xl font-bold">{page?.title || "Contact Us"}</h1>

        {safeContent ? (
          <div
            className="prose prose-neutral mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        ) : (
          <p className="mt-4 text-gray-600">
            Have a question, feedback, or need help? Send us a message and we&apos;ll
            get back to you as soon as we can.
          </p>
        )}

        <div className="mt-10">
          <ContactForm />
        </div>
      </article>
      <Footer />
    </>
  )
}
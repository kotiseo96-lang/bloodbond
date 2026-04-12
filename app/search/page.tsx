"use client"

import { Suspense } from "react"
import Search from "@/src/pages/Search"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  )
}
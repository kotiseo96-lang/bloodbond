
"use client"

import * as React from "react"
import NextLink from "next/link"
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation"


export function useNavigate() {
  const router = useRouter()
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) router.replace(to)
    else router.push(to)
  }
}

export function useLocation() {
  const pathname = usePathname()
  const searchParams = useNextSearchParams()
  const search = searchParams.toString()
  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: "",
    state: null,
    key: pathname,
  }
}

export function useSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useNextSearchParams()

  const setSearchParams = (nextInit: URLSearchParams | string | Record<string, string>, options?: { replace?: boolean }) => {
    const params = new URLSearchParams(
      typeof nextInit === 'string'
        ? nextInit
        : nextInit instanceof URLSearchParams
          ? nextInit
          : Object.entries(nextInit),
    )
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
    if (options?.replace) router.replace(url)
    else router.push(url)
  }

  return [searchParams, setSearchParams] as const
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const router = useRouter()
  React.useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [router, to, replace])
  return null
}

export const Link = React.forwardRef<HTMLAnchorElement, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string; href?: string }>(function LinkCompat({ to, href, children, ...props }, ref) {
  return <NextLink href={href ?? to} ref={ref} {...props}>{children}</NextLink>
})

type ClassNameRenderer = string | ((props: { isActive: boolean }) => string)

export interface NavLinkProps extends Omit<React.ComponentProps<typeof NextLink>, 'href' | 'className'> {
  to: string
  className?: ClassNameRenderer
  children?: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode)
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, children, ...props },
  ref,
) {
  const pathname = usePathname()
  const isActive = pathname === to
  const computedClassName = typeof className === 'function' ? className({ isActive }) : className
  const computedChildren = typeof children === 'function' ? children({ isActive }) : children
  return (
    <NextLink href={to} className={computedClassName} ref={ref} {...props}>
      {computedChildren}
    </NextLink>
  )
})


"use client"

import { forwardRef } from "react"
import { NavLink as RouterNavLink, type NavLinkProps } from "@/lib/next-router-compat"

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string
  activeClassName?: string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className = "", activeClassName = "", ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        {...props}
        className={({ isActive }) => `${className} ${isActive ? activeClassName : ""}`.trim()}
      />
    )
  },
)

NavLink.displayName = "NavLink"

export { NavLink }

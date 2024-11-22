"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbConfig {
  [key: string]: {
    label: string
    href?: string
  }
}

const breadcrumbConfig: BreadcrumbConfig = {
  quiz: { label: "Quiz", href: "/quiz" },
  new: { label: "New Quiz" },
  podcast: { label: "Podcast", href: "/podcast" },
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const config = breadcrumbConfig[segment]
          const isLast = index === segments.length - 1

          // Handle dynamic routes (e.g., quiz/[id])
          if (!config && segment.length === 36) { // UUID length
            return (
              <BreadcrumbItem key={segment}>
                <BreadcrumbPage>Quiz Details</BreadcrumbPage>
              </BreadcrumbItem>
            )
          }

          if (!config) return null

          return (
            <BreadcrumbItem key={segment}>
              {!isLast && config.href ? (
                <>
                  <BreadcrumbLink href={config.href}>
                    {config.label}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 
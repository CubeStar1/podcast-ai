"use client"

import * as React from "react"
import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import { NavigationMobile } from "./NavigationMobile"

const components = [
  {
    title: "Podcast",
    href: "/podcast",
    description: "Convert PDFs to engaging podcast conversations"
  },
  {
    title: "Summary",
    href: "/summary",
    description: "Get quick summaries of your documents"
  },
  {
    title: "Quiz",
    href: "/quiz",
    description: "Create quizzes based on your documents"
  }
]

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-40 w-full bg-background/40 backdrop-blur-lg border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/podcasts-ai-logo.png" alt="Podcasts AI" width={32} height={32} />
            <span className="text-xl font-bold">Podcast AI</span>
          </Link>
        </div>
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {components.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <nav className="flex items-center space-x-4">
          <div className="md:hidden">
            <NavigationMobile components={components} />
          </div>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from './Icon'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'experience', label: 'Experience', href: '/experience' },
    { id: 'skills', label: 'Skills', href: '/skills' },
    { id: 'education', label: 'Education', href: '/education' },
    { id: 'projects', label: 'Projects', href: '/projects' }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent hover:from-accent hover:to-secondary transition-all duration-300"
          >
            Nat Lee
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group ${
                  isActive(item.href)
                    ? 'text-secondary bg-secondary/10 border border-secondary/20'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute inset-0 rounded-full bg-secondary/5 animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <a
              href="mailto:natlee.work@gmail.com"
              className="bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-dark-900 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25"
            >
              Contact Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-secondary transition-colors p-2"
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
              <span className={`bg-current block h-0.5 w-6 rounded-sm transition-all ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}></span>
              <span className={`bg-current block h-0.5 w-6 rounded-sm transition-all ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`bg-current block h-0.5 w-6 rounded-sm transition-all ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-dark-700">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-secondary bg-secondary/10 border border-secondary/20'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-dark-700">
                <a
                  href="mailto:natlee.work@gmail.com"
                  className="block w-full bg-gradient-to-r from-secondary to-accent text-dark-900 px-6 py-3 rounded-lg text-center font-medium transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
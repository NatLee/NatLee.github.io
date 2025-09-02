'use client'

import Image from 'next/image'
import { personalInfo } from '@/data/personal'
import Icon from './Icon'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-gray-900 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="text-center z-10 max-w-4xl mx-auto px-4">
        {/* Avatar */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.nameEn}
              width={220}
              height={220}
              className="mx-auto rounded-full border-4 border-secondary shadow-2xl hover:border-white transition-colors duration-300"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {personalInfo.nameEn}
        </h1>
        <h2 className="text-xl md:text-2xl text-secondary font-semibold mb-6">
          {personalInfo.title}
        </h2>
        
        {/* Bio */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          {personalInfo.bio}
        </p>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Icon name="mail" className="w-5 h-5 text-secondary" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="hidden sm:block text-gray-600">•</div>
          <div className="flex items-center gap-2">
            <Icon name="location" className="w-5 h-5 text-secondary" />
            <span>{personalInfo.location}</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {personalInfo.socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full border border-gray-600 hover:border-secondary transition-all duration-300 text-gray-300 hover:text-white"
              title={link.description}
            >
              <Icon name={link.icon} className="w-5 h-5 group-hover:text-secondary transition-colors" />
              <span className="text-sm font-medium">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Languages */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          {personalInfo.languages.map((lang) => (
            <span key={lang.name} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>{lang.name} ({lang.level})</span>
            </span>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Icon name="chevron-down" className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  )
}
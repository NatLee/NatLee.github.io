'use client'

import { personalInfo } from '@/data/personal'
import { skillsData } from '@/data/skills'
import Image from 'next/image'
import Icon from './Icon'

export default function About() {
  const getAsciiBar = (level: string): string => {
    const totalChars = 20
    let fill = 0
    switch (level) {
      case 'Expert': fill = 19; break;
      case 'Advanced': fill = 16; break;
      case 'Intermediate': fill = 12; break;
      default: fill = 6;
    }
    const filledChars = '#'.repeat(fill)
    const emptyChars = '.'.repeat(totalChars - fill)
    return `[${filledChars}${emptyChars}]`
  }

  return (
    <section id="about" className="min-h-screen pt-12 md:pt-16 pb-20 font-mono relative overflow-hidden pointer-events-none">

      {/* Global Background handled in layout */}

      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-6xl pointer-events-auto">

        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95 backdrop-blur-sm">
          {/* Terminal Header */}
          <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 sticky top-0 z-20 border-b border-gray-800">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400"></div>
            </div>
            <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
              natlee@mainframe: ~/profile (zsh)
            </div>
          </div>

          <div className="min-h-[80vh] p-6 md:p-12 text-gray-300">

            {/* Command Prompt */}
            <div className="mb-12 border-b border-gray-900 pb-8 pt-2">
              <span className="text-secondary font-bold">natlee@mainframe</span>:<span className="text-blue-500">~/profile</span>$ neofetch --ascii_distro linux
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">

              {/* Left Column - Image & System Info */}
              <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">

                {/* Glitch Profile Image Container */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 group mb-8">
                  {/* Scanlines */}
                  <div className="absolute inset-0 z-30 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-50 rounded-full"></div>

                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-secondary transition-colors">
                    <Image
                      src={personalInfo.avatar}
                      alt={personalInfo.nameEn}
                      fill
                      className="object-cover relative z-10 transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Glitch Layers */}
                    <Image
                      src={personalInfo.avatar}
                      alt=""
                      fill
                      className="object-cover absolute inset-0 z-20 opacity-0 group-hover:opacity-60 mix-blend-screen translate-x-1 translate-y-0 transition-opacity duration-100 pointer-events-none"
                    />
                    <Image
                      src={personalInfo.avatar}
                      alt=""
                      fill
                      className="object-cover absolute inset-0 z-20 opacity-0 group-hover:opacity-60 mix-blend-multiply -translate-x-1 translate-y-0 transition-opacity duration-100 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="w-full space-y-2 font-mono text-sm text-left bg-[#111] p-4 border border-gray-800 rounded">
                  <div className="flex gap-2"><span className="text-secondary font-bold">OS:</span> Linux x86_64</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">Host:</span> {personalInfo.nameEn}</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">Kernel:</span> Software Engineer v6.0</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">Uptime:</span> 6 years</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">Shell:</span> zsh 5.9</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">Resolution:</span> 3840x2160</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">CPU:</span> Neural Engine</div>
                  <div className="flex gap-2"><span className="text-secondary font-bold">Memory:</span> Full Stack</div>
                </div>
              </div>

              {/* Right Content - Bio */}
              <div className="lg:col-span-8">
                <div className="border-l-2 border-gray-800 pl-6 ml-2 space-y-6 text-gray-400 leading-relaxed font-sans text-lg">
                  <p>{personalInfo.bio}</p>
                  <p>
                    With over 6 years of experience in software development, I've worked across various domains
                    including energy trading, big data analytics, cybersecurity, and computer vision. My expertise
                    spans from backend development to AI/ML implementation.
                  </p>
                  <p>
                    I'm particularly passionate about leveraging technology to solve real-world problems,
                    whether it's optimizing energy trading strategies, building sentiment analysis platforms,
                    or developing computer vision solutions for healthcare.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  <div className="border border-gray-800 bg-[#0a0a0a] p-4 hover:border-secondary transition-colors group cursor-pointer text-center">
                    <a href={`mailto:${personalInfo.email}`} className="flex flex-col items-center gap-2">
                      <Icon name="mail" className="w-6 h-6 text-gray-500 group-hover:text-secondary" />
                      <span className="text-xs group-hover:text-white transition-colors">EMAIL</span>
                    </a>
                  </div>
                  <div className="border border-gray-800 bg-[#0a0a0a] p-4 hover:border-secondary transition-colors group cursor-pointer text-center">
                    <a href={personalInfo.socialLinks.find(link => link.name === 'GitHub')?.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2">
                      <Icon name="github" className="w-6 h-6 text-gray-500 group-hover:text-secondary" />
                      <span className="text-xs group-hover:text-white transition-colors">GITHUB</span>
                    </a>
                  </div>
                  <div className="border border-gray-800 bg-[#0a0a0a] p-4 hover:border-secondary transition-colors group cursor-pointer text-center">
                    <a href={personalInfo.socialLinks.find(link => link.name === 'LinkedIn')?.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2">
                      <Icon name="linkedin" className="w-6 h-6 text-gray-500 group-hover:text-secondary" />
                      <span className="text-xs group-hover:text-white transition-colors">LINKEDIN</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Merged Skills Section */}
            <div className="border-t border-gray-800 pt-12">
              <div className="mb-8 font-bold">
                <span className="text-green-500">➜</span> <span className="text-blue-400">~/skills</span> <span className="text-gray-500">ls -la</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skillsData.map((category) => (
                  <div key={category.id} className="mb-6">
                    <h4 className="text-secondary font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
                      ./{category.id}
                    </h4>
                    <div className="space-y-3 pl-2">
                      {category.skills.map((skill) => (
                        <div key={skill.name} className="group flex justify-between items-center text-sm">
                          <span className="text-gray-400 group-hover:text-white transition-colors">{skill.name}</span>
                          <span className="text-gray-600 text-xs font-mono">{getAsciiBar(skill.level)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-800 text-gray-600 text-xs text-center flex justify-between items-center px-4">
              <span>PKGS: {skillsData.flatMap(c => c.skills).length}</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
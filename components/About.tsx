'use client'

import { personalInfo } from '@/data/personal'
import Image from 'next/image'
import Icon from './Icon'

export default function About() {
  return (
    <section id="about" className="py-20 bg-dark-900 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-secondary via-neon-red to-accent bg-clip-text text-transparent">
                About Me
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover my journey as a software engineer, my passion for technology, 
              and the experiences that shape my approach to solving complex problems.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left Column - Profile Image */}
            <div className="lg:col-span-1">
              {/* Profile Image with Code Frame */}
              <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-6 animate-fade-in-right delay-100">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                    <span className="text-gray-400 text-sm font-mono ml-2">profile.png</span>
                </div>
                
                {/* Profile Image */}
                <div className="relative group">
                  <Image
                    src={personalInfo.avatar}
                    alt={personalInfo.nameEn}
                    width={400}
                    height={400}
                    className="mx-auto rounded-full border-4 border-secondary shadow-2xl hover:border-white transition-colors duration-300"
                  />
                </div>
                
                {/* Image metadata */}
                <div className="mt-4 pt-3 border-t border-gray-700 font-mono text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-secondary">400x400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="text-accent">PNG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                </div>
              </div>
              
              {/* Contact & Social Links */}
              <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 animate-fade-in-right delay-200">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                    <Icon name="mail" className="w-4 h-4 text-dark-900" />
                  </div>
                  Connect With Me
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group">
                    <Icon name="mail" className="w-5 h-5 text-secondary" />
                    <a href={`mailto:${personalInfo.email}`} className="text-gray-300 group-hover:text-secondary transition-colors">
                      {personalInfo.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group">
                    <Icon name="github" className="w-5 h-5 text-gray-400" />
                    <a href={personalInfo.socialLinks.find(link => link.name === 'GitHub')?.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 group-hover:text-white transition-colors">
                      GitHub Profile
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group">
                    <Icon name="linkedin" className="w-5 h-5 text-blue-400" />
                    <a href={personalInfo.socialLinks.find(link => link.name === 'LinkedIn')?.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 group-hover:text-blue-400 transition-colors">
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle & Right Columns - Bio and Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Section */}
              <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 animate-fade-in-left delay-100">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                    <Icon name="code" className="w-4 h-4 text-dark-900" />
                  </div>
                  My Journey
                </h3>
                
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    {personalInfo.bio}
                  </p>
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
              </div>

              {/* Stats & Interests Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Career Statistics */}
                <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 animate-fade-in-left delay-200">
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                      <Icon name="chart" className="w-4 h-4 text-dark-900" />
                    </div>
                    Career Highlights
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-dark-700 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">6+</div>
                      <div className="text-gray-400 text-sm">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-dark-700 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">50+</div>
                      <div className="text-gray-400 text-sm">Projects</div>
                    </div>
                    <div className="text-center p-4 bg-dark-700 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">5</div>
                      <div className="text-gray-400 text-sm">Companies</div>
                    </div>
                    <div className="text-center p-4 bg-dark-700 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">15+</div>
                      <div className="text-gray-400 text-sm">Technologies</div>
                    </div>
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 animate-fade-in-left delay-300">
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                      <Icon name="brain" className="w-4 h-4 text-dark-900" />
                    </div>
                    Areas of Interest
                  </h4>
                  
                  <div className="flex flex-wrap gap-3">
                    {personalInfo.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-dark-700 rounded-full text-sm text-gray-300 border border-dark-500 hover:border-secondary/50 hover:text-secondary transition-all duration-300 hover:scale-105"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
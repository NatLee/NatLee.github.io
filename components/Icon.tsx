'use client'

import React from 'react'
import { 
  SiPython, 
  SiReact, 
  SiDjango, 
  SiDocker, 
  SiAmazon, 
  SiPostgresql,
  SiPytorch,
  SiTensorflow,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiRedis,
  SiKubernetes,
  SiTerraform,
  SiJenkins,
  SiGit,
  SiGithub,
  SiGitlab,
  SiVuedotjs,
  SiAngular,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiSass,
  SiWebpack,
  SiVite,
  SiNpm,
  SiYarn,
  SiJest,
  SiCypress,
  SiSelenium,
  SiFigma,
  SiAdobexd,
  SiSketch,
  SiFastapi,
  SiExpress,
  SiScikitlearn,
  SiOpencv,
  SiHuggingface,
  SiElasticsearch,
  SiMysql,
  SiGooglecloud,

  SiVercel,
  SiNetlify
} from 'react-icons/si'
import { 
  FaBrain, 
  FaRobot,
  FaEye,
  FaCode,
  FaServer,
  FaDatabase,
  FaMobile,
  FaDesktop,
  FaCloud,
  FaShieldAlt,
  FaChartLine,
  FaGamepad,
  FaMusic,
  FaVideo,
  FaImage,
  FaJava,
  FaFileCode,
  FaTerminal,
  FaCogs,
  FaRocket,
  FaLightbulb,
  FaSearch,
  FaStar,
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
  FaImage as FaImageIcon
} from 'react-icons/fa'

interface IconProps {
  name: string
  className?: string
  size?: number
}

export default function Icon({ name, className = '', size = 24 }: IconProps) {
  // Core Technologies
  const coreTechIcons: Record<string, JSX.Element> = {
    // Frontend
    'react': <SiReact className={className} size={size} />,
    'nextjs': <SiNextdotjs className={className} size={size} />,
    'typescript': <SiTypescript className={className} size={size} />,
    'tailwind': <SiTailwindcss className={className} size={size} />,
    'vue': <SiVuedotjs className={className} size={size} />,
    'figma': <SiFigma className={className} size={size} />,
    'javascript': <SiJavascript className={className} size={size} />,
    
    // Backend
    'python': <SiPython className={className} size={size} />,
    'django': <SiDjango className={className} size={size} />,
    'fastapi': <SiFastapi className={className} size={size} />,
    'nodejs': <SiNodedotjs className={className} size={size} />,
    'express': <SiExpress className={className} size={size} />,
    'java': <FaJava className={className} size={size} />,
  
    // AI/ML
    'pytorch': <SiPytorch className={className} size={size} />,
    'tensorflow': <SiTensorflow className={className} size={size} />,
    'scikit': <SiScikitlearn className={className} size={size} />,
    'opencv': <SiOpencv className={className} size={size} />,
    'huggingface': <SiHuggingface className={className} size={size} />,
    
    // DevOps
    'docker': <SiDocker className={className} size={size} />,
    'kubernetes': <SiKubernetes className={className} size={size} />,
    'jenkins': <SiJenkins className={className} size={size} />,
    'git': <SiGit className={className} size={size} />,
    'github': <SiGithub className={className} size={size} />,
    
    // Database
    'postgresql': <SiPostgresql className={className} size={size} />,
    'mongodb': <SiMongodb className={className} size={size} />,
    'redis': <SiRedis className={className} size={size} />,
    'elasticsearch': <SiElasticsearch className={className} size={size} />,
    'mysql': <SiMysql className={className} size={size} />,
    
    // Cloud
    'aws': <SiAmazon className={className} size={size} />,
    'gcp': <SiGooglecloud className={className} size={size} />,
    'azure': <FaCloud className={className} size={size} />,
    'vercel': <SiVercel className={className} size={size} />,
    'netlify': <SiNetlify className={className} size={size} />,
    
    // Legacy support
    'Python': <SiPython className={className} size={size} />,
    'AI/ML': <FaBrain className={className} size={size} />,
    'Django': <SiDjango className={className} size={size} />,
    'React': <SiReact className={className} size={size} />,
    'Docker': <SiDocker className={className} size={size} />,
    'AWS': <SiAmazon className={className} size={size} />,
    'PostgreSQL': <SiPostgresql className={className} size={size} />,
    'PyTorch': <SiPytorch className={className} size={size} />
  }

  // Project Category Icons
  const categoryIcons: Record<string, JSX.Element> = {
    'AI/ML': <FaBrain className={className} size={size} />,
    'Computer Vision': <FaEye className={className} size={size} />,
    'Web Development': <FaCode className={className} size={size} />,
    'Backend': <FaServer className={className} size={size} />,
    'Frontend': <FaDesktop className={className} size={size} />,
    'Database': <FaDatabase className={className} size={size} />,
    'Mobile': <FaMobile className={className} size={size} />,
    'Cloud': <FaCloud className={className} size={size} />,
    'Security': <FaShieldAlt className={className} size={size} />,
    'Data Science': <FaChartLine className={className} size={size} />,
    'Game Development': <FaGamepad className={className} size={size} />,
    'Music': <FaMusic className={className} size={size} />,
    'Video': <FaVideo className={className} size={size} />,
    'Image Processing': <FaImage className={className} size={size} />,
    'DevOps': <FaCogs className={className} size={size} />,
    'API': <FaServer className={className} size={size} />,
    'Full Stack': <FaCode className={className} size={size} />,
    'Machine Learning': <FaBrain className={className} size={size} />,
    'Deep Learning': <FaBrain className={className} size={size} />,
    'NLP': <FaBrain className={className} size={size} />,
    'Blockchain': <FaShieldAlt className={className} size={size} />,
    'IoT': <FaCogs className={className} size={size} />,
    'Automation': <FaRobot className={className} size={size} />,
    'Analytics': <FaChartLine className={className} size={size} />,
    'Testing': <FaShieldAlt className={className} size={size} />,
    'Deployment': <FaRocket className={className} size={size} />,
    'Monitoring': <FaEye className={className} size={size} />,
    'Performance': <FaRocket className={className} size={size} />,
    'Scalability': <FaCloud className={className} size={size} />,
    'Microservices': <FaCogs className={className} size={size} />
  }

  // UI Icons (using react-icons)
  const uiIcons: Record<string, JSX.Element> = {
    'search': <FaSearch className={className} size={size} />,
    'star': <FaStar className={className} size={size} />,
    'code': <FaCode className={className} size={size} />,
    'arrow-right': <FaArrowRight className={className} size={size} />,
    'external-link': <FaExternalLinkAlt className={className} size={size} />,
    'github': <FaGithub className={className} size={size} />,
    'image': <FaImageIcon className={className} size={size} />
  }

  // Legacy SVG Icons
  const legacyIcons: Record<string, JSX.Element> = {
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    medium: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    kaggle: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336"/>
      </svg>
    ),
    leetcode: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    ),
    huggingface: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.036 3.736c-.904 0-1.64.736-1.64 1.64 0 .904.736 1.64 1.64 1.64.904 0 1.64-.736 1.64-1.64 0-.904-.736-1.64-1.64-1.64zM5.984 5.984c-.904 0-1.64.736-1.64 1.64 0 .904.736 1.64 1.64 1.64.904 0 1.64-.736 1.64-1.64 0-.904-.736-1.64-1.64-1.64zM18.016 5.984c-.904 0-1.64.736-1.64 1.64 0 .904.736 1.64 1.64 1.64.904 0 1.64-.736 1.64-1.64 0-.904-.736-1.64-1.64-1.64zM12.036 10.984c-1.992 0-3.608 1.616-3.608 3.608s1.616 3.608 3.608 3.608 3.608-1.616 3.608-3.608-1.616-3.608-3.608-3.608zm0 1.64c1.088 0 1.968.88 1.968 1.968s-.88 1.968-1.968 1.968-1.968-.88-1.968-1.968.88-1.968 1.968-1.968z"/>
      </svg>
    ),
    blog: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    "chevron-down": (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    "arrow-right": (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
      </svg>
    ),
    "arrow-left": (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
      </svg>
    ),
    "external-link": (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
      </svg>
    ),
    brain: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.33 12.91c.09-.09.15-.2.15-.33 0-.14-.06-.25-.15-.33-.09-.09-.2-.15-.33-.15-.13 0-.24.06-.33.15-.09.08-.15.19-.15.33 0 .13.06.24.15.33.09.09.2.15.33.15.13 0 .24-.06.33-.15M19.5 10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S18 8.17 18 9s.67 1.5 1.5 1.5m0 7c.83 0 1.5-.67 1.5-1.5S20.33 15 19.5 15s-1.5.67-1.5 1.5.67 1.5 1.5 1.5M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    server: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4 1h16c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2zm0 8h16c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2zm2 2v2h2v-2H6zm0-8v2h2V3H6zm12 8v2h2v-2h-2zm0-8v2h2V3h-2z"/>
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    tool: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
      </svg>
    ),
    image: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
    default: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    )
  }

  // Check all icon categories in order of priority
  const IconComponent = coreTechIcons[name] || 
                       categoryIcons[name] || 
                       uiIcons[name] || 
                       legacyIcons[name] || 
                       legacyIcons.default
  
  return (
    <div style={{ width: size, height: size }}>
      {IconComponent}
    </div>
  )
}
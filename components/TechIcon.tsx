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
  SiSketch
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

interface TechIconProps {
  name: string
  className?: string
  size?: number
}

export default function TechIcon({ name, className = '', size = 32 }: TechIconProps) {
  // Core Technologies
  const coreTechIcons: Record<string, JSX.Element> = {
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

  // UI Icons
  const uiIcons: Record<string, JSX.Element> = {
    'search': <FaSearch className={className} size={size} />,
    'star': <FaStar className={className} size={size} />,
    'code': <FaCode className={className} size={size} />,
    'arrow-right': <FaArrowRight className={className} size={size} />,
    'external-link': <FaExternalLinkAlt className={className} size={size} />,
    'github': <FaGithub className={className} size={size} />,
    'image': <FaImageIcon className={className} size={size} />
  }

  // Check all icon categories
  return coreTechIcons[name] || 
         categoryIcons[name] || 
         uiIcons[name] || 
         <FaRobot className={className} size={size} />
}

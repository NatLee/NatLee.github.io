// 圖示登記處：要用新圖示就在這裡加一個名字。品牌用 Simple Icons，介面用 Lucide。
import type { IconType } from 'react-icons'
import { FaLinkedin } from 'react-icons/fa'
import {
  LuArrowRight,
  LuArrowUpRight,
  LuBookOpen,
  LuCheck,
  LuCopy,
  LuFileText,
  LuGitPullRequest,
  LuGlobe,
  LuKeyboard,
  LuMail,
  LuMenu,
  LuMoon,
  LuPackage,
  LuPlay,
  LuPrinter,
  LuSearch,
  LuStar,
  LuSun,
  LuX,
} from 'react-icons/lu'
import { SiGithub, SiHexo, SiHuggingface, SiKaggle, SiLeetcode, SiMedium, SiPypi } from 'react-icons/si'

const registry = {
  github: SiGithub,
  linkedin: FaLinkedin,
  medium: SiMedium,
  blog: SiHexo,
  kaggle: SiKaggle,
  leetcode: SiLeetcode,
  huggingface: SiHuggingface,
  pypi: SiPypi,
  email: LuMail,
  arrow: LuArrowRight,
  external: LuArrowUpRight,
  star: LuStar,
  sun: LuSun,
  moon: LuMoon,
  search: LuSearch,
  close: LuX,
  menu: LuMenu,
  keyboard: LuKeyboard,
  print: LuPrinter,
  copy: LuCopy,
  check: LuCheck,
  docs: LuBookOpen,
  article: LuFileText,
  demo: LuPlay,
  package: LuPackage,
  pr: LuGitPullRequest,
  globe: LuGlobe,
} satisfies Record<string, IconType>

export type IconName = keyof typeof registry

interface IconProps {
  name: IconName | string
  size?: number
  className?: string
}

export default function Icon({ name, size = 16, className }: IconProps) {
  const Component = registry[name as IconName] ?? LuGlobe
  return <Component size={size} className={className} aria-hidden="true" focusable="false" />
}

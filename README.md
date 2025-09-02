# Nat Lee Portfolio

A modern, tech-savvy portfolio website built with React and Next.js, showcasing professional experience, projects, and technical expertise in AI/ML, backend development, and software engineering.

## ✨ Features

- 🚀 **Modern Tech Stack**: Built with Next.js 14, React 18, and TypeScript
- 🎨 **Tech-Savvy Design**: Dark theme with warm color palette and animated effects
- 📱 **Responsive Design**: Fully responsive across all devices
- ⚡ **Performance Optimized**: Static site generation with Next.js
- 🌐 **Multi-Page Structure**: Separate pages for About, Experience, Skills, Education, and Projects
- 🎯 **Interactive Elements**: Animated progress bars, hover effects, and smooth transitions
- 🔧 **Unified Icon System**: Centralized icon management with react-icons
- 📊 **Dynamic Data**: JSON-based data management for easy content updates
- 🏢 **Company Logos**: Dynamic company logo display with fallback handling
- 🌍 **Multi-Language Support**: Language skills showcase with proficiency levels

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Icons**: react-icons (Simple Icons & Font Awesome)
- **Images**: Next.js Image optimization
- **Deployment**: GitHub Pages (via GitHub Actions)
- **Data Management**: JSON files for content

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/natlee/NatLee.github.io.git
cd NatLee.github.io
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Static Export (for GitHub Pages)
npm run build:pages  # Build static files
npm run deploy       # Build and prepare for deployment

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Building for Production

**Standard Build:**
```bash
npm run build
```
Built files will be in the `.next/` directory.

**Static Export (GitHub Pages):**
```bash
npm run build:pages
```
Static files will be in the `out/` directory, ready for deployment.

## 🌟 Page Features

### Homepage (`/`)
- **TechHero**: Animated hero section with particle effects
- **QuickStats**: Career statistics and highlights
- **FeaturedProjects**: Showcase of top projects with interactive cards

### About Page (`/about`)
- **Personal Information**: Bio, contact details, and social links
- **Language Skills**: Multi-language proficiency with progress bars
- **Career Highlights**: Statistics and achievements
- **Areas of Interest**: Interactive interest tags

### Experience Page (`/experience`)
- **Timeline View**: Chronological work experience
- **Company Grouping**: Smart grouping of positions within same company
- **Company Logos**: Dynamic logo display with fallback handling
- **Detailed Descriptions**: Responsibilities, achievements, and tech stack

### Skills Page (`/skills`)
- **Categorized Skills**: Organized by technology type
- **Progress Visualization**: Animated progress bars
- **Proficiency Levels**: Expert, Advanced, Intermediate, Beginner
- **Experience Years**: Years of experience for each skill

### Education Page (`/education`)
- **Academic Timeline**: Educational background
- **School Information**: Institution details and logos
- **Degree Information**: Major, minor, and graduation details

### Projects Page (`/projects`)
- **Project Grid**: Filterable and searchable project showcase
- **Category Filtering**: Filter by technology or project type
- **Search Functionality**: Real-time project search
- **Project Details**: Individual project pages with full descriptions

## 📁 Project Structure

```
├── app/                          # Next.js 14 App Router
│   ├── about/                   # About page
│   ├── experience/              # Experience page
│   ├── skills/                  # Skills page
│   ├── education/               # Education page
│   ├── projects/                # Projects pages
│   │   └── [id]/               # Dynamic project detail pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                   # React components
│   ├── Navigation.tsx          # Site navigation
│   ├── TechHero.tsx            # Homepage hero section
│   ├── QuickStats.tsx          # Homepage statistics
│   ├── FeaturedProjects.tsx    # Featured projects showcase
│   ├── About.tsx               # About page component
│   ├── Experience.tsx          # Experience timeline
│   ├── Skills.tsx              # Skills visualization
│   ├── Education.tsx           # Education timeline
│   ├── ProjectsGrid.tsx        # Projects grid with filtering
│   ├── ProjectDetail.tsx       # Individual project details
│   ├── Icon.tsx                # Unified icon component
│   └── ImageSlider.tsx         # Project image carousel
├── data/                        # TypeScript data interfaces
│   ├── personal.ts             # Personal information
│   ├── experience.ts           # Work experience
│   ├── skills.ts               # Technical skills
│   ├── education.ts            # Education history
│   └── projects.ts             # Project data
├── assets/                      # JSON data files
│   └── data/                   # Content data
│       ├── personal.json       # Personal information
│       ├── experience.json     # Work experience
│       ├── skills.json         # Technical skills
│       ├── education.json      # Education history
│       ├── projects.json       # Project data
│       └── image-config.json   # Image URLs and config
├── public/                      # Static assets
│   └── CNAME                   # Custom domain config
├── .github/                     # GitHub configuration
│   └── workflows/              # GitHub Actions
│       └── deploy.yml          # Deployment workflow
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies and scripts
```

## Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions. The workflow:

1. Triggers on pushes to the `main` branch
2. Builds the Next.js application
3. Deploys the static files to GitHub Pages

### GitHub Pages Setup

To enable automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"
   - This will create the `gh-pages` branch automatically

2. **Configure Repository Settings**:
   - Ensure your repository is public (or you have GitHub Pro for private repos)
   - The workflow will automatically build and deploy on each push to `main`

3. **First Deployment**:
   - Push your code to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Check the Actions tab to monitor the deployment process

### Manual Deployment

If you need to deploy manually:

1. Build the project: `npm run build`
2. Upload the contents of the `out/` directory to your hosting service

### Deployment Branch

The project is configured to deploy to the `gh-pages` branch, which is automatically managed by GitHub Actions. This branch contains the built static files and is used by GitHub Pages to serve your website.

### Custom Domain (Optional)

To use a custom domain:

1. Add your domain to the `CNAME` file in the `public/` directory
2. Configure your DNS settings to point to GitHub Pages
3. Enable custom domain in repository Settings → Pages

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

- Builds the Next.js application
- Exports static files to the `out/` directory
- Deploys to GitHub Pages using the `gh-pages` branch
- Runs on every push to the `main` branch

You can also manually trigger the workflow from the Actions tab in your repository.

## 🎨 Customization

### Adding New Projects

Edit `assets/data/projects.json` to add new portfolio items:

```json
{
  "id": "project-id",
  "title": "Project Name",
  "description": "Project description",
  "category": "Web Development",
  "techStack": ["React", "TypeScript", "Tailwind CSS"],
  "images": ["image1.jpg", "image2.jpg"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project-url.com",
  "featured": true,
  "opensource": false,
  "features": ["Feature 1", "Feature 2"],
  "challenges": ["Challenge 1", "Challenge 2"],
  "solutions": ["Solution 1", "Solution 2"],
  "results": ["Result 1", "Result 2"]
}
```

### Updating Personal Information

Edit `assets/data/personal.json` to update personal details:

```json
{
  "name": "Your Name",
  "nameEn": "Your English Name",
  "title": "Software Engineer",
  "bio": "Your bio description",
  "email": "your.email@example.com",
  "avatar": "path/to/avatar.jpg",
  "socialLinks": [
    {
      "name": "GitHub",
      "url": "https://github.com/username"
    }
  ],
  "interests": ["AI/ML", "Web Development", "Backend"]
}
```

### Adding Work Experience

Edit `assets/data/experience.json` to add new work experience:

```json
{
  "id": "company-id",
  "title": "Job Title",
  "company": "Company Name",
  "companyId": "company-id",
  "companyLogo": "https://company-logo-url.com",
  "department": "Department Name",
  "location": "City, Country",
  "duration": "Jan 2023 - Present",
  "summary": "Job summary",
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "techStack": ["Python", "React", "Docker"],
  "achievements": ["Achievement 1", "Achievement 2"]
}
```

### Customizing Skills

Edit `assets/data/skills.json` to update technical skills:

```json
[
  {
    "id": "category-id",
    "name": "Category Name",
    "skills": [
      {
        "name": "Skill Name",
        "level": "Expert",
        "years": 5,
        "description": "Skill description"
      }
    ]
  }
]
```

### Styling & Theming

The project uses Tailwind CSS with a custom warm color theme. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'dark': {
        800: '#1a1a1a',
        900: '#0f0f0f',
      },
      'accent': '#ff6b35',
      'secondary': '#f7931e',
      'warm': {
        400: '#ff8c42',
        500: '#ff6b35',
        600: '#e55a2b',
      }
    }
  }
}
```

### Icon Management

The project uses a unified icon system. Add new icons in `components/Icon.tsx`:

```typescript
// Add to the appropriate icon category
const coreTechIcons: Record<string, JSX.Element> = {
  'NewTech': <SiNewTech className={className} size={size} />,
  // ... other icons
}
```

## Contributor
**Built with ❤️ by Nat Lee**

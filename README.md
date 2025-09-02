# Nat Lee Portfolio

A modern, responsive portfolio website built with React and Next.js, showcasing personal projects and professional experience.

## Features

- 🚀 **Modern Tech Stack**: Built with Next.js 14, React 18, and TypeScript
- 🎨 **Beautiful Design**: Clean, responsive design with Tailwind CSS
- 📱 **Mobile First**: Fully responsive across all devices
- ⚡ **Performance**: Optimized for speed and SEO
- 🌐 **Static Export**: Can be deployed to any static hosting service

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages (via GitHub Actions)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NatLee.github.io.git
cd NatLee.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `.next/` directory.

### Building for Static Export (GitHub Pages)

```bash
npm run build:pages
# or
npm run deploy
```

The static files will be in the `out/` directory, ready for deployment to GitHub Pages or any static hosting service.

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Hero.tsx           # Hero section
│   ├── PortfolioSection.tsx # Portfolio section wrapper
│   └── PortfolioTile.tsx  # Individual portfolio item
├── data/                   # Data files
│   └── portfolio.ts       # Portfolio data
├── public/                 # Static assets
│   └── assets/            # Images and other assets
├── .github/                # GitHub configuration
│   └── workflows/         # GitHub Actions
└── package.json            # Dependencies and scripts
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

## Customization

### Adding New Projects

Edit `data/portfolio.ts` to add new portfolio items:

```typescript
{
  imgSrc: "/path/to/image.jpg",
  link: "https://project-url.com",
  title: "Project Name",
  description: "Project description"
}
```

### Styling

The project uses Tailwind CSS. Custom styles can be added in `app/globals.css` using the `@layer` directive.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **GitHub**: [@natlee](https://github.com/natlee)
- **LinkedIn**: [Nat Lee](https://www.linkedin.com/in/nat-lee-726525ba/)
- **Medium**: [@natlee_](https://medium.com/@natlee_)


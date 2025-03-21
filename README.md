# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Material-UI. This website showcases projects, skills, and contact information with smooth animations and a clean design.

![Portfolio Demo Website](https://fullstackdevmaheshwar.netlify.app/)

## Features

- ✅ Responsive design - looks great on all devices
- ✅ Modern UI with Material-UI components
- ✅ Smooth animations with Framer Motion
- ✅ TypeScript for type safety
- ✅ Project cards with category icons
- ✅ Contact form with serverless functions
- ✅ Performance optimized
- ✅ SEO friendly

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Material-UI
  - Framer Motion
  - CSS Modules

- **Backend:**
  - Netlify Functions
  - MySQL database

- **Deployment:**
  - Netlify for hosting and serverless functions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Maheshwar3047/Portfolio-website-with-responsive-UI-project-cards-and-Netlify-deployment-setup.git
   cd Portfolio-website-with-responsive-UI-project-cards-and-Netlify-deployment-setup
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
REACT_APP_API_URL=http://localhost:8888/.netlify/functions
DB_HOST=your-db-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
```

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Deployment

This project is set up for deployment on Netlify. The `netlify.toml` file in the root directory contains the configuration for the deployment.

```bash
# Deploy to Netlify (draft)
npx netlify deploy

# Deploy to production
npx netlify deploy --prod
```

## Project Structure

```
.
├── build/                 # Build output
├── netlify/               # Netlify serverless functions
│   └── functions/         # Backend functions
├── public/                # Static assets
├── scripts/               # Build and utility scripts
└── src/                   # Source code
    ├── components/        # React components
    │   ├── AboutSection/
    │   ├── common/
    │   ├── ContactSection/
    │   ├── Footer/
    │   ├── HeroSection/
    │   ├── Layout/
    │   └── ProjectsSection/
    ├── hooks/             # Custom React hooks
    ├── providers/         # Context providers
    ├── theme/             # Theme configuration
    ├── types/             # TypeScript type definitions
    └── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Maheshwar - [maheshwar3047@gmail.com](mailto:maheshwar3047@gmail.com)

Project Link: [https://github.com/Maheshwar3047/Portfolio-website-with-responsive-UI-project-cards-and-Netlify-deployment-setup](https://github.com/Maheshwar3047/Portfolio-website-with-responsive-UI-project-cards-and-Netlify-deployment-setup)

Live Demo: [https://fullstackdevmaheshwar.netlify.app/](https://fullstackdevmaheshwar.netlify.app/)
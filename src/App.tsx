import React, { Suspense } from 'react';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { ThemeProvider } from './theme/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Helmet } from 'react-helmet-async';

// Component imports
import { HeroSection } from './components/HeroSection/HeroSection';
import { AboutSection } from './components/AboutSection/AboutSection';
import { ProjectsSection } from './components/ProjectsSection/ProjectsSection';
import { ContactSection } from './components/ContactSection/ContactSection';

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Helmet>
          <title>Maheshwar - Full Stack Developer Portfolio</title>
          <meta name="description" content="Full Stack Developer specializing in React, TypeScript, and Node.js. View my projects and get in touch for collaboration opportunities." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Helmet>
        <CssBaseline />
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <ContactSection />
          </Suspense>
        </Layout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

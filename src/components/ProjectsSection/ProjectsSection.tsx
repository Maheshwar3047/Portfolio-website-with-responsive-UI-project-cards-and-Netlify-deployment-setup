import React from 'react';
import { Box, Container, Typography, Grid, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import styles from './ProjectsSection.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link: string;
  githubLink?: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'design';
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'frontend':
      return <CodeIcon fontSize="small" />;
    case 'backend':
      return <StorageIcon fontSize="small" />;
    case 'design':
      return <DesignServicesIcon fontSize="small" />;
    default:
      return <GitHubIcon fontSize="small" />;
  }
};

const projects: Project[] = [
  {
    id: '1',
    title: 'Interactive Dashboard UI',
    description: 'Built a responsive dashboard with pure HTML, CSS, and JavaScript. Features include dark/light theme toggle, interactive charts using Chart.js, custom animations, and localStorage for user preferences.',
    imageUrl: '/images/dashboard.jpg',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js'],
    link: 'https://github.com/yourusername/dashboard-ui',
    githubLink: 'https://github.com/yourusername/dashboard-ui',
    category: 'frontend'
  },
  {
    id: '2',
    title: 'Full-Stack E-commerce Platform',
    description: 'High-performance e-commerce platform with real-time inventory, search filters, and secure payments. Features cart persistence and admin dashboard.',
    imageUrl: '/images/ecommerce.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Redis'],
    link: 'https://github.com/yourusername/ecommerce',
    githubLink: 'https://github.com/yourusername/ecommerce',
    category: 'fullstack'
  },
  {
    id: '3',
    title: 'Real-time Chat Application',
    description: 'Scalable chat app with group chats, file sharing, and message persistence. Features end-to-end encryption and search.',
    imageUrl: '/images/chat-app.jpg',
    technologies: ['React', 'Node.js', 'Socket.IO', 'PostgreSQL'],
    link: 'https://github.com/yourusername/chat-app',
    githubLink: 'https://github.com/yourusername/chat-app',
    category: 'backend'
  }
];

export const ProjectsSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="projects"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Projects
          </Typography>

          <Grid container spacing={4}>
            {projects.map((project, index) => (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                >
                  <Box className={styles.projectCard}>
                    <Box className={styles.projectHeader}>
                      <Box className={styles.projectCategory}>
                        <Tooltip title={project.category.charAt(0).toUpperCase() + project.category.slice(1)}>
                          <Chip
                            icon={getCategoryIcon(project.category)}
                            label={project.category}
                            size="small"
                            color="primary"
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box className={styles.projectContent}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        className={styles.projectTitle}
                      >
                        {project.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph
                        className={styles.projectDescription}
                      >
                        {project.description}
                      </Typography>
                      <Box className={styles.projectTechContainer}>
                        {project.technologies.map((tech) => (
                          <Typography
                            key={tech}
                            variant="caption"
                            className={styles.projectTech}
                          >
                            {tech}
                          </Typography>
                        ))}
                      </Box>
                      <Box className={styles.projectLinks}>
                        <Box
                          component="a"
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                        >
                          View Project <LaunchIcon fontSize="small" />
                        </Box>
                        {project.githubLink && (
                          <Box
                            component="a"
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.githubLink}
                          >
                            <GitHubIcon fontSize="small" />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};
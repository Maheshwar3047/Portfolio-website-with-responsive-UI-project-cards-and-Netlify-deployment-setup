import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';
import { Footer } from '../Footer/Footer';

const navItems = [
  { label: 'Home', href: '#home', icon: <HomeIcon /> },
  { label: 'About', href: '#about', icon: <PersonIcon /> },
  { label: 'Projects', href: '#projects', icon: <WorkIcon /> },
  { label: 'Contact', href: '#contact', icon: <EmailIcon /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-50% 0px -50% 0px'
      }
    );

    document.querySelectorAll('section[id], div[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = useCallback((href: string) => {
    const sectionId = href.substring(1); // Remove the # from href
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 64; // AppBar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Manually set active section when clicked
      setActiveSection(sectionId);
    }
    if (mobileOpen) setMobileOpen(false);
  }, [mobileOpen]);

  const drawer = (
    <Box 
      onClick={handleDrawerToggle} 
      sx={{ 
        textAlign: 'center',
        py: 2,
        minWidth: 280,
        background: (theme) => theme.palette.background.paper,
        height: '100%',
      }}
    >
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            mb: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <CodeIcon color="primary" />
          CodeCraft
        </Typography>
        <List>
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => scrollToSection(item.href)}
                  selected={activeSection === item.href.substring(1)}
                  sx={{
                    my: 0.5,
                    mx: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: activeSection === item.href.substring(1) ? 'inherit' : 'primary.main'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500 }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </motion.div>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        elevation={isScrolled ? 2 : 0}
        sx={{
          bgcolor: isScrolled ? 'background.paper' : 'transparent',
          backdropFilter: isScrolled ? 'blur(8px)' : 'none',
          transition: theme.transitions.create(['background-color', 'box-shadow', 'backdrop-filter'], {
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between',
              height: { xs: 64, md: 80 },
              transition: 'height 0.3s ease'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                color: activeSection === 'home' ? 'primary.main' : 'text.primary',
              }}
              onClick={() => scrollToSection('#home')}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <CodeIcon 
                  sx={{ 
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    color: activeSection === 'home' ? 'primary.main' : 'inherit',
                  }} 
                />
              </motion.div>
              <Typography 
                variant="h6" 
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CodeCraft
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile ? (
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      onClick={() => scrollToSection(item.href)}
                      startIcon={
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.icon}
                        </motion.div>
                      }
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        color: activeSection === item.href.substring(1) ? 'primary.main' : 'text.primary',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          '& .MuiButton-startIcon': {
                            color: 'primary.main',
                          },
                        },
                        '& .MuiButton-startIcon': {
                          transition: 'all 0.3s ease',
                          color: activeSection === item.href.substring(1) ? 'primary.main' : 'inherit',
                        },
                        ...(activeSection === item.href.substring(1) && {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        }),
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 320 },
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          }
        }}
      >
        {drawer}
      </Drawer>
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1, 
          pt: { xs: 8, sm: 9 },
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
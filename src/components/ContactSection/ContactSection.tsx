import React, { memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import { motion } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const ContactLink = memo(({ href, icon: Icon, text }: { 
  href: string; 
  icon: typeof WhatsAppIcon; 
  text: string;
}) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 2,
    mb: 3 
  }}>
    <Icon fontSize="large" color="primary" />
    <Typography variant="h6">
      <MuiLink 
        href={href}
        target={href.startsWith('https') ? "_blank" : undefined}
        rel={href.startsWith('https') ? "noopener noreferrer" : undefined}
        underline="hover"
        color="inherit"
      >
        {text}
      </MuiLink>
    </Typography>
  </Box>
));

ContactLink.displayName = 'ContactLink';

export const ContactSection = memo(() => {
  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'white',
      }}
    >
      <Container maxWidth="md">
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
            sx={{ mb: 4 }}
          >
            Get in Touch with Maheshwar
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <ContactLink 
                href="https://wa.me/919500879156"
                icon={WhatsAppIcon}
                text="+91 9500879156"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ContactLink 
                href="mailto:maheshwar3047@gmail.com"
                icon={EmailIcon}
                text="maheshwar3047@gmail.com"
              />
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
});
import React from 'react';
import { Box, Container, IconButton, Typography, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export const Footer = () => {
  const socialLinks = [
    { icon: <GitHubIcon />, url: 'https://github.com/yourusername', label: 'GitHub' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="text.secondary" variant="body2">
            © {new Date().getFullYear()} Your Name. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            {socialLinks.map((link) => (
              <IconButton
                key={link.label}
                color="primary"
                aria-label={link.label}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                {link.icon}
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
import React from "react";
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Stack } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";
import { Link } from "react-router-dom";

function Footer() {
  return (
      <Box
          component="footer"
          sx={{
            backgroundColor: "#3C2F2F",
            color: "white",
            py: 4,
            mt: "auto", // Pushes the footer to the bottom of the page
            borderTop: "5px solid #F59E0B"
          }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between">

            {/* Brand & Slogan Section */}
            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ fontFamily: "'Fredoka One', cursive", color: "#F59E0B", mb: 1.5 }}>
                TarPets 🐾
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6, maxWidth: "400px" }}>
                Your dear friends' happiness is our happiness!
                The highest quality foods and toys are at your door with TarPets assurance.
              </Typography>
            </Grid>

            {/* Quick Access Links */}
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1.5, color: "#F59E0B" }}>
                Quick Access
              </Typography>
              <Stack spacing={0.5}>
                <MuiLink component={Link} to="/" color="inherit" underline="hover" variant="body2">Home</MuiLink>
                <MuiLink component={Link} to="/products" color="inherit" underline="hover" variant="body2">All Products</MuiLink>
                <MuiLink component={Link} to="/cart" color="inherit" underline="hover" variant="body2">My Cart</MuiLink>
              </Stack>
            </Grid>

            {/* Contact & Social Media */}
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1.5, color: "#F59E0B" }}>
                Contact Us
              </Typography>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 0.5, display: 'block' }}>📍 Paw Street No:1, Istanbul</Typography>
                <Typography variant="body2" sx={{ display: 'block' }}>📧 info@tarpets.com</Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ ml: -1 }}>
                <IconButton color="inherit" size="small"><Instagram fontSize="small" /></IconButton>
                <IconButton color="inherit" size="small"><Twitter fontSize="small" /></IconButton>
                <IconButton color="inherit" size="small"><Facebook fontSize="small" /></IconButton>
                <IconButton color="inherit" size="small"><LinkedIn fontSize="small" /></IconButton>
              </Stack>
            </Grid>
          </Grid>

          {/* Copyright Area */}
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 3, pt: 2, textAlign: "center" }}>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              © 2025 TarPets. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
  );
}

export default Footer;
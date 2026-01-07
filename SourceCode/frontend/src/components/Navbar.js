import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  InputBase,
  Badge,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

// Icon Set
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalMallIcon from '@mui/icons-material/LocalMall';

function Navbar() {
  // Global State Connections
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  // Calculate total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Local State Definitions
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);       // Mobile menu control
  const [userMenuAnchor, setUserMenuAnchor] = useState(null); // User profile menu

  const navigate = useNavigate();

  // Menu Open/Close Logic
  const openMobileMenu = Boolean(anchorEl);
  // CRITICAL: if userMenuAnchor is null, menu will NEVER open. (Solves auto-open issue)
  const openUserMenu = Boolean(userMenuAnchor);

  // Search Function
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm("");
    }
  };

  // Logout Process
  const handleLogout = () => {
    logout();
    navigate("/");
    setAnchorEl(null);
    setUserMenuAnchor(null);
  };

  return (
      <AppBar position="sticky" sx={{ backgroundColor: "#F59E0B", top: 0, zIndex: 1100 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 0, md: 2 } }}>

            {/* 1. LOGO AREA */}
            <Typography
                component={Link}
                to="/"
                variant="h4"
                sx={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "900",
                  fontFamily: "'Fredoka', sans-serif",
                  letterSpacing: 1
                }}
            >
              TarPets 🐾
            </Typography>

            {/* 2. SEARCH BAR (Visible only on Tablet and Desktop) */}
            <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "50px",
                  px: 2,
                  mx: 4,
                  flexGrow: 1,
                  maxWidth: "500px",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" }
                }}
            >
              <InputBase
                  placeholder="Search food, toys or leashes..."
                  sx={{ color: "white", flex: 1, py: 0.5 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconButton type="submit" sx={{ color: "white" }}>
                <SearchIcon />
              </IconButton>
            </Box>

            {/* 3. RIGHT MENU GROUP */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

              {/* Desktop Navigation Links */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Button component={Link} to="/" sx={{ color: "white", fontWeight: "bold" }}>
                  Home
                </Button>
                <Button component={Link} to="/products" sx={{ color: "white", fontWeight: "bold" }}>
                  Products
                </Button>

                {/* Buttons to show if not logged in */}
                {!user && (
                    <>
                      <Button component={Link} to="/login" variant="outlined" sx={{ color: "white", borderColor: "white", ml: 1 }}>
                        Login
                      </Button>
                      <Button component={Link} to="/register" variant="contained" sx={{ backgroundColor: "white", color: "#F59E0B", ml: 1, "&:hover":{ backgroundColor: "#FFF8E1" } }}>
                        Register
                      </Button>
                    </>
                )}
              </Box>

              {/* User Profile Menu (If Logged In) */}
              {user && (
                  <>
                    <Tooltip title="My Account">
                      <IconButton
                          onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                          sx={{ p: 0, ml: 1, border: "2px solid white" }}
                      >
                        <PersonIcon sx={{ color: "white", fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={userMenuAnchor}
                        open={openUserMenu}
                        onClose={() => setUserMenuAnchor(null)}
                        // EXTENSION: Ensures menu opens right below the icon and aligned right
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                          sx: { mt: 1.5, minWidth: 220, borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }
                        }}
                    >
                      <MenuItem disabled sx={{ opacity: "1 !important", fontWeight: "bold", color: "#F59E0B" }}>
                        👋 Hello, {user.name}
                      </MenuItem>

                      <Divider />

                      <MenuItem component={Link} to="/mypet" onClick={() => setUserMenuAnchor(null)}>
                        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                        My Profile
                      </MenuItem>

                      <MenuItem component={Link} to="/orders" onClick={() => setUserMenuAnchor(null)}>
                        <ListItemIcon><LocalMallIcon fontSize="small" /></ListItemIcon>
                        My Orders
                      </MenuItem>

                      {user.role === "ADMIN" && (
                          <MenuItem component={Link} to="/admin" onClick={() => setUserMenuAnchor(null)}>
                            <ListItemIcon><AdminPanelSettingsIcon fontSize="small" sx={{ color: "red" }} /></ListItemIcon>
                            Admin Panel
                          </MenuItem>
                      )}

                      <Divider />

                      <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                        <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "red" }} /></ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
              )}

              {/* Cart Icon and Badge (Counter) */}
              <Tooltip title="My Cart">
                <IconButton component={Link} to="/cart" sx={{ color: "white", ml: 1 }}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon fontSize="medium" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Mobile Menu Trigger (Hamburger Menu) */}
              <IconButton
                  sx={{ display: { xs: "flex", md: "none" }, color: "white", ml: 1 }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MenuIcon fontSize="large" />
              </IconButton>

              {/* Mobile Menu Content */}
              <Menu
                  anchorEl={anchorEl}
                  open={openMobileMenu}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { width: "200px" } }}
              >
                <MenuItem component={Link} to="/" onClick={() => setAnchorEl(null)}>
                  Home
                </MenuItem>

                <MenuItem component={Link} to="/products" onClick={() => setAnchorEl(null)}>
                  Products
                </MenuItem>

                <Divider />

                {!user && (
                    <MenuItem component={Link} to="/login" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                      Login
                    </MenuItem>
                )}

                {!user && (
                    <MenuItem component={Link} to="/register" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                      Register
                    </MenuItem>
                )}

                {user && (
                    <MenuItem component={Link} to="/mypet" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                      My Profile
                    </MenuItem>
                )}

                {user && (
                    <MenuItem component={Link} to="/orders" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><LocalMallIcon fontSize="small" /></ListItemIcon>
                      My Orders
                    </MenuItem>
                )}

                {user && <Divider />}

                {user && (
                    <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                      <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                      Logout
                    </MenuItem>
                )}
              </Menu>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>
  );
}

export default Navbar;
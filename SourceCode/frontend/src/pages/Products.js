import React, { useEffect, useState, useContext } from "react";
// Service Layer: Separating data fetching from UI (Separation of Concerns).
import { getAllProducts } from "../service/productService";

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip,
  Fade
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Components
import ProductCard from "../components/ProductCard";

function Products() {
  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSubcat, setSelectedSubcat] = useState("All");

  const { addToCart } = useContext(CartContext);

  // URL Parameter Management (Query Strings):
  // Reads parameters like '?category=cat' or '?search=food' from the URL.
  // This ensures filters persist when sharing links (Deep Linking).
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  // Data Fetching (Lifecycle):
  // Fetches all products from the service when the page loads.
  useEffect(() => {
    setLoading(true);

    getAllProducts()
        .then((data) => {
          setProducts(data);
          setError(false);
        })
        .catch((err) => {
          console.error("Products API error:", err);
          setError(true);
        })
        .finally(() => setLoading(false));
  }, []);

  // UX Improvement:
  // Resets the subcategory filter when the main category or search term changes.
  useEffect(() => {
    setSelectedSubcat("All");
  }, [categoryParam, searchParam]);

  // Filtering Logic (Client-Side Filtering):
  // Fetches data once and filters it in the browser for performance.
  const filteredProducts = products.filter((product) => {
    // 1. Search Filter (Case-insensitive)
    if (searchParam) {
      return product.name.toLowerCase().includes(searchParam.toLowerCase());
    }
    // 2. Main Category Filter
    if (categoryParam && product.category !== categoryParam) {
      return false;
    }
    // 3. Subcategory Filter
    if (selectedSubcat !== "All" && product.subcategory !== selectedSubcat) {
      return false;
    }
    return true;
  });

  // Dynamic Subcategory Extraction:
  // Calculates unique subcategories from the currently selected main category.
  // Using Set data structure prevents duplicate values.
  const currentCategoryProducts = categoryParam
      ? products.filter(p => p.category === categoryParam)
      : products;

  const subcategories = ["All", ...new Set(currentCategoryProducts.map(p => p.subcategory).filter(Boolean))];

  // Category Titles (Mapping Object)
  const categoryNames = {
    cat: "Cat Products 🐱",
    dog: "Dog Products 🐶",
    bird: "Bird Products 🐦",
    fish: "Fish Products 🐠",
    rodent: "Rodent Products 🐹",
    reptile: "Reptile Products 🐢",
  };

  return (
      <Box sx={{ backgroundColor: "#FAFAFA", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="xl">

          {/* Header and Results Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "900", color: "#3C2F2F", display: "flex", alignItems: "center", gap: 1 }}>
              {searchParam
                  ? `Results for "${searchParam}"`
                  : (categoryNames[categoryParam] || "All Products")
              }
              {!searchParam && !categoryParam && <RocketLaunchIcon sx={{ color: "#F59E0B" }} />}
            </Typography>

            <Typography variant="body1" sx={{ opacity: 0.7, mt: 1 }}>
              {filteredProducts.length} products found
            </Typography>
          </Box>

          {/* Dynamic Subcategory Filters (Chips) */}
          {!loading && subcategories.length > 1 && !searchParam && (
              <Stack direction="row" spacing={1} sx={{ mb: 4, overflowX: "auto", py: 1 }}>
                <FilterListIcon sx={{ color: "gray", alignSelf: "center", mr: 1 }} />
                {subcategories.map((subcat) => (
                    <Chip
                        key={subcat}
                        label={subcat}
                        clickable
                        onClick={() => setSelectedSubcat(subcat)}
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: selectedSubcat === subcat ? "#F59E0B" : "white",
                          color: selectedSubcat === subcat ? "white" : "gray",
                          border: selectedSubcat === subcat ? "none" : "1px solid #e0e0e0",
                          "&:hover": {
                            backgroundColor: selectedSubcat === subcat ? "#d98c0a" : "#f5f5f5"
                          }
                        }}
                    />
                ))}
              </Stack>
          )}

          {/* State Management and Listing */}
          {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress color="warning" size={60} />
              </Box>
          ) : error ? (
              <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />}>
                Failed to load products! Please check your connection.
              </Alert>
          ) : filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" color="text.secondary">No products found. 🐾</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.href = "/products"}>
                  Clear Filters
                </Button>
              </Box>
          ) : (
              // Responsive Grid Structure
              <Box sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                  xl: "repeat(4, 1fr)"
                },
                gap: 3,
                alignItems: "stretch"
              }}>
                {filteredProducts.map((product) => (
                    <Fade in={true} timeout={500} key={product.id}>
                      <Box sx={{ height: '100%' }}>
                        {/* Reusable UI Component Usage */}
                        <ProductCard product={product} addToCart={addToCart} />
                      </Box>
                    </Fade>
                ))}
              </Box>
          )}

        </Container>
      </Box>
  );
}

export default Products;
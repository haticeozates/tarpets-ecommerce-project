import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Container,
  CircularProgress,
  Fade
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

function MyPet() {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [petTypeCounts, setPetTypeCounts] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper function to shuffle array items
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    setLoading(true);

    const fetchData = async () => {
      try {
        // 1. Fetch full user info to get pets array
        const userRes = await api.get(`/api/users/${user.id}`);
        if (cancelled) return;

        const fullUser = userRes.data;
        const counts = {};

        if (Array.isArray(fullUser.pets) && fullUser.pets.length > 0) {
          fullUser.pets.forEach((p) => {
            const type = (p.type || "Unknown").trim();
            if (!type) return;
            counts[type] = (counts[type] || 0) + 1;
          });
        } else if (user.petType) {
          counts[user.petType] = user.petCount || 1;
        }

        setPetTypeCounts(counts);

        const petTypes = Object.keys(counts);
        if (petTypes.length === 0) {
          setRecommendedProducts([]);
          return;
        }

        // 2. Fetch all products
        const productRes = await api.get("/api/products");
        if (cancelled) return;

        const products = productRes.data || [];

        // Group products by pet type
        const productsByType = {};
        petTypes.forEach((t) => (productsByType[t] = []));

        products.forEach((p) => {
          if (!p.category) return;
          petTypes.forEach((t) => {
            const cat = p.category.toLowerCase();
            const tt = t.toLowerCase();
            if (cat === tt || cat.includes(tt) || tt.includes(cat)) {
              productsByType[t].push(p);
            }
          });
        });

        // 3. Balanced and random recommendation algorithm
        const TOTAL = 4;
        const base = Math.floor(TOTAL / petTypes.length);
        let remainder = TOTAL - base * petTypes.length;

        const allocation = {};
        petTypes.forEach((t) => (allocation[t] = base));

        shuffle(petTypes).forEach((t) => {
          if (remainder > 0) {
            allocation[t]++;
            remainder--;
          }
        });

        const selected = [];
        const usedIds = new Set();

        petTypes.forEach((t) => {
          const pool = shuffle(productsByType[t]);
          for (let i = 0; i < allocation[t] && i < pool.length; i++) {
            if (!usedIds.has(pool[i].id)) {
              selected.push(pool[i]);
              usedIds.add(pool[i].id);
            }
          }
        });

        // Fill remaining slots if needed (Fallback)
        if (selected.length < TOTAL) {
          const fallbackPool = shuffle(
              products.filter(
                  (p) =>
                      !usedIds.has(p.id) &&
                      petTypes.some((t) =>
                          p.category?.toLowerCase().includes(t.toLowerCase())
                      )
              )
          );

          for (let p of fallbackPool) {
            if (selected.length >= TOTAL) break;
            selected.push(p);
          }
        }

        setRecommendedProducts(selected.slice(0, TOTAL));
      } catch (err) {
        console.error("MyPet recommendation error:", err);
        setRecommendedProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
        <Container sx={{ mt: 6, textAlign: "center" }}>
          <Typography>Please log in to view your profile.</Typography>
        </Container>
    );
  }

  return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#FFF7ED", py: 5 }}>
        {/* PROFILE SECTION */}
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 4, border: "1px solid #ffcc80" }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2
                  }}
              >
                <PetsIcon sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }}>
              <Chip label="Account Information" size="small" />
            </Divider>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight="bold">Phone:</Typography>
              <Typography>{user.phone || "-"}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography fontWeight="bold">Role:</Typography>
              <Chip label={user.role} size="small" variant="outlined" />
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="Pet Information" color="warning" size="small" />
            </Divider>

            {loading && <CircularProgress size={24} />}
            {!loading && Object.keys(petTypeCounts).length === 0 && (
                <Typography color="text.secondary">No pets specified.</Typography>
            )}

            {Object.entries(petTypeCounts).map(([type, count]) => (
                <Box
                    key={type}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography fontWeight="bold">{type.toUpperCase()}</Typography>
                  <Typography>{count}</Typography>
                </Box>
            ))}
          </Paper>
        </Container>

        {/* RECOMMENDATIONS SECTION */}
        {recommendedProducts.length > 0 && (
            <Container maxWidth="xl" sx={{ mt: 8 }}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                🐾 {user.name}, we picked these for your friend:
              </Typography>

              <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)"
                    },
                    gap: 3
                  }}
              >
                {recommendedProducts.map((product) => (
                    <Fade in key={product.id}>
                      <Box>
                        <ProductCard product={product} addToCart={addToCart} />
                      </Box>
                    </Fade>
                ))}
              </Box>
            </Container>
        )}
      </Box>
  );
}

export default MyPet;
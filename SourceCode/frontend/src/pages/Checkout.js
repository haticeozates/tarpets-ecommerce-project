import React, { useEffect, useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import {
  Container, Typography, CircularProgress, Box, Paper, Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { createCheckoutSession } from "../service/orderService";
import HttpsIcon from '@mui/icons-material/Https';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Stripe Public Key
const stripePromise = loadStripe("pk_test_51SeFsQADFScXHxXExsdKk6wFi4AyDV04Han4tGVv6E9UicxdsXmCBIZHpv1SrSof4PrLx8qXtURMVMjYHDbi8bdq00fgBpknGa");

function Checkout() {
  const { totalPrice, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // UX Improvement: Ensures scroll to top on mount.
    // Prevents starting in the middle of the page, especially when iframe loads on mobile.
    window.scrollTo(0, 0);

    // Security & Logic Checks
    if (!user) { navigate("/login"); return; }
    if (cart.length === 0) { navigate("/products"); return; }

    // Backend Communication: Initialize Checkout Session
    createCheckoutSession({
      userId: user.id,
      totalPrice: totalPrice,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    })
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => {
          console.error("Stripe Session Error:", err);
          setError(true);
        });

  }, [user, totalPrice, cart, navigate]);

  // Error State Screen
  if (error) return (
      <Container maxWidth="sm" sx={{ mt: 15, textAlign: 'center' }}>
        <Paper sx={{ p: 5 }}>
          <Typography color="error" variant="h6">System Unavailable</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Please try again later.</Typography>
          <Button onClick={() => navigate("/cart")} sx={{ mt: 2 }}>Back to Cart</Button>
        </Paper>
      </Container>
  );

  // Loading Screen (Waiting for Client Secret)
  if (!clientSecret) return (
      <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#F59E0B" }} />
      </Box>
  );

  return (
      <Box sx={{
        backgroundColor: "#f9f9f9",
        minHeight: "100dvh",
        py: { xs: 0, md: 5 },
        position: "relative",
        // Layout Stability (CLS) Solution:
        // Prevents browser from auto-scrolling (Scroll Anchoring) while Stripe iframe loads.
        overflowAnchor: "none"
      }}>
        <Container maxWidth="md" disableGutters sx={{ px: { xs: 0, md: 2 } }}>

          {/* Back Button (Desktop Only) */}
          <Box sx={{ p: 2, display: { xs: "none", md: "block" } }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/cart")} sx={{ color: "gray", textTransform: "none" }}>
              Back to Cart
            </Button>
          </Box>

          <Paper
              elevation={0}
              sx={{
                p: { xs: 0, md: 5 },
                borderRadius: { xs: 0, md: "24px" },
                background: "#fff",
                position: "relative",
                mb: { xs: 0, md: 4 }
              }}
          >
            <Box sx={{ textAlign: "center", py: 3, borderBottom: "1px solid #f0f0f0" }}>
              <Typography variant="h6" fontWeight="900" sx={{ color: "#3C2F2F" }}>
                Secure Checkout — {totalPrice.toFixed(2)} ₺
              </Typography>
            </Box>

            {/* Stripe Embedded Checkout Area */}
            <Box sx={{
              width: "100%",
              // Mobile Responsiveness:
              // Ensure minimum height to prevent form squashing when keyboard opens on mobile.
              minHeight: { xs: "800px", md: "650px" },
              backgroundColor: "#fff",
              "& iframe": {
                display: "block !important",
                width: "100% !important",
                // Fixes input focus issues within iframe
                pointerEvents: "auto !important"
              }
            }}>
              {/* Stripe Provider: Renders payment form with Client Secret */}
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </Box>

          </Paper>

          {/* Security Badge */}
          <Box sx={{ textAlign: "center", py: 4, opacity: 0.6 }}>
            <Typography variant="caption" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
              <HttpsIcon sx={{ fontSize: 14 }} /> Secure SSL Encryption
            </Typography>
          </Box>

        </Container>
      </Box>
  );
}

export default Checkout;
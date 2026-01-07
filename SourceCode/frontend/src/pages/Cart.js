import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../service/productService";
import {
    Box, Typography, Card, CardMedia, Button, Container,
    IconButton, Divider, Stack, LinearProgress, Grid
} from "@mui/material";

// Icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Cart() {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);

    // Business Logic: Free Shipping Calculation
    const FREE_SHIPPING_LIMIT = 500; // Free shipping for orders over 500 TL
    const shippingCost = totalPrice >= FREE_SHIPPING_LIMIT ? 0 : 29.90;
    const grandTotal = totalPrice + shippingCost;

    // Progress Bar Calculations
    const remainingForFree = Math.max(FREE_SHIPPING_LIMIT - totalPrice, 0);
    const progressValue = Math.min((totalPrice / FREE_SHIPPING_LIMIT) * 100, 100);

    // Smart Recommendation Algorithm:
    // Analyzes categories of items in the cart and suggests
    // other products from the same categories that are not yet in the cart.
    useEffect(() => {
        getAllProducts().then((allProducts) => {
            if (cart.length > 0) {
                // Find unique categories in cart
                const categoriesInCart = [...new Set(cart.map(item => item.category))];

                // Filter: Products in same category but NOT already in cart
                const matchedProducts = allProducts.filter(
                    (p) => categoriesInCart.includes(p.category) && !cart.find((c) => c.id === p.id)
                );

                // Shuffle and pick 4 random items
                const randomRecs = matchedProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

                // Fallback: If not enough recommendations, show random items from all products
                setRecommendations(randomRecs.length < 2 ? allProducts.slice(0, 4) : randomRecs);
            }
        });
    }, [cart]);

    // Checkout Redirect Check
    const handleCheckout = () => {
        if (!user) { navigate("/login"); return; }
        navigate("/checkout");
    };

    // Empty Cart View
    if (cart.length === 0) return (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
            <ShoppingBagIcon sx={{ fontSize: 100, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Your cart is empty 😿</Typography>
            <Button variant="contained" component={Link} to="/products" sx={{ bgcolor: "#3C2F2F" }}>Start Shopping</Button>
        </Container>
    );

    return (
        <Container maxWidth={false} sx={{ mt: 3, mb: 8, px: { xs: 2, md: 4, lg: 6 } }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#3C2F2F" }}>My Cart ({cart.length} Items)</Typography>

            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 3,
                alignItems: "flex-start"
            }}>

                {/* SECTION 1: PRODUCT LIST */}
                <Box sx={{ width: { xs: "100%", lg: "55%" } }}>

                    {/* Free Shipping Progress Bar */}
                    <Card sx={{ p: 2, mb: 2, bgcolor: "#E3F2FD", border: "1px solid #90CAF9", borderRadius: "12px", boxShadow: "none" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <LocalShippingIcon color="primary" />
                            <Typography fontWeight="bold" variant="body2">
                                {remainingForFree > 0
                                    ? <>Add <span style={{color: "#1976D2"}}>{remainingForFree.toFixed(2)} TL</span> more for Free Shipping!</>
                                    : "Free Shipping Unlocked! 🎉"}
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 5 }} />
                    </Card>

                    <Stack spacing={2}>
                        {cart.map((item) => (
                            <Card key={item.id} sx={{ display: "flex", borderRadius: "12px", border: "1px solid #eee", boxShadow: "none" }}>
                                <CardMedia component="img" sx={{ width: { xs: 100, sm: 130 }, height: { xs: 100, sm: 130 }, objectFit: "contain", p: 1 }} image={item.imageUrl} alt={item.name} />
                                <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="h6" sx={{ fontSize: { xs: "14px", sm: "17px" }, fontWeight: "bold" }}>{item.name}</Typography>
                                        <IconButton onClick={() => removeFromCart(item.id)} color="error" size="small"><DeleteOutlineIcon /></IconButton>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "8px" }}>
                                            <IconButton size="small" onClick={() => decreaseQuantity(item.id)}><RemoveIcon fontSize="small" /></IconButton>
                                            <Typography sx={{ mx: 1, fontWeight: "bold" }}>{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => increaseQuantity(item.id)}><AddIcon fontSize="small" /></IconButton>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#F59E0B", fontSize: { xs: "16px", sm: "20px" } }}>{(item.price * item.quantity).toFixed(2)} ₺</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Stack>
                </Box>

                {/* SECTION 2: ORDER SUMMARY */}
                <Box sx={{ width: { xs: "100%", lg: "25%" }, position: { lg: "sticky" }, top: 110 }}>
                    <Card sx={{ p: 3, borderRadius: "16px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Order Summary</Typography>
                        <Stack spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="body2">Subtotal</Typography><Typography fontWeight="bold">{totalPrice.toFixed(2)} ₺</Typography></Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="body2">Shipping</Typography><Typography fontWeight="bold">{shippingCost === 0 ? "Free" : `${shippingCost.toFixed(2)} ₺`}</Typography></Box>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="subtitle1" fontWeight="bold">Total</Typography><Typography variant="h5" fontWeight="900" color="primary">{grandTotal.toFixed(2)} ₺</Typography></Box>
                        </Stack>
                        <Button variant="contained" fullWidth size="large" onClick={handleCheckout} sx={{ bgcolor: "#3C2F2F", mb: 2 }}>Go to Payment</Button>
                        <Button fullWidth component={Link} to="/products" sx={{ color: "gray", textTransform: "none", fontSize: "13px" }}>← Continue Shopping</Button>
                    </Card>
                </Box>

                {/* SECTION 3: RECOMMENDATIONS (SIDEBAR) */}
                <Box sx={{ width: { xs: "100%", lg: "16%" }, position: { lg: "sticky" }, top: 110 }}>
                    <Box sx={{ mb: 2, mt: { xs: 4, lg: 0 }, display: "flex", alignItems: "center", gap: 1, color: "#F59E0B" }}>
                        <AutoAwesomeIcon fontSize="small" />
                        <Typography variant="subtitle2" fontWeight="bold" color="#3C2F2F">Recommended</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ flexDirection: { xs: "row", lg: "column" } }}>
                        {recommendations.map((rec) => (
                            <Grid item xs={6} sm={4} lg={12} key={rec.id}>
                                <Card sx={{ p: 1.5, height: "100%", borderRadius: "12px", border: "1px solid #eee", boxShadow: "none", textAlign: "center" }}>
                                    <Box sx={{ height: 70, mb: 1, display: "flex", justifyContent: "center" }}>
                                        <img src={rec.imageUrl} alt={rec.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                                    </Box>
                                    <Typography variant="caption" sx={{ fontWeight: "bold", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "2.8em", fontSize: "0.75rem" }}>
                                        {rec.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#F59E0B", fontWeight: "900", my: 1 }}>{rec.price} ₺</Typography>
                                    <Button fullWidth size="small" variant="outlined" onClick={() => addToCart(rec)} sx={{ fontSize: "10px", borderRadius: "8px" }}>Add</Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Cart;
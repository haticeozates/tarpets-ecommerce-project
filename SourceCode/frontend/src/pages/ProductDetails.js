import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import {
    Box,
    Typography,
    Button,
    Container,
    Chip,
    Divider,
    Alert,
    Stack,
    Skeleton
} from "@mui/material";
import { CartContext } from "../context/CartContext";

// Icons
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        setLoading(true);
        setError(false);

        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                if (!cancelled) setProduct(res.data);
            } catch (err) {
                console.error("Product Detail Error:", err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProduct();
        return () => {
            cancelled = true;
        };
    }, [id]);

    // Loading View
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: "24px" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton width="60%" height={40} sx={{ mb: 2 }} />
                        <Skeleton width="40%" height={30} sx={{ mb: 4 }} />
                        <Skeleton width="100%" height={150} sx={{ borderRadius: "10px" }} />
                    </Box>
                </Box>
            </Container>
        );
    }

    // Error View
    if (error || !product) {
        return (
            <Container sx={{ mt: 15, textAlign: "center" }}>
                <Alert severity="error" sx={{ mb: 3, justifyContent: "center" }}>
                    Product not found or connection error!
                </Alert>
                <Button component={Link} to="/products" variant="outlined" startIcon={<ArrowBackIcon />}>
                    Go Back
                </Button>
            </Container>
        );
    }

    // Business Logic: Discount and Stock Calculation
    const discountRate = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    const isOutOfStock = product.stock === 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Button
                component={Link}
                to="/products"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 4, color: "#3C2F2F", textTransform: "none", fontWeight: "bold" }}
            >
                Back to Products
            </Button>

            {/* Main Layout using Flexbox for Responsiveness */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 6,
                alignItems: 'flex-start'
            }}>

                {/* Left Side - Product Image */}
                <Box sx={{ flex: 1, width: "100%" }}>
                    <Box
                        sx={{
                            height: { xs: "350px", md: "500px" },
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "24px",
                            backgroundColor: "#fff",
                            border: "1px solid #eee",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                            position: "relative",
                            overflow: "hidden",
                            p: 2
                        }}
                    >
                        {product.isDiscounted && (
                            <Chip
                                label={`${discountRate}% OFF`}
                                color="error"
                                sx={{ position: "absolute", top: 20, left: 20, fontWeight: "bold", zIndex: 2 }}
                            />
                        )}

                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                mixBlendMode: "multiply"
                            }}
                        />
                    </Box>
                </Box>

                {/* Right Side - Product Details */}
                <Box sx={{ flex: 1, width: "100%" }}>
                    <Box sx={{ position: { md: "sticky" }, top: "20px" }}>

                        <Typography variant="overline" sx={{ color: "gray", fontWeight: "bold", letterSpacing: 1.2 }}>
                            {product.category} {product.subcategory && `/ ${product.subcategory}`}
                        </Typography>

                        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2, color: "#3C2F2F", lineHeight: 1.1 }}>
                            {product.name}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            {product.oldPrice && (
                                <Typography sx={{ textDecoration: "line-through", color: "#aaa", fontSize: "1.3rem" }}>
                                    {product.oldPrice}₺
                                </Typography>
                            )}
                            <Typography sx={{ fontSize: "2.8rem", color: "#F59E0B", fontWeight: 900 }}>
                                {product.price}₺
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                            {product.price > 500 && (
                                <Chip icon={<LocalShippingIcon />} label="Free Shipping" color="success" variant="outlined" />
                            )}
                            <Chip icon={<VerifiedUserIcon />} label="Genuine Product" color="primary" variant="outlined" />
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="h6" fontWeight="bold" mb={1} sx={{ color: "#3C2F2F" }}>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7, mb: 4 }}>
                            {product.description || "No description available."}
                        </Typography>

                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            disabled={isOutOfStock}
                            startIcon={isOutOfStock ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
                            onClick={() => addToCart(product)}
                            sx={{
                                backgroundColor: "#3C2F2F",
                                color: "white",
                                py: 2,
                                fontSize: "1.1rem",
                                borderRadius: "12px",
                                textTransform: "none",
                                boxShadow: "0 10px 20px rgba(60, 47, 47, 0.2)",
                                "&:hover": { backgroundColor: "#5D4037" }
                            }}
                        >
                            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </Button>

                        {!isOutOfStock && product.price > 500 && (
                            <Alert severity="success" sx={{ mt: 3, borderRadius: "12px" }}>
                                Free shipping available 🚚
                            </Alert>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default ProductDetails;
import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Alert,
    keyframes,
    CircularProgress,
    Fade
} from "@mui/material";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

// Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Scrolling photo animation (CSS Keyframes)
const scrollAnimation = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
`;

function Home() {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { addToCart } = useContext(CartContext);

    // Personal Photo Gallery Data
    const myCatPhotos = [
        "/tarcin1.png", "/tarcin2.jpeg", "/tarcin3.jpeg", "/tarcin4.jpeg",
        "/tarcin5.jpeg", "/tarcin6.jpeg", "/tarcin7.jpeg", "/tarcin8.jpeg",
        "/tarcin9.jpeg", "/tarcin10.jpeg", "/tarcin11.jpeg", "/tarcin12.jpeg",
        "/tarcin13.jpeg", "/tarcin14.jpeg",
    ];

    // Duplicate array for seamless infinite scroll
    const carouselPhotos = [...myCatPhotos, ...myCatPhotos];

    // 1. Fetch Discounted Products
    useEffect(() => {
        api.get("/api/products/discounted")
            .then((response) => {
                setDiscountedProducts(response.data);
            })
            .catch((err) => {
                console.error("Home API Error:", err);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Categories Configuration
    const categories = [
        { label: "Cat", to: "/products?category=cat", img: "https://cdn-icons-png.flaticon.com/512/616/616430.png", color: "#FFF0F0" },
        { label: "Dog", to: "/products?category=dog", img: "https://cdn-icons-png.flaticon.com/512/616/616408.png", color: "#FFF8E1" },
        { label: "Bird", to: "/products?category=bird", img: "https://cdn-icons-png.flaticon.com/512/3069/3069186.png", color: "#E0F7FA" },
        { label: "Fish", to: "/products?category=fish", img: "https://cdn-icons-png.flaticon.com/512/877/877270.png", color: "#f0f7fc" },
        { label: "Rodent", to: "/products?category=rodent", img: "https://cdn-icons-png.flaticon.com/512/5389/5389252.png", color: "#F3E5F5" },
        { label: "Reptile", to: "/products?category=reptile", img: "https://cdn-icons-png.flaticon.com/512/1650/1650608.png", color: "#E8F5E9" },
    ];

    return (
        <Box sx={{ pb: 8, backgroundColor: "#FAFAFA", minHeight: "100vh", overflowX: "hidden" }}>

            {/* HERO SECTION */}
            <Box
                sx={{
                    height: { xs: "300px", md: "450px" },
                    backgroundImage: "url('https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-rush-45170.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <Box sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />
                <Box sx={{ position: "relative", textAlign: "center", color: "white", px: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>TarPets 🐾</Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                        The freshest foods and funniest toys for your dear friends, delivered to your door!
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/products"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ backgroundColor: "#F59E0B", fontSize: "18px", fontWeight: "bold", px: 5, py: 1.5, borderRadius: "50px" }}
                    >
                        Start Shopping
                    </Button>
                </Box>
            </Box>

            {/* CONTENT AREA */}
            <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, mt: 6 }}>

                {/* Categories Section */}
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: 'center' }}>Browse by Category</Typography>

                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 8
                }}>
                    {categories.map((cat, index) => (
                        <Box
                            key={index}
                            component={Link}
                            to={cat.to}
                            sx={{
                                // Responsive sizing: Smaller on mobile, larger on desktop
                                width: { xs: '100px', md: '140px' },
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: 1.5,
                                backgroundColor: "white",
                                borderRadius: "16px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                textDecoration: "none",
                                transition: "transform 0.2s",
                                "&:hover": { transform: "translateY(-5px)" }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 60, height: 60,
                                    borderRadius: "50%",
                                    backgroundColor: cat.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 1.5,
                                }}
                            >
                                <img src={cat.img} alt={cat.label} width="35" />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333", fontSize: "0.95rem" }}>
                                {cat.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                        <CircularProgress color="warning" />
                    </Box>
                )}

                {error && !loading && (
                    <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ mt: 4 }}>
                        Could not connect to the server! (Check if backend is running)
                    </Alert>
                )}

                {/* Weekly Deals Section */}
                {!loading && !error && (
                    <Box sx={{ mt: 8 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: "#3C2F2F", display: 'flex', alignItems: 'center', gap: 1 }}>
                                🔥 Offers of the Week
                            </Typography>
                            <Button component={Link} to="/products" color="warning" sx={{ fontWeight: "bold" }}>
                                View All
                            </Button>
                        </Box>

                        {/* Product Grid Structure */}
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
                            {discountedProducts.slice(0, 4).map((product) => (
                                <Fade in={true} timeout={500} key={product.id}>
                                    <Box sx={{ height: '100%' }}>
                                        <ProductCard product={product} addToCart={addToCart} />
                                    </Box>
                                </Fade>
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>

            {/* Inspiration Gallery (Tarcin Slider) */}
            <Box sx={{ mt: 10, py: 5, backgroundColor: "#3C2F2F", color: "white" }}>
                <Container maxWidth="lg" sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold">Our Inspiration 😻</Typography>
                    <Typography sx={{ opacity: 0.8, mt: 1 }}>
                        The little friend who inspired us while building this project!
                    </Typography>
                </Container>

                <Box sx={{ overflow: "hidden", width: "100%", position: "relative" }}>
                    <Box sx={{
                        display: "flex",
                        width: "max-content",
                        animation: `${scrollAnimation} 20s linear infinite`
                    }}>
                        {carouselPhotos.map((imgUrl, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={imgUrl}
                                alt="Tarçın"
                                sx={{
                                    width: "250px",
                                    height: "250px",
                                    objectFit: "cover",
                                    borderRadius: "20px",
                                    mx: 2,
                                    border: "4px solid #F59E0B",
                                    flexShrink: 0
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
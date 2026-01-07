import { useEffect, useContext, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import {
    Container,
    Typography,
    Button,
    Paper,
    Box,
    CircularProgress,
    Stack,
    Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

// Service Layer
import { createOrder } from "../service/orderService";

const CART_KEY = "tarPetsCart";

function Success() {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Idempotency Check:
    // React.StrictMode runs useEffect twice in development.
    // This ref prevents the order from being saved to the database twice (Double Posting).
    const orderCreated = useRef(false);

    // Monitor window size (For full-screen confetti)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Security and Duplicate Record Check
        if (!user) return;
        if (orderCreated.current) return;

        // Data Recovery (State Recovery):
        // React State might be reset when returning from 3rd party sites like Stripe.
        // If Context is empty, we recover data from LocalStorage (Persistence Layer).
        let finalCart = Array.isArray(cart) ? cart : [];
        if (finalCart.length === 0) {
            const storedCart = localStorage.getItem(CART_KEY);
            if (storedCart) {
                try {
                    finalCart = JSON.parse(storedCart) || [];
                } catch (e) {
                    finalCart = [];
                }
            }
        }

        // Do not proceed if cart is still empty (Protection against incorrect redirection)
        if (finalCart.length === 0) {
            setLoading(false);
            return;
        }

        // Mark transaction flag (Lock mechanism)
        orderCreated.current = true;

        // Prepare Order Data for Backend (DTO Mapping)
        const calculatedTotalPrice = finalCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const orderData = {
            userId: user.id,
            totalPrice: calculatedTotalPrice,
            items: finalCart.map((item) => ({
                productId: item.id,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        // Service Call: Save Order to Database
        createOrder(orderData)
            .then((res) => {
                // Transaction Successful: Clear cart and cache
                clearCart();
                localStorage.removeItem(CART_KEY);
            })
            .catch((err) => {
                console.error("Order Service Error:", err);
                setError(
                    "Your payment was successful, but there was an error saving your order. Please contact support."
                );
            })
            .finally(() => {
                // Delay loading screen slightly for better UX
                setTimeout(() => setLoading(false), 800);
            });
    }, [user, cart, clearCart]);

    // Case 1: Processing (Loading)
    if (loading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 15 }}>
                <CircularProgress color="success" size={60} />
                <Typography sx={{ mt: 3, fontWeight: "bold", color: "#555" }}>
                    Processing your order, please wait...
                </Typography>
            </Box>
        );
    }

    // Case 2: Backend Error
    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2 }}>
                    Back to Homepage
                </Button>
            </Container>
        );
    }

    // Case 3: Successful Transaction (Success UI)
    return (
        <>
            {/* Celebration Effect (Confetti) */}
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={200}
                recycle={false}
            />

            <Container maxWidth="sm" sx={{ mt: 8, mb: 10, position: "relative", zIndex: 1 }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        borderRadius: "24px",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                        border: "1px solid #dcfce7",
                    }}
                >
                    <CheckCircleIcon
                        sx={{
                            fontSize: 100,
                            color: "#22c55e",
                            mb: 2,
                            filter: "drop-shadow(0px 4px 10px rgba(34, 197, 94, 0.3))",
                        }}
                    />

                    <Typography variant="h4" fontWeight="900" sx={{ color: "#15803d", mb: 1 }}>
                        Payment Successful! 🎉
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: "1.1rem" }}>
                        Your order has been successfully placed and is being prepared.
                        <br />
                        Our little friend will love the gifts! 🐾
                    </Typography>

                    {/* Action Buttons */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate("/")}
                            sx={{
                                bgcolor: "#3C2F2F",
                                borderRadius: "50px",
                                px: 4,
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: "bold",
                            }}
                        >
                            Home
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<LocalMallIcon />}
                            onClick={() => navigate("/orders")}
                            sx={{
                                color: "#3C2F2F",
                                borderColor: "#3C2F2F",
                                borderRadius: "50px",
                                px: 4,
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: "bold",
                                borderWidth: "2px",
                                "&:hover": {
                                    borderWidth: "2px",
                                    bgcolor: "rgba(60, 47, 47, 0.05)",
                                },
                            }}
                        >
                            My Orders
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </>
    );
}

export default Success;
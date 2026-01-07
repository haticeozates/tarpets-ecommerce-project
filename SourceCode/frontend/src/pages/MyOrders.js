import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    Grid,
    CircularProgress,
    Button,
    Alert
} from "@mui/material";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EventIcon from "@mui/icons-material/Event";

import { getOrders } from "../service/orderService";

function MyOrders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        getOrders(user)
            .then((data) => {
                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sorted);
            })
            .catch(() => setError("There was a problem loading your orders."))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <Container sx={{ mt: 15, textAlign: "center" }}>
                <Typography variant="h6">Please log in to view your orders.</Typography>
                <Button variant="contained" onClick={() => navigate("/login")}>
                    Login
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 10 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container sx={{ textAlign: "center", mt: 10 }}>
                <ShoppingBagIcon sx={{ fontSize: 100, color: "#e0e0e0" }} />
                <Typography variant="h5" fontWeight="bold" color="gray">
                    No orders yet.
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/")}>
                    Start Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
            <Typography variant="h4" fontWeight="bold" mb={4} sx={{ color: "#3C2F2F" }}>
                🛍 My Order History
            </Typography>

            {orders.map((order) => (
                <Paper key={order.id} sx={{ p: 3, mb: 4, borderLeft: "6px solid #F59E0B" }}>
                    <Typography fontWeight="bold">Order #{order.id}</Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        <EventIcon fontSize="small" />{" "}
                        {new Date(order.createdAt).toLocaleString("en-GB")}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        {order.items?.map((item, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Typography fontWeight="bold">
                                    {item.product?.name || "Product"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.quantity} × {item.price} ₺
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography fontWeight="bold" color="#F59E0B">
                            Total: {order.totalPrice} ₺
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Container>
    );
}

export default MyOrders;
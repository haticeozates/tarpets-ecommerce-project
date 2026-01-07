import React, { useContext, useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    Alert,
    Chip
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
// Service Layer: Isolating data fetching logic from the component
import { getOrders } from "../service/orderService";

function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Security Check: Cancel fetching if no user session exists
        if (!user) {
            setLoading(false);
            return;
        }

        // Service Call:
        // Distinction between Admin and Normal User is handled inside 'orderService'.
        // This keeps the UI code clean (Separation of Concerns).
        getOrders(user)
            .then((data) => {
                // Data Manipulation:
                // Sort incoming order data by date from newest to oldest (Descending).
                // Handles potential differences in date field naming from backend (createdAt vs orderDate).
                const sortedData = data.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.orderDate);
                    const dateB = new Date(b.createdAt || b.orderDate);
                    return dateB - dateA;
                });

                setOrders(sortedData);
                setError(null);
            })
            .catch((err) => {
                console.error("Orders fetch error:", err);
                setError("Order history could not be loaded. Unable to connect to the server.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [user]);

    // --- RENDER LOGIC ---

    // State 1: User Not Logged In
    if (!user) {
        return (
            <Container sx={{ mt: 15, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                    Please log in to view your orders.
                </Typography>
            </Container>
        );
    }

    // State 2: Loading
    if (loading) {
        return (
            <Container sx={{ mt: 15, display: "flex", justifyContent: "center" }}>
                <CircularProgress color="warning" />
            </Container>
        );
    }

    // State 3: Main List View
    return (
        <Container sx={{ mt: 15, mb: 10 }}>
            {/* Dynamic Header: Changes based on user role */}
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: "#3C2F2F" }}>
                📦 {user.role === "ADMIN" ? "All Orders (Admin Panel)" : "My Order History"}
            </Typography>

            {/* Error Notification */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper elevation={3} sx={{ borderRadius: "16px", overflow: "hidden", mt: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f9fafb" }}>
                        <TableRow>
                            <TableCell><b>Order No</b></TableCell>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell><b>Total Amount</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* Empty State Management */}
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        No orders found yet. 🐾
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((o) => (
                                <TableRow key={o.id} hover>
                                    <TableCell>#{o.id}</TableCell>
                                    <TableCell>
                                        {/* Date Formatting (Locale String) */}
                                        {(o.createdAt || o.orderDate)
                                            ? new Date(o.createdAt || o.orderDate).toLocaleString("en-GB")
                                            : "-"}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                                        {o.totalPrice ? o.totalPrice.toFixed(2) : 0} ₺
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={o.status || "Order Received"}
                                            color="success"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default Orders;
import React from "react";
import { Card, CardContent, Typography, Button, Box, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

function ProductCard({ product, addToCart }) {
    // Logic to check discount status (Is there an old price or active discount flag?)
    const hasDiscount = (product.oldPrice > product.price) || product.discount || product.isDiscounted;

    return (
        <Card
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                position: "relative",
                transition: "0.3s",
                // Hover effect: Lifts card up and deepens shadow
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                },
            }}
        >
            {/* Discount Label: Shown only if there is a discount */}
            {hasDiscount && (
                <Chip
                    label="SALE"
                    color="error"
                    size="small"
                    sx={{ position: "absolute", top: 12, left: 12, fontWeight: "bold", zIndex: 2 }}
                />
            )}

            {/* Clickable Area: Wraps image and text, links to detail page */}
            <Box
                component={Link}
                to={`/products/${product.id}`}
                sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1
                }}
            >
                {/* Product Image Area */}
                <Box
                    sx={{
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #f0f0f0"
                    }}
                >
                    {/* Use placeholder if image is missing */}
                    <img
                        src={product.imageUrl || "https://via.placeholder.com/300"}
                        alt={product.name}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                </Box>

                <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>

                    {/* Product Title: Truncates with ellipsis if longer than 2 lines */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1rem",
                            mb: 1,
                            color: "#333",
                            lineHeight: 1.4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: "45px",
                        }}
                    >
                        {product.name}
                    </Typography>

                    {/* Price Area: Aligned to the bottom */}
                    <Box sx={{ mt: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography variant="h6" sx={{ color: "#F59E0B", fontWeight: "800" }}>
                            {product.price}₺
                        </Typography>

                        {product.oldPrice && (
                            <Typography sx={{ textDecoration: "line-through", color: "#999", fontSize: "0.9rem" }}>
                                {product.oldPrice}₺
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Box>

            {/* Add to Cart Button */}
            <Box sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => addToCart(product)}
                    sx={{
                        backgroundColor: "#3C2F2F",
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        boxShadow: "none",
                        "&:hover": { backgroundColor: "#59423f" }
                    }}
                >
                    Add to Cart
                </Button>
            </Box>
        </Card>
    );
}

export default ProductCard;
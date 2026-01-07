import { createContext, useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // State Initialization:
  // Check localStorage on app start.
  // Restore cart data if it exists (Persistence).
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("tarPetsCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State Management for User Notifications (Snackbar)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Data Persistence:
  // Whenever cart state changes (add/remove/update),
  // save the current data to browser localStorage in JSON format.
  useEffect(() => {
    localStorage.setItem("tarPetsCart", JSON.stringify(cart));
  }, [cart]);

  // Notification Trigger Helper Function
  const showNotification = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // Add to Cart Function:
  // Increases quantity if product already exists, otherwise adds as a new object.
  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart((prev) =>
          prev.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
    // Show English notification to user
    showNotification(`${product.name} added to cart! 🐾`);
  };

  // Remove Product from Cart Function
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showNotification("Product removed from cart.");
  };

  // Clear Cart (Used upon successful order completion or manual clear)
  const clearCart = () => {
    setCart([]);
  };

  // Increase Quantity (+)
  const increaseQuantity = (id) => {
    setCart((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
    );
  };

  // Decrease Quantity (-)
  // Does not perform action if quantity drops below 1 (negative value check).
  const decreaseQuantity = (id) => {
    setCart((prev) =>
        prev.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                : item
        )
    );
  };

  // Total Price Calculation (Derived State):
  // Uses 'reduce' method to calculate sum of all items (price * quantity).
  const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  );

  return (
      <CartContext.Provider
          value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalPrice,
            increaseQuantity,
            decreaseQuantity,
          }}
      >
        {children}

        {/* Global Notification Component (Snackbar): */}
        {/* Accessible app-wide since it is defined within Context Provider. */}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CartContext.Provider>
  );
}
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";

// Page Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Success from "./pages/Success";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import MyPet from "./pages/MyPet";

// Global State Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// UI Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Global State Providers */}
        <AuthProvider>
          <CartProvider>

            {/* Client-Side Routing */}
            <Router>

              {/* Main Layout (Sticky Footer Structure) */}
              <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    backgroundColor: "#fafafa"
                  }}>

                <Navbar />

                {/* Dynamic Content Area */}
                <Box sx={{ flexGrow: 1 }}>
                  <Routes>
                    {/* --- Public Pages --- */}
                    <Route path="/" element={<Home />} />

                    {/* --- Authentication --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* --- Shopping & Products --- */}
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />

                    {/* --- Checkout Process --- */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/checkout/success" element={<Success />} />

                    {/* --- User & Admin --- */}
                    <Route path="/orders" element={<MyOrders />} />
                    <Route path="/mypet" element={<MyPet />} />
                    <Route path="/admin" element={<AdminPanel />} />

                    {/* --- 404 / Error Handling --- */}
                    <Route path="*" element={<Home />} />
                  </Routes>
                </Box>

                <Footer />
              </Box>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;
import React, { useState, useContext } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../service/authService";

function Login() {
    // Local states for form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI states (Loading, Error, Success)
    const [loading, setLoading] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    // Global Context and Router Hooks
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorOpen(false);

        try {
            // Service Layer Integration:
            // UI code does not make direct API requests; it communicates via 'authService'.
            // This follows the "Separation of Concerns" principle.
            const userData = await loginUser({ email, password });

            // Global State Update:
            // Incoming user data is written to Context, making it accessible app-wide.
            login(userData);
            setSuccessOpen(true);

            // Role-Based Redirection:
            // Redirect ADMINs to the dashboard, others to the home page.
            const targetPath = userData.role === "ADMIN" ? "/admin" : "/";

            // Short delay to allow user to see the success message before redirect.
            setTimeout(() => navigate(targetPath), 1000);

        } catch (error) {
            console.error("Login Error:", error);
            setErrorOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "80vh",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        maxWidth: 400,
                        width: "100%",
                        borderRadius: 4,
                        textAlign: "center",
                    }}
                >
                    {/* Logo and Header Area */}
                    <Typography variant="h4" fontWeight="900" sx={{ color: "#3C2F2F", mb: 1, fontFamily: "'Fredoka', sans-serif" }}>
                        TarPets 🐾
                    </Typography>

                    <Typography variant="h5" fontWeight="bold" sx={{ color: "#F59E0B", mb: 2 }}>
                        Welcome Back!
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || !email || !password}
                            sx={{
                                mt: 3,
                                height: 50,
                                backgroundColor: "#F59E0B",
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "25px",
                                textTransform: "none",
                                ":hover": { backgroundColor: "#D97706" },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>

                        <Typography variant="body2" sx={{ mt: 3 }}>
                            Don't have an account?{" "}
                            <Link to="/register" style={{ color: "#F59E0B", fontWeight: "bold", textDecoration: "none" }}>
                                Register Now
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Error Notification (Snackbar) */}
            <Snackbar open={errorOpen} autoHideDuration={3000} onClose={() => setErrorOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
                    Invalid email or password.
                </Alert>
            </Snackbar>

            {/* Success Notification (Snackbar) */}
            <Snackbar open={successOpen} autoHideDuration={2000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
                    Login successful! Redirecting...
                </Alert>
            </Snackbar>
        </>
    );
}

export default Login;
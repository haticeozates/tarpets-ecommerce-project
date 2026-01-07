import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Snackbar,
  TableContainer
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Icons
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminPanel() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Data States
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // Product List

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // Tab control
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" }); // Notifications

  // Security Check & Data Fetching
  useEffect(() => {
    if (!user) return;
    if (user.role === "ADMIN") {
      fetchData();
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data concurrently
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/orders"),
        api.get("/api/products")
      ]);

      setUsers(usersRes.data);

      const sortedOrders = ordersRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);

      setProducts(productsRes.data); // Set products to state

    } catch (err) {
      console.error("Admin panel fetch error:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Session expired.");
      } else {
        setError("An error occurred while fetching admin data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Product Management Handlers ---

  // Update state on input change (Real-time typing)
  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // On Save Button Click (Send updates to Backend)
  const handleUpdateProduct = async (product) => {
    try {
      await api.put(`/api/products/${product.id}`, product);
      setToast({ open: true, message: "Product updated! ✅", severity: "success" });
    } catch (err) {
      console.error("Update error:", err);
      setToast({ open: true, message: "Update failed! ❌", severity: "error" });
    }
  };

  // Delete Product Logic
  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      setToast({ open: true, message: "Product deleted! 🗑️", severity: "warning" });
    } catch (err) {
      setToast({ open: true, message: "Delete failed!", severity: "error" });
    }
  };

  // --- Render Functions ---

  // 1. Users Table
  const renderUsersTable = () => (
      <Paper sx={{ p: 3, borderRadius: 3, borderTop: "4px solid #1976d2" }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
          👥 Registered Users ({users.length})
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} color={u.role === "ADMIN" ? "error" : "primary"} size="small" />
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );

  // 2. Orders Table
  const renderOrdersTable = () => (
      <Paper sx={{ p: 3, borderRadius: 3, borderTop: "4px solid #F59E0B" }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, color: "#F59E0B", fontWeight: "bold" }}>
          📦 Order History ({orders.length})
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#fff8e1" }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Customer</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>Items</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">{order.user?.name || "Guest"}</Typography>
                      <Typography variant="caption">{order.user?.email}</Typography>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: "green", fontWeight: "bold" }}>{order.totalPrice} ₺</TableCell>
                    <TableCell>
                      {order.items?.map((item, i) => (
                          <div key={i} style={{fontSize: "0.85rem"}}>
                            • {item.product?.name || "Deleted"} (x{item.quantity})
                          </div>
                      ))}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );

  // 3. Products Table
  const renderProductsTable = () => (
      <Paper sx={{ p: 3, borderRadius: 3, borderTop: "4px solid #2e7d32" }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32", fontWeight: "bold" }}>
          🏷️ Product Management (Price & Stock)
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#e8f5e9" }}>
              <TableRow>
                <TableCell><b>Image</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Price (₺)</b></TableCell>
                <TableCell><b>Stock</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <img src={p.imageUrl} alt="" width="50" height="50" style={{objectFit:"contain"}} />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">{p.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{p.category}</Typography>
                    </TableCell>

                    {/* Price Input */}
                    <TableCell>
                      <TextField
                          type="number" size="small" sx={{ width: "90px" }}
                          value={p.price}
                          onChange={(e) => handleProductChange(p.id, "price", e.target.value)}
                      />
                    </TableCell>

                    {/* Stock Input */}
                    <TableCell>
                      <TextField
                          type="number" size="small" sx={{ width: "80px" }}
                          value={p.stock}
                          error={p.stock < 5} // Visual indicator (red) for low stock
                          onChange={(e) => handleProductChange(p.id, "stock", e.target.value)}
                      />
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleUpdateProduct(p)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteProduct(p.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 15 }}>
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Container maxWidth="xl" sx={{ mt: 6, mb: 10 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
            <Typography variant="h4" fontWeight="bold" color="#3C2F2F">
              Admin Dashboard
            </Typography>
          </Box>
          <Button variant="outlined" color="error" onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered>
            <Tab icon={<GroupIcon />} label="Users" iconPosition="start" />
            <Tab icon={<ShoppingBagIcon />} label="Orders" iconPosition="start" />
            <Tab icon={<InventoryIcon />} label="Products & Stock" iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {tabValue === 0 && renderUsersTable()}
        {tabValue === 1 && renderOrdersTable()}
        {tabValue === 2 && renderProductsTable()}

        {/* Notifications */}
        <Snackbar
            open={toast.open}
            autoHideDuration={3000}
            onClose={() => setToast({...toast, open: false})}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
        </Snackbar>

      </Container>
  );
}

export default AdminPanel;
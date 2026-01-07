import React, { useState, useContext } from "react";
import {
  Box, Button, TextField, Typography, Paper, MenuItem,
  Snackbar, Alert, CircularProgress, InputAdornment, Stack
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

// Icons
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';

// Service Layer: Function to transmit registration to backend
import { registerUser, loginUser } from "../service/authService";
import { AuthContext } from '../context/AuthContext';

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form State Management: Holds user input data
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    petCount: ""
  });

  // Dynamic Form State: Pet details (type and name)
  const [petDetails, setPetDetails] = useState([]);

  // UI States (Loading, Error, Success)
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // General Input Change Handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Phone Number Formatting: Allows only numbers
  const handlePhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    if (onlyNums.length <= 11) {
      setForm({ ...form, phone: onlyNums });
    }
  };

  // Dynamic Field Generation Logic:
  // Creates input fields dynamically based on the entered pet count.
  const handleCountChange = (e) => {
    const val = e.target.value;
    if (val < 0 || val > 10) return; // Limit maximum pets to 10

    const count = parseInt(val) || 0;
    setForm({ ...form, petCount: val });

    // Create new array while preserving existing data (State Preservation)
    const newDetails = Array.from({ length: count }, (_, i) => {
      return petDetails[i] || { type: "", name: "" };
    });
    setPetDetails(newDetails);
  };

  // Update Dynamic Input Values
  const handlePetDetailChange = (index, field, value) => {
    const updatedPets = [...petDetails];
    updatedPets[index][field] = value;
    setPetDetails(updatedPets);
  };

  // Validation Rules
  const isPhoneError = form.phone.length > 0 && (form.phone.length < 11 || !form.phone.startsWith("05"));
  const isFormValid = form.name && form.email && form.password && !isPhoneError && form.phone.length === 11;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPhoneError) return;

    setLoading(true);
    setErrorOpen(false);

    // Data Transformation:
    const collectedTypes = petDetails
        .map(p => p.type)
        .filter(t => t)
        .join(", ");

    const dataToSend = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      petCount: Number(form.petCount) || 0,
      petType: collectedTypes || "Not Specified"
    };

    try {
      // Service Call
      const registerResponse = await registerUser(dataToSend);

      // If backend returns auth response (with token), use it to login immediately
      if (registerResponse && registerResponse.token) {
        login(registerResponse);
      } else {
        // Fallback: if only a success message is returned, trigger a manual login request
        const userData = await loginUser({ email: form.email, password: form.password });
        login(userData);
      }

      setSuccessOpen(true);

      // Redirect to home page after successful registration
      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      console.error("Registration Error:", error);
      // Capture backend error message and display to user
      const message = error.response?.data?.message || "An error occurred during registration.";
      setErrorMessage(message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Selectable Pet Types
  const petTypes = [
    { value: 'cat', label: 'Cat' },
    { value: 'dog', label: 'Dog' },
    { value: 'bird', label: 'Bird' },
    { value: 'fish', label: 'Fish' },
    { value: 'rodent', label: 'Rodent' },
    { value: 'reptile', label: 'Reptile' },
  ];

  return (
      <>
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8E1", py: 5 }}>
          <Paper sx={{ p: 4, width: 450, borderRadius: 4 }} elevation={10}>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <PetsIcon sx={{ fontSize: 50, color: "#F59E0B" }} />
            </Box>

            <Typography variant="h5" textAlign="center" fontWeight="bold" mb={1} color="#3C2F2F">
              Welcome to the Family 🐾
            </Typography>
            <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
              Only the best for you and your little friends!
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {/* Full Name Field */}
                <TextField
                    label="Full Name"
                    name="name"
                    required
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
                />

                {/* Email Field */}
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
                />

                {/* Password Field */}
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required
                    fullWidth
                    value={form.password}
                    onChange={handleChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment> }}
                />

                {/* Phone Field */}
                <TextField
                    label="Phone Number"
                    name="phone"
                    required
                    fullWidth
                    value={form.phone}
                    onChange={handlePhoneChange}
                    error={isPhoneError}
                    helperText={isPhoneError ? "Enter 11 digits starting with '05'." : ""}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>,
                      inputProps: { maxLength: 11 }
                    }}
                    placeholder="05xxxxxxxxx"
                />

                {/* Pet Count Field */}
                <TextField
                    label="How many pets do you have?"
                    name="petCount"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                    value={form.petCount}
                    onChange={handleCountChange}
                    placeholder="e.g. 1"
                />

                {/* DYNAMIC FIELDS: Loops based on pet count */}
                {petDetails.map((pet, index) => (
                    <Box key={index} sx={{ p: 2, border: "1px dashed #F59E0B", borderRadius: 2, bgcolor: "#FFF3E0" }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: "#D97706", fontWeight: "bold" }}>
                        {index + 1}. Pet Information
                      </Typography>

                      <Stack direction="row" spacing={2}>
                        <TextField
                            select
                            label="Type"
                            fullWidth
                            size="small"
                            value={pet.type}
                            onChange={(e) => handlePetDetailChange(index, "type", e.target.value)}
                            sx={{ bgcolor: "white" }}
                        >
                          {petTypes.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                            label="Name"
                            fullWidth
                            size="small"
                            value={pet.name}
                            onChange={(e) => handlePetDetailChange(index, "name", e.target.value)}
                            sx={{ bgcolor: "white" }}
                        />
                      </Stack>
                    </Box>
                ))}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || !isFormValid}
                    sx={{
                      mt: 2,
                      height: 50,
                      bgcolor: "#F59E0B",
                      fontWeight: "bold",
                      fontSize: "16px",
                      borderRadius: "25px",
                      textTransform: "none",
                      ":hover": { bgcolor: "#D97706" }
                    }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2">
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#F59E0B", fontWeight: "bold", textDecoration: "none" }}>
                      Login here
                    </Link>
                  </Typography>
                </Box>

              </Stack>
            </Box>
          </Paper>
        </Box>

        {/* Error Notification */}
        <Snackbar open={errorOpen} autoHideDuration={4000} onClose={() => setErrorOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>{errorMessage}</Alert>
        </Snackbar>

        {/* Success Notification */}
        <Snackbar open={successOpen} autoHideDuration={2000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>Registration successful! Redirecting...</Alert>
        </Snackbar>
      </>
  );
}

export default Register;
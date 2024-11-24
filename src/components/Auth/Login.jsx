import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import bcrypt from "bcryptjs";
import Spinner from "../Spinner";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_KEY =
    "$2a$10$zrfrbsLMkD.A0EC9Ai.3KOhLPqcS1GcTbavVzljNlKWAGsTUS51fe";

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937",
        {
          headers: {
            "X-Master-Key": API_KEY,
          },
        }
      );

      const users = response.data.record.users;

      const user = users.find((user) => user.email === email);

      if (!user) {
        toast.error("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Verify hashed password
      const passwordMatches = bcrypt.compareSync(password, user.password);
      if (!passwordMatches) {
        toast.error("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Check if the user is active
      if (!user.isActive) {
        toast.error("Your account is not active.");
        setLoading(false);
        return;
      }

      // If all checks pass, log in the user
      login(user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="m-auto w-full max-w-[90%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[30%] border p-4 rounded-xl shadow-xl bg-slate-200 mt-5 pb-10">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
          p: 2, // Padding for better spacing
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            textAlign: "center",
          }}
        >
          RBAC Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ maxWidth: "500px" }} // Limit width for larger screens
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ maxWidth: "500px" }} // Limit width for larger screens
        />
        {error && (
          <Typography
            color="error"
            sx={{ fontSize: "0.875rem", textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{
            mt: 2,
            width: "100%", // Full width button for smaller screens
            maxWidth: "200px", // Limit width for larger screens
          }}
        >
          Login
        </Button>
        <div className="mt-5 text-center">
          <Link className="text-blue-700" to="/register">
            Don't have an account? Sign Up
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default Login;

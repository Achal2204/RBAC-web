import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import bcrypt from "bcryptjs";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   const result = await login(email, password);
  //   if (result.success) {
  //     navigate(result.role === "admin" ? "/dashboard" : "/dashboard");
  //     toast.success("Login Successfully");
  //   } else {
  //     setError(result.message);
  //     toast.error("Something went wrong");
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch the user by email
      const response = await axios.get(
        `http://localhost:5000/users?email=${email}`
      );
      const user = response.data[0]; // Assuming email is unique and returns one user

      if (!user) {
        toast.error("Invalid email or password.");
        return;
      }

      // Verify hashed password
      const passwordMatches = bcrypt.compareSync(password, user.password);
      if (!passwordMatches) {
        toast.error("Invalid email or password.");
        return;
      }

      // Check if the user is active
      if (!user.isActive) {
        toast.error("You are no longer active.");
        return;
      }

      // If all checks pass, log in the user
      login(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="m-auto w-full max-w-[30%] border p-4 rounded-xl shadow-xl bg-slate-200 mt-5 pb-10">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
        }}
      >
        <Typography variant="h4" gutterBottom>
          RBAC Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <div className="mt-5">
          <Link className="text-blue-700" to="/register">
            Don't have an account ? Sign Up
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

const AddSpots = () => {
  const [loading, setLoading] = useState(false);

  const API_URL = "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937";
  const API_KEY =
    "$2a$10$zrfrbsLMkD.A0EC9Ai.3KOhLPqcS1GcTbavVzljNlKWAGsTUS51fe";

  const formik = useFormik({
    initialValues: {
      imageUrl: "",
      locationName: "",
      description: "",
    },
    validationSchema: Yup.object({
      imageUrl: Yup.string()
        .url("Please enter a valid URL")
        .required("Image URL is required"),
      locationName: Yup.string()
        .min(3, "Location name must be at least 3 characters")
        .required("Location name is required"),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: {
            "X-Master-Key": API_KEY,
          },
        });

        const existingData = response.data.record;
        const updatedSpots = [...(existingData.spots || []), values];

        const updatedData = { ...existingData, spots: updatedSpots };

        await axios.put(API_URL, updatedData, {
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        toast.success("Spot added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding spot:", error);
        toast.error("Failed to add the spot. Please try again.");
      }
      setLoading(false);
    },
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="m-auto w-full max-w-[90%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[30%] border p-4 rounded-xl shadow-xl bg-slate-200 mt-5 pb-10">
      <Box
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Add Spot</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Image URL"
            name="imageUrl"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
            helperText={formik.touched.imageUrl && formik.errors.imageUrl}
          />
          <TextField
            label="Location Name"
            name="locationName"
            value={formik.values.locationName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            required
            error={
              formik.touched.locationName && Boolean(formik.errors.locationName)
            }
            helperText={
              formik.touched.locationName && formik.errors.locationName
            }
          />
          <TextField
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            margin="normal"
            required
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <div className="mt-5 flex justify-center">
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formik.isValid}
            >
              {loading ? "Adding..." : "Add Spot"}
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default AddSpots;

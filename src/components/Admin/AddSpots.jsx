import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import toast from "react-hot-toast";

const AddSpots = () => {
  const [spot, setSpot] = useState({
    imageUrl: "",
    locationName: "",
    description: "",
  });

  const handleAddSpot = async () => {
    await axios.post("http://localhost:5000/spots", spot);
    toast.success("Spot added successfully!");
    setSpot({ imageUrl: "", locationName: "", description: "" });
  };

  return (
    <div className="m-auto w-full max-w-[30%] border p-4 rounded-xl shadow-xl bg-slate-200 mt-5 pb-10">
      <Box
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Add Spot</Typography>
        <TextField
          label="Image URL"
          value={spot.imageUrl}
          onChange={(e) => setSpot({ ...spot, imageUrl: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location Name"
          value={spot.locationName}
          onChange={(e) => setSpot({ ...spot, locationName: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={spot.description}
          onChange={(e) => setSpot({ ...spot, description: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <div className="mt-5">
          <Button variant="contained" onClick={handleAddSpot}>
            Add Spot
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default AddSpots;

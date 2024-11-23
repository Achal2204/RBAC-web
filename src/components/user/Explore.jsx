import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";

const Explore = () => {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    const response = await axios.get("http://localhost:5000/spots");
    setSpots(response.data);
  };

  return (
    <div className="px-28">
      <div className="mt-5 flex justify-center">
        {" "}
        <h3 className="text-3xl font-bold text-white">Explore New World</h3>
      </div>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {spots.map((spot) => (
          <Grid item xs={12} sm={6} md={4} key={spot.id}>
            <Card className="h-full">
              <CardMedia
                component="img"
                height="140"
                image={spot.imageUrl}
                alt={spot.locationName}
              />
              <CardContent>
                <Typography variant="h5">{spot.locationName}</Typography>
                <Typography>{spot.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Explore;
import { Paper, Typography } from "@mui/material";
import React from "react";
import heartSmall from "../../assets/projectImages/heartSmall.png";

function SimpleBanner() {
  const BannerPaper = {
    backgroundColor: "#5393ff",
    color: "#FFFFFF",
    padding: "16px", // Adjust padding as needed
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
  };
  const imageStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imgStyles = {
    maxWidth: "100%",
    maxHeight: "100%",
  };
  return (
    <Paper elevation={3} style={BannerPaper}>
      <Typography variant="h1" component="div">
        Welcome to Heart2Hub
      </Typography>
      <Typography variant="body1">
        The integrated system to manage all your hospital needs
      </Typography>
      <div style={imageStyles}>
        <img
          src={heartSmall}
          alt=""
          width={700}
          height={400}
          style={imgStyles}
        />
      </div>
    </Paper>
  );
}

export default SimpleBanner;

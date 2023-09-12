import { Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React from "react";

function Logo() {
  return (
    <>
      {/* <Typography
        component="h1"
        variant="h1"
        sx={{
          marginTop: "30%",
          zIndex: 10,
          marginLeft: "20%",
          fontFamily: "Lato",
        }}
        color="white"
        textAlign="left"
      >
        Heart2Hub
      </Typography> */}

      <MDTypography
        variant="h1"
        fontWeight="bold"
        textTransform="capitalize"
        color="white"
        mt={1}
        sx={{
          marginTop: "30%",
          zIndex: 10,
          marginLeft: "10%",
          fontFamily: "Lato",
        }}
      >
        Heart2Hub
      </MDTypography>
      <MDTypography
        variant="h3"
        fontWeight="medium"
        textAlign="left"
        textTransform="capitalize"
        sx={{
          marginLeft: "10%",
          fontFamily: "Lato",
          color: "lightBlue",
        }}
      >
        Clinical Excellence, Digital Elegance.
      </MDTypography>
      {/* <Typography
        component="h1"
        variant="h4"
        sx={{
          zIndex: 1,
          marginLeft: "10%",
          fontFamily: "Lato",
        }}
        color="lightBlue"
        textAlign="left"
      >
        Clinical Excellence, Digital Elegance.
      </Typography> */}
    </>
  );
}

export default Logo;

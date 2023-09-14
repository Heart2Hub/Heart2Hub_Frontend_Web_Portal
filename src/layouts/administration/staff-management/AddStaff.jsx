import React from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { Grid } from "@mui/material";

function AddStaff() {
  return (
    <>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white">
          Enter New Staff Details
        </MDTypography>
      </MDBox>
      <MDBox p={5}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <MDBox display="flex" flexDirection="column">
              <MDTypography
                variant="button"
                fontWeight="bold"
                textTransform="capitalize"
              >
                First Name
              </MDTypography>
              <MDInput size="small" />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" flexDirection="column">
              <MDTypography
                variant="button"
                fontWeight="bold"
                textTransform="capitalize"
              >
                First Name
              </MDTypography>
              <MDInput size="small" />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}

export default AddStaff;

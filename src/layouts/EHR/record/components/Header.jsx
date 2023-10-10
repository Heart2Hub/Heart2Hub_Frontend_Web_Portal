import { useState, useEffect } from "react";
import { IMAGE_SERVER } from "constants/RestEndPoint";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";

import { useSelector } from "react-redux";
import { selectEHRRecord } from "../../../../store/slices/ehrSlice";

function Header({ children }) {
  const ehrRecord = useSelector(selectEHRRecord);

  useEffect(() => {
  }, [ehrRecord]);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox position="relative" minHeight="5rem" />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={5} alignItems="center" width="100%">
          <Grid item justifyContent="center">
            <MDAvatar
            
              src={`${IMAGE_SERVER}/images/id/${ehrRecord?.patient?.profilePicture?.imageLink}`}
              alt="profile-image"
              size="xxl"
              shadow="xxl"
            />
          </Grid>
          <Grid item xs>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {ehrRecord?.firstname} {ehrRecord?.lastname}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item>
            <MDBox
              height="100%"
              mt={0.5}
              lineHeight={1}
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;

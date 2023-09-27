import { Box, Button, Container, Grid, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import error404 from '../../assets/projectImages/error404.gif';
import MDButton from "components/MDButton";

function ErrorPage() {
  const navigate = useNavigate();

  // const [buttonClicked, setButtonClicked] = useState(false);

  // useEffect(() => {
  //   return () => {
  //     if (!buttonClicked) {
  //       navigate("/error");
  //     }
  //   };
  // }, [navigate, buttonClicked]);

  const handleReroute = () => {
    // setButtonClicked(true);
    navigate("/home");
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography variant="h1">
                OOPS!
              </Typography>
              <Typography variant="h6">
                Looks like there is no where to go, click here to return to the home page
              </Typography>
              <div style={{ marginTop: '20px' }}>
                <MDButton variant="contained" onClick={(handleReroute)}>To Home</MDButton>
              </div>
            </Grid>
            <Grid xs={6}>
              <img
                src={error404}
                alt=""
                width={500} height={400}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default ErrorPage;
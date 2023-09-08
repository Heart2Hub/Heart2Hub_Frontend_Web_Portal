import { Box, CssBaseline, Toolbar } from "@mui/material";
import React from "react";
import Header from "../Header/Header";
import SideNavigation from "../SideNavigation/SideNavigation";

function MainLayout(props) {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* header */}
      <Header drawerWidth={drawerWidth} />
      {/* side nav */}
      <SideNavigation drawerWidth={drawerWidth} />
      {/* main page body */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {/* body */}
        <Toolbar />
        <main>{props.children}</main>
      </Box>
    </Box>
  );
}

export default MainLayout;

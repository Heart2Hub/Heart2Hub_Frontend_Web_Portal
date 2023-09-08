import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

function Header(props) {
  let drawerWidth = props.drawerWidth;
  return (
    <header>
      <AppBar
        position="absolute"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Heart2Hub Web Portal
          </Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Header;

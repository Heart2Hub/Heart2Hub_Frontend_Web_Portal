import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { Link } from "react-router-dom";

function SideNavigation(props) {
  let drawerWidth = props.drawerWidth;
  let navOptions = [
    { title: "Home", path: "/home" },
    { title: "Login", path: "/login" },
    { title: "Error", path: "/error" },
  ];

  return (
    <nav>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          bgcolor: "background.paper",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {navOptions.map((option, index) => (
            <Link key={index} to={option.path}>
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemText primary={option.title} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </nav>
  );
}

export default SideNavigation;

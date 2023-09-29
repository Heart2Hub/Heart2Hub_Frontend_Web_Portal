import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import CalenderView from "./CalenderView";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";

import { useDispatch, useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";
import MDTypography from "components/MDTypography";

function Outpatient() {
  const staff = useSelector(selectStaff);

  const [value, setValue] = React.useState("Calender View");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDTypography
        sx={{
          fontSize: "2.5rem", // Adjust the size as per your preference
          textAlign: "center",
          fontWeight: "bold", // Makes the font-weight bold
          marginTop: "1rem", // Adds some top margin
          marginBottom: "1rem", // Adds some bottom margin
        }}
      >
        {staff.unit.name}
      </MDTypography>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="tabs example"
              sx={{ width: "15%", height: "3rem" }}
              centered
            >
              <Tab
                icon={<CalendarMonthIcon fontSize="large" />}
                value="Calender View"
              />
              <Tab
                icon={<ViewWeekIcon fontSize="large" />}
                value="Kanban View"
              />
            </TabList>
          </Box>
          <TabPanel value="Calender View">
            <CalenderView />
          </TabPanel>
          <TabPanel value="Kanban View">{"HELLO"}</TabPanel>
        </TabContext>
      </Box>
    </DashboardLayout>
  );
}

export default Outpatient;

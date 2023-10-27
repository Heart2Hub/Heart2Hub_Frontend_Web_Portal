import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { Box, Tab, Icon } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";
import MDTypography from "components/MDTypography";
import LiveQueue from "./LiveQueue";
import MedicationManagement from "./medication-management";
import MDBox from "components/MDBox";

import Medication from "@mui/icons-material/Medication";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import { Grid } from "react-loader-spinner";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import ErrorPage from "layouts/error";
import PharmacyAdminKanbanBoard from "./PharmacyAdminKanbanBoard";

function Outpatient() {
  const staff = useSelector(selectStaff);
  const [tabValue, setTabValue] = useState("Counter");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
    {staff.unit.name !== "Pharmacy" ? 
    <ErrorPage /> :
    <DashboardLayout>
      <DashboardNavbar />
      {staff.staffRoleEnum === "PHARMACIST" ? 
      <>
      <MDTypography
        sx={{
          fontSize: "2.5rem", // Adjust the size as per your preference
          textAlign: "center",
          fontWeight: "bold", // Makes the font-weight bold
          marginTop: "1rem", // Adds some top margin
          marginBottom: "1rem", // Adds some bottom margin
        }}
      >
        Pharmacy
      </MDTypography>
      <TabContext value={tabValue}>
        <MDBox
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
            sx={{ width: "100%", height: "5rem" }}
            centered
          >
            <Tab
              icon={<TableRestaurantIcon fontSize="large" />}
              value="Counter"
              label="Counter"
              iconPosition="top"
            />
            <Tab
              icon={<Medication fontSize="large" />}
              value="Medication"
              label="Medication"
              iconPosition="top"
            />
          </TabList>
        </MDBox>

        <TabPanel value="Counter">
          <LiveQueue />
        </TabPanel>
        <TabPanel value="Medication">
          <MedicationManagement />
        </TabPanel>
      </TabContext>
      </> : <PharmacyAdminKanbanBoard />}
    </DashboardLayout>}
    </>
  );
}

export default Outpatient;

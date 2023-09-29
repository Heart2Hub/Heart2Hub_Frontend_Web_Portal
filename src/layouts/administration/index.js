import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import React from "react";

// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

function Administration() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://bit.ly/3Hlw1MQ"
                title="Staff Management"
                action={{
                  type: "internal",
                  route: "/administration/staff-management",
                  color: "info",
                  label: "Continue",
                }}
              />{" "}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://bit.ly/3Hlw1MQ"
                title="Facility Management"
                action={{
                  type: "internal",
                  route: "/administration/facility-management",
                  color: "info",
                  label: "Continue",
                }}
              />{" "}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://bit.ly/3Hlw1MQ"
                title="Inventory Management"
                action={{
                  type: "internal",
                  route: "/administration/inventory-management",
                  color: "info",
                  label: "Continue",
                }}
              />{" "}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Administration;

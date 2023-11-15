import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import React from "react";
import { selectStaff } from "store/slices/staffSlice";


// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { useSelector } from "react-redux";

function Administration() {
  const staff = useSelector(selectStaff);
  const staffRole = staff.staffRoleEnum;
  const ADMIN_ROLE = 'ADMIN';

  const isAdmin = staffRole === ADMIN_ROLE;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://i.ibb.co/thf32fT/pexels-cottonbro-studio-5722160.jpg"
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
                image="https://i.ibb.co/wyvGpY2/martha-dominguez-de-gouveia-KF-h9-HMx-RKg-unsplash.jpg"
                title="Facility Booking"
                action={{
                  type: "internal",
                  route: "/administration/facility-booking",
                  color: "info",
                  label: "Continue",
                }}
              />{" "}
            </MDBox>
          </Grid>
          {isAdmin && <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://media.istockphoto.com/id/1175657274/photo/hospital-indoor-storage-room-health-center-repository.jpg?s=612x612&w=0&k=20&c=st6kLOWp84yP38IRStwApk7bOLuEpSaMIH13AlHCjqY="
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
          }
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://i.ibb.co/kS1f2qQ/patrick-tomasso-Oaqk7qq-Nh-c-unsplash-1.jpg"
                title="Knowledge Manegement"
                action={{
                  type: "internal",
                  route: "/administration/knowledge-management",
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

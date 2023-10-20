import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import React from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";

// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

function Finance() {
  const staff = useSelector(selectStaff);
  const isHead = staff.isHead;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://i.ibb.co/wyPbS7q/ibrahim-rifath-OAp-Hds2y-EGQ-unsplash.jpg"
                title="Subsidy Managment"
                action={{
                  type: 'internal',
                  route: '/finance/subsidy',
                  color: 'info',
                  label: 'Continue',
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://i.ibb.co/8Xgf3nF/andre-taissin-5-OUMf1-Mr5p-U-unsplash.jpg"
                title="Invoice Managment"
                action={{
                  type: 'internal',
                  route: '/finance/invoice',
                  color: 'info',
                  label: 'Continue',
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <SimpleBlogCard
                image="https://i.ibb.co/7VrXd5M/carlos-muza-hpj-Sk-U2-UYSU-unsplash.jpg"
                title="Finance Analysis"
                action={{
                  type: 'internal',
                  route: '',
                  color: 'info',
                  label: 'Continue',
                }}
              />
            </MDBox>
          </Grid>

        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}



export default Finance;

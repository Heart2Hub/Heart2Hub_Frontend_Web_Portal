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

function Pharmacy() {
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
                                image="https://st.depositphotos.com/1151871/3045/i/450/depositphotos_30459135-stock-photo-medication.jpg"
                                title="Medication Management"
                                action={{
                                    type: "internal",
                                    route: "/pharmacy/medication-management",
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



export default Pharmacy;

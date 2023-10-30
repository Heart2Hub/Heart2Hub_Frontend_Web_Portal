import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import React from "react";

// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

function InventoryManagement() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <SimpleBlogCard
                                image="https://media.istockphoto.com/id/1216812369/photo/a-medical-hand-in-a-glove-holds-an-ampoule-with-a-vaccine-and-a-syringe-with-illustration.jpg?s=612x612&w=0&k=20&c=1j6lajNvibgVIy1g8G8_umJkfgVgodvEFi3KHhkxxi4="
                                title="Consumable Equipment Management"
                                action={{
                                    type: "internal",
                                    route: "/administration/inventory-management/consumable-equipment-management",
                                    color: "info",
                                    label: "Continue",
                                }}
                            />{" "}
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <SimpleBlogCard
                                image="https://media.istockphoto.com/id/482858629/photo/doctors-hospital-corridor-nurse-pushing-gurney-stretcher-bed.jpg?b=1&s=612x612&w=0&k=20&c=QA5AU7uv9cnJUXBdMstov5CcpErsIQEke05Hn98SEvs="
                                title="Service Management"
                                action={{
                                    type: "internal",
                                    route: "/administration/inventory-management/service-management",
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

export default InventoryManagement;

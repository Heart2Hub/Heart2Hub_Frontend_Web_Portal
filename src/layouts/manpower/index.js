import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import MDBox from "components/MDBox";


function Manpower() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
        <MDBox mt={3} mb={3}>
          
        </MDBox>
    </DashboardLayout>
  );
}

export default Manpower;

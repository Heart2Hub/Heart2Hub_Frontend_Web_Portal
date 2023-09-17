// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import staffTableData from "layouts/administration/staff-management/data/staffTableData";
import { staffApi } from "api/Api";
import AddStaff from "./AddStaff";
import StaffTable from "./StaffTable";

function StaffManagement() {
  const [tableView, setTableView] = useState(true);

  const addStaffHandler = () => {
    setTableView(!tableView);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {tableView ? (
                <StaffTable addStaffHandler={addStaffHandler} />
              ) : (
                <AddStaff addStaffHandler={addStaffHandler} />
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default StaffManagement;

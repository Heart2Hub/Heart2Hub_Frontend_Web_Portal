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

function StaffManagement() {
  //const { rows } = staffTableData();
  const [rows, setRows] = useState([]);
  const columns = [
    { Header: "id", accessor: "staffId", width: "8%" },
    { Header: "first name", accessor: "firstname", width: "15%" },
    { Header: "last name", accessor: "lastname", width: "15%" },
    { Header: "username", accessor: "username", width: "15%" },
    { Header: "role", accessor: "staffRoleEnum", width: "15%" },
    { Header: "department", accessor: "department" },
    { Header: "mobile", accessor: "mobileNumber", width: "12%" },
  ];

  const processStaffData = (listOfStaff) => {
    const newListOfStaff = listOfStaff.map((staff) => {
      const departmentName = staff.department.departmentName;
      staff.department = departmentName;
      return staff;
    });

    return newListOfStaff;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await staffApi.getAllStaff();
        setRows(processStaffData(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {console.log(rows)}
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Staff Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable canSearch={true} table={{ columns, rows }} />
              </MDBox> */}
              <AddStaff />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default StaffManagement;

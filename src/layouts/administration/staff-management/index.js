// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";

import AddStaff from "./AddStaff";
import StaffTable from "./StaffTable";

const INITIAL_FORM_STATE = {
  username: "",
  password: "password",
  firstname: "",
  lastname: "",
  mobileNumber: 0,
  staffRoleEnum: "",
  isHead: false,
  departmentName: "",
  subDepartmentName: "",
};

function StaffManagement() {
  const [tableView, setTableView] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  const processStaffObj = (staffObj) => {
    const formFields = Object.keys(formState);

    const newStaffObj = Object.keys(staffObj)
      .filter((key) => formFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = staffObj[key];
        return obj;
      }, {});

    return newStaffObj;
  };

  const addStaffHandler = () => {
    setEditing(false);
    setFormState(INITIAL_FORM_STATE);
    setTableView(false);
  };

  const editStaffHandler = (staff) => {
    setEditing(true);
    console.log(processStaffObj(staff));
    setFormState(processStaffObj(staff));
    setTableView(false);
  };

  const returnToTableHandler = () => {
    setEditing(false);
    setFormState(INITIAL_FORM_STATE);
    setTableView(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {tableView ? (
                <StaffTable
                  addStaffHandler={addStaffHandler}
                  editStaffHandler={editStaffHandler}
                />
              ) : (
                <AddStaff
                  returnToTableHandler={returnToTableHandler}
                  formState={formState}
                  editing={editing}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default StaffManagement;

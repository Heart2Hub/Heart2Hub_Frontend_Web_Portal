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
import { displayMessage } from "../../../store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";

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
  const reduxDispatch = useDispatch();
  const loggedInStaff = useSelector(selectStaff);

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
    if (staff.isHead && staff.staffRoleEnum === "ADMIN") {
      //staff is superadmin (CANNOT EDIT)
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Action not allowed!",
          content: "Cannot edit super admin",
        })
      );
    } else if (staff.staffId === loggedInStaff.staffId) {
      //staff is ownself
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Action not allowed!",
          content: "Cannot edit self",
        })
      );
    } else {
      setEditing(true);
      console.log(processStaffObj(staff));
      setFormState(processStaffObj(staff));
      setTableView(false);
    }
    console.log("the staff to be editted is: ");
    console.log(staff);
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

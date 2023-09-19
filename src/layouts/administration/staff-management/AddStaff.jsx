import React, { useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";

import { Formik, Form, useFormikContext } from "formik";
import * as yup from "yup";
import { staffApi, departmentApi } from "api/Api";
import { subDepartmentApi } from "api/Api";
import TextfieldWrapper from "components/Textfield";
import SelectWrapper from "components/Select";
import CheckboxWrapper from "components/Checkbox";

const validationSchema = yup.object({
  username: yup
    .string()
    .min(6, "Username should be of minimum 6 characters length")
    .required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  mobileNumber: yup
    .number()
    .min(80000000, "Invalid mobile number")
    .max(99999999, "Invalid mobile number")
    .required("Mobile number is required"),
  staffRoleEnum: yup.string().required("Staff role is required"),
  departmentName: yup.string().required("Department is required"),
  subDepartmentName: yup.string().required("Sub-Department is required"),
});

function AddStaff({ returnToTableHandler, formState, editing }) {
  const [staffRoles, setStaffRoles] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [subDepartmentsByDepartment, setSubDepartmentsByDepartment] = useState(
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const processDepartmentData = (departments) => {
    const departmentNames = departments.map((department) => department.name);
    return departmentNames;
  };

  useEffect(() => {
    const getStaffRoles = async () => {
      try {
        const response = await staffApi.getStaffRoles();
        setStaffRoles(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getStaffRoles();
  }, []);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await departmentApi.getAllDepartments("");
        setDepartmentNames(processDepartmentData(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const getSubDepartments = async () => {
      try {
        const response = await subDepartmentApi.getAllSubDepartments("");
        setSubDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSubDepartments();
  }, []);

  const FormObserver = () => {
    const { values } = useFormikContext();
    useEffect(() => {
      setSubDepartmentsByDepartment(
        subDepartments
          .filter(
            (subDepartment) =>
              subDepartment.department.name === values.departmentName
          )
          .map((subDepartment) => subDepartment.name)
      );
    }, [values.departmentName]);
  };

  const postStaff = async (values, actions) => {
    try {
      const response = await staffApi.createStaff(
        values,
        values.subDepartmentName
      );
      returnToTableHandler();
    } catch (error) {
      actions.setStatus(error.response.data);
    }
  };

  const putStaff = async (values, actions) => {
    try {
      const response = await staffApi.updateStaff(
        values,
        values.subDepartmentName
      );
      returnToTableHandler();
    } catch (error) {
      actions.setStatus(error.response.data);
    }
  };

  const handleSubmit = (values, actions) => {
    if (editing) {
      console.log("Updated staff");
      putStaff(values, actions);
    } else {
      console.log("Creating staff");
      postStaff(values, actions);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDisableStaff = (username) => {
    const disableStaff = async (username) => {
      try {
        const response = await staffApi.disableStaff(username);
        returnToTableHandler();
      } catch (error) {
        console.log(error);
      }
    };
    disableStaff(username);
  };

  return (
    <>
      <MDBox
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
          {editing ? "Update Staff Details" : "Enter New Staff Details"}
        </MDTypography>
      </MDBox>
      <MDBox p={5}>
        <Formik
          initialValues={{ ...formState }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ status, values }) => (
            <Form>
              <FormObserver />
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    First Name
                  </MDTypography>
                  <TextfieldWrapper
                    name="firstname"
                    hiddenlabel
                    size="small"
                    disabled={editing}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Last Name
                  </MDTypography>
                  <TextfieldWrapper
                    name="lastname"
                    hiddenlabel
                    size="small"
                    disabled={editing}
                  />
                </Grid>

                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Mobile Number
                  </MDTypography>
                  <TextfieldWrapper
                    name="mobileNumber"
                    hiddenlabel
                    size="small"
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Staff Role
                  </MDTypography>
                  <SelectWrapper
                    name="staffRoleEnum"
                    hiddenlabel
                    options={staffRoles}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Username
                  </MDTypography>
                  <TextfieldWrapper
                    name="username"
                    hiddenlabel
                    size="small"
                    status={status}
                    disabled={editing}
                  />
                </Grid>

                <Grid item xs={6}>
                  {editing ? null : (
                    <>
                      <MDTypography
                        variant="button"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        Password
                      </MDTypography>
                      <TextfieldWrapper
                        name="password"
                        disabled
                        hiddenlabel
                        size="small"
                      />
                    </>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Department
                  </MDTypography>
                  <SelectWrapper
                    name="departmentName"
                    hiddenlabel
                    options={departmentNames}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Sub-Department
                  </MDTypography>
                  <SelectWrapper
                    name="subDepartmentName"
                    hiddenlabel
                    options={subDepartmentsByDepartment}
                    disabled={subDepartmentsByDepartment.length === 0}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDBox>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Rosterer
                    </MDTypography>
                    <CheckboxWrapper name="isHead" />
                  </MDBox>
                </Grid>
                <Grid item xs={4}>
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={returnToTableHandler}
                    fullWidth
                  >
                    Cancel
                  </MDButton>
                </Grid>
                <Grid item xs={4}>
                  <MDButton
                    variant="contained"
                    color="info"
                    type="submit"
                    fullWidth
                  >
                    Save
                  </MDButton>
                </Grid>
                <Grid item xs={4}>
                  {editing ? (
                    <>
                      <MDButton
                        variant="contained"
                        color="warning"
                        fullWidth
                        onClick={handleOpenDialog}
                      >
                        Disable
                      </MDButton>
                      <Dialog
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Are you sure you want to disable this staff?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            This action is irreversible. The disabled staff will
                            no longer be able to login, and you will not be able
                            to view the disabled staff
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDialog}>Disagree</Button>
                          <Button
                            onClick={() => handleDisableStaff(values.username)}
                          >
                            Agree
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </MDBox>
    </>
  );
}

export default AddStaff;

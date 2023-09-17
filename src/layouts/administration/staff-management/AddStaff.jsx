import React, { useEffect, useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import { Grid, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import { Formik, Form, useFormikContext } from "formik";
import * as yup from "yup";
import { staffApi, departmentApi } from "api/Api";
import { subDepartmentApi } from "api/Api";
import TextfieldWrapper from "components/Textfield";
import SelectWrapper from "components/Select";

const INITIAL_FORM_STATE = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  mobileNumber: 0,
  staffRoleEnum: "",
  departmentName: "",
  subDepartmentName: "",
};

const validationSchema = yup.object({
  username: yup.string("Enter your username").required("Username is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  firstname: yup
    .string("Enter your first name")
    .required("First name is required"),
  lastname: yup
    .string("Enter your last name")
    .required("Last name is required"),
  mobileNumber: yup
    .number("Enter your mobile number")
    .required("Mobile number is required"),
  staffRoleEnum: yup
    .string("Enter your staff role")
    .required("Staff role is required"),
  departmentName: yup
    .string("Enter your staff role")
    .required("Department is required"),
  subDepartmentName: yup
    .string("Enter your staff role")
    .required("Sub-Department is required"),
});

function AddStaff({ addStaffHandler }) {
  const [staffRoles, setStaffRoles] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [subDepartmentNames, setSubDepartmentNames] = useState([]);

  const processDepartmentData = (departments) => {
    const departmentNames = departments.map(
      (department) => department.departmentName
    );
    return departmentNames;
  };

  const processSubDepartmentData = (subDepartments) => {
    const subDepartmentNames = subDepartments.map(
      (subDepartment) => subDepartment.subDepartmentName
    );
    return subDepartmentNames;
  };

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await departmentApi.getAllDepartments();
        setDepartmentNames(processDepartmentData(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    getDepartments();
  }, []);

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

  const FormObserver = () => {
    const { values } = useFormikContext();
    useEffect(() => {
      const getSubDepartments = async () => {
        try {
          const response = await subDepartmentApi.getSubDepartmentsByDepartment(
            values.departmentName
          );
          setSubDepartmentNames(processSubDepartmentData(response.data));
        } catch (error) {
          console.log(error);
        }
      };
      getSubDepartments();
    }, [values.departmentName]);
  };

  const handleSubmit = (values, actions) => {
    const postData = async () => {
      try {
        const response = await staffApi.createStaff(
          values,
          values.subDepartmentName
        );
        addStaffHandler();
      } catch (error) {
        actions.setStatus(error.response.data);
      }
    };
    postData();
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
          Enter New Staff Details
        </MDTypography>
      </MDBox>
      <MDBox p={5}>
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ status }) => (
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
                  <TextfieldWrapper name="firstname" hiddenlabel size="small" />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Last Name
                  </MDTypography>
                  <TextfieldWrapper name="lastname" hiddenlabel size="small" />
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
                  />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Password
                  </MDTypography>
                  <TextfieldWrapper name="password" hiddenlabel size="small" />
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
                    options={subDepartmentNames}
                  />
                </Grid>
              </Grid>
              <MDButton variant="contained" color="info" type="submit">
                Save
              </MDButton>
            </Form>
          )}
        </Formik>
      </MDBox>
    </>
  );
}

export default AddStaff;

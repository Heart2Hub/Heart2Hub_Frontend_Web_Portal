import React, { useEffect, useState, useRef } from "react";

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
  Input,
} from "@mui/material";

import { Formik, Form, useFormikContext } from "formik";
import * as yup from "yup";
import { staffApi, departmentApi, imageServerApi } from "api/Api";
import { subDepartmentApi } from "api/Api";
import TextfieldWrapper from "components/Textfield";
import SelectWrapper from "components/Select";
import CheckboxWrapper from "components/Checkbox";
import moment from "moment";

import { displayMessage } from "../../../store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import MDAvatar from "components/MDAvatar";
import { IMAGE_SERVER } from "constants/RestEndPoint";
import { wardApi } from "api/Api";

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
  unitName: yup.string().required("Unit is required")
});

function AddStaff({ returnToTableHandler, formState, editing }) {
  const existingPhoto = IMAGE_SERVER + "/images/id/" + formState.profilePicture;

  const [staffRoles, setStaffRoles] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [unitsByRole, setUnitsByRole] = useState(
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [editImageSrc, setEditImageSrc] = useState(existingPhoto);
  const reduxDispatch = useDispatch();
  const photoInputRef = useRef(null);

  const processDepartmentData = (departments) => {
    const departmentNames = departments.map((department) => department.name);
    return departmentNames;
  };

  const createStaffBody = (values) => {
    const staffBodyFields = [
      "username",
      "password",
      "firstname",
      "lastname",
      "mobileNumber",
      "staffRoleEnum",
      "isHead",
    ];
    const staffBody = staffBodyFields.reduce((obj, key) => {
      if (values.hasOwnProperty(key)) {
        obj[key] = values[key];
      }
      return obj;
    }, {});
    return staffBody;
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
    const getWards = async () => {
      try {
        const response = await wardApi.getAllWards("");
        setWardNames(processDepartmentData(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    getDepartments();
    getWards();
  }, []);


  const FormObserver = () => {
    const { values } = useFormikContext();
    useEffect(() => {
      setUnitsByRole(
        values.staffRoleEnum === "NURSE" ? wardNames : 
        values.staffRoleEnum === "" ? [] : departmentNames
      );
    }, [values.staffRoleEnum]);
  };

  const postStaff = async (staffBody, unitName, actions) => {
    try {
      const imageServerResponse = await imageServerApi.uploadProfilePhoto(
        "id",
        profilePhoto
      );

      const requestBody = {
        staff: staffBody,
        imageDocument: {
          imageLink: imageServerResponse.data.filename,
          createdDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
        },
      };

      console.log(requestBody);

      const response = await staffApi.createStaff(
        requestBody,
        unitName
      );
      returnToTableHandler();
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success!",
          content: "Staff has been created",
        })
      );
    } catch (error) {
      console.log(error);
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error!",
          content: error.response.data,
        })
      );
      //actions.setStatus(error.response.data);
    }
  };

  const putStaff = async (staffBody, unitName) => {
    try {
      const response = await staffApi.updateStaff(staffBody, unitName);
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success!",
          content: "Staff has been updated",
        })
      );
      returnToTableHandler();
    } catch (error) {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error!",
          content: error.response.data,
        })
      );
    }
  };

  const putStaffWithImage = async (staffBody, unitName) => {
    try {
      const imageServerResponse = await imageServerApi.uploadProfilePhoto(
        "id",
        profilePhoto
      );

      const requestBody = {
        staff: staffBody,
        imageDocument: {
          imageLink: imageServerResponse.data.filename,
          createdDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
        },
      };

      console.log(requestBody);

      const response = await staffApi.updateStaffWithImage(
        requestBody,
        unitName
      );
      returnToTableHandler();
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success!",
          content: "Staff has been updated",
        })
      );
    } catch (error) {
      console.log(error);
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error!",
          content: error.response.data,
        })
      );
    }
  };

  const handleSubmit = (values, actions) => {
    const unitName = values.unitName;
    const staffBody = createStaffBody(values);
    if (editing) {
      console.log("Updated staff");
      if (profilePhoto) {
        putStaffWithImage(staffBody, unitName);
      } else {
        putStaff(staffBody, unitName);
      }
    } else {
      console.log("Creating staff");
      postStaff(staffBody, unitName, actions);
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
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Success!",
            content: "Succesfully disabled staff",
          })
        );
        returnToTableHandler();
      } catch (error) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error!",
            content: error.response.data,
          })
        );
        console.log(error);
      }
    };
    disableStaff(username);
  };

  const handlePhotoUpload = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // const uploadedImage = document.getElementById("uploadedImage");
        // uploadedImage.src = e.target.result;
        if (editing) {
          setEditImageSrc(e.target.result);
        } else {
          setImageSrc(e.target.result);
        }
      };

      reader.readAsDataURL(file);
    }

    const formData = new FormData();
    formData.append("image", e.target.files[0], e.target.files[0].name);
    setProfilePhoto(formData);
  };

  const handleClearSelection = (e) => {
    e.preventDefault();
    setEditImageSrc(existingPhoto);
    setProfilePhoto(null);
    photoInputRef.current.value = null;
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

                <Grid item xs={7}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Unit
                  </MDTypography>
                  <SelectWrapper
                    name="unitName"
                    hiddenlabel
                    options={unitsByRole}
                    disabled={unitsByRole.length === 0}
                  />
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <MDBox>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Profile Photo
                    </MDTypography>
                    <input
                      ref={photoInputRef}
                      style={{ marginLeft: "10px" }}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </MDBox>
                  {editing ? (
                    <>
                      <button
                        style={{ marginLeft: "100px", padding: "2px" }}
                        onClick={handleClearSelection}
                      >
                        Clear Selection
                      </button>
                      <MDAvatar src={editImageSrc} size="xxl" />
                    </>
                  ) : (
                    <>
                      <MDAvatar src={imageSrc} size="xxl" />
                    </>
                  )}
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

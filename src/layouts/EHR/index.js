// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Icon } from "@mui/material";
// import DatePicker from "@mui/x-date-pickers";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";

import { patientApi, ehrApi } from "api/Api";
import { useDispatch } from "react-redux";
import { displayMessage } from "../../store/slices/snackbarSlice";
import { Label } from "@mui/icons-material";

function EHR() {
  const MaskedNRIC = ({ value }) => {
    // Mask the NRIC to display only the first and last characters
    const maskedValue = value ? value.charAt(0) + 'XXXX' + value.slice(-4) : '';
  
    return <span>{maskedValue}</span>;
  };

  const reduxDispatch = useDispatch();
  const [data, setData] = useState({
    columns: [
      {
        Header: "Electronic Health Record ID",
        accessor: "electronicHealthRecordId",
        width: "10%",
      },
      {
        Header: "Profile Picture",
        accessor: "profilePicture",
        width: "20%",
        Cell: ({ value }) => <Avatar alt="Profile Picture" src={value} />,
      },
      { Header: "NRIC", accessor: "nric", width: "20%", Cell: ({ value }) => <MaskedNRIC value={value} />, },
      { Header: "First Name", accessor: "firstName", width: "20%" },
      { Header: "Last Name", accessor: "lastName", width: "20%" },
      { Header: "Sex", accessor: "sex", width: "10%" },
      { Header: "Username", accessor: "username", width: "10%" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <MDBox>
            <IconButton
              color="secondary"
              onClick={() => {
                handleOpenModal(row.original.electronicHealthRecordId);
              }}
            >
              <Icon>visibility</Icon>
            </IconButton>
          </MDBox>
        ),
        width: "10%",
      },
    ],
    rows: [],
  });
  const dataRef = useRef({
    columns: [
      {
        Header: "Electronic Health Record ID",
        accessor: "electronicHealthRecordId",
        width: "10%",
      },
      {
        Header: "Profile Picture",
        accessor: "profilePicture",
        width: "20%",
        Cell: ({ value }) => <Avatar alt="Profile Picture" src={value} />,
      },
      { Header: "NRIC", accessor: "nric", width: "20%" },
      { Header: "First Name", accessor: "firstName", width: "20%" },
      { Header: "Last Name", accessor: "lastName", width: "20%" },
      { Header: "Sex", accessor: "sex", width: "10%" },
      { Header: "Username", accessor: "username", width: "10%" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <MDBox>
            <IconButton
              color="secondary"
              onClick={() => {
                handleOpenModal(row.original.electronicHealthRecordId);
                console.log("modal open clicked, data is", data);
              }}
            >
              <Icon>visibility</Icon>
            </IconButton>
          </MDBox>
        ),
        width: "10%",
      },
    ],
    rows: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    electronicHealthRecordId: 0,
    profilePicture: "",
    firstName: "",
    lastName: "",
    sex: "",
    username: "",
    dateOfBirth: "",
  });
  const [isDetailsCorrect, setIsDetailsCorrect] = useState(false);
  const [isPictureCorrect, setIsPictureCorrect] = useState(false);

  const handleOpenModal = (electronicHealthRecordId) => {
    const patientWithElectronicHealthRecordSummary =
      dataRef.current.rows[0].find(
        (patientWithElectronicHealthRecordSummary) =>
          patientWithElectronicHealthRecordSummary.electronicHealthRecordId ===
          electronicHealthRecordId
      );

    if (patientWithElectronicHealthRecordSummary) {
      setFormData({
        electronicHealthRecordId: electronicHealthRecordId,
        profilePicture: patientWithElectronicHealthRecordSummary.profilePicture,
        nric: patientWithElectronicHealthRecordSummary.nric,
        firstName: patientWithElectronicHealthRecordSummary.firstName,
        lastName: patientWithElectronicHealthRecordSummary.lastName,
        sex: patientWithElectronicHealthRecordSummary.sex,
        username: patientWithElectronicHealthRecordSummary.username,
      });

      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGetElectronicHealthRecordByIdAndDateOfBirth = () => {
    if (isDetailsCorrect & isPictureCorrect) {
      try {
        const { electronicHealthRecordId, dateOfBirth } = formData;
        if (dateOfBirth == null) {
          reduxDispatch(
            displayMessage({
              color: "error",
              icon: "notification",
              title: "Error Encountered",
              content: "Date must be present",
            })
          );
        return
        }
        const dateOfBirthFormatted = dateOfBirth + "T00:00:00";
        ehrApi
          .getElectronicHealthRecordByIdAndDateOfBirth(
            electronicHealthRecordId,
            dateOfBirthFormatted
          )
          .then((response) => {
            console.log(response);
            reduxDispatch(
              displayMessage({
                color: "success",
                icon: "notification",
                title: "Validation Success!",
                content:
                  "Retrieved Electronic Health Record With ID: " +
                  electronicHealthRecordId,
              })
            );
            setIsModalOpen(false);
            // ROUTE HERE
          })
          .catch((err) => {
            // Weird functionality here. If allow err.response.detail when null whle react application breaks cause error is stored in the state. Must clear cache. Something to do with redux.
            if (err.response.data.detail) {
              reduxDispatch(
                displayMessage({
                  color: "error",
                  icon: "notification",
                  title: "Validation Failed!",
                  content: err.response.data.detail,
                })
              );
            } else {
              reduxDispatch(
                displayMessage({
                  color: "error",
                  icon: "notification",
                  title: "Validation Failed!",
                  content: err.response.data,
                })
              );
            }
            console.log(err);
          });
      } catch (ex) {
        console.log(ex);
      }
    } else {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Validation Failed!",
          content: "Please check details & picture",
        })
      );
    }
  };

  const fetchData = async () => {
    // Consider adding buffering to load API data. Cause this part may get quite huge
    patientApi
      .getAllPatientsWithElectronicHealthRecordSummaryByName("")
      .then((response) => {
        const patientsWithElectronicHealthRecordSummary = response.data; // Assuming 'facilities' is an array of facility objects

        // Map the fetched data to match your table structure
        const mappedRows = patientsWithElectronicHealthRecordSummary.map(
          (patientWithElectronicHealthRecordSummary) => ({
            electronicHealthRecordId:
              patientWithElectronicHealthRecordSummary.electronicHealthRecordId,
            profilePicture:
              patientWithElectronicHealthRecordSummary.profilePicture,
            nric: patientWithElectronicHealthRecordSummary.nric,
            firstName: patientWithElectronicHealthRecordSummary.firstName,
            lastName: patientWithElectronicHealthRecordSummary.lastName,
            sex: patientWithElectronicHealthRecordSummary.sex,
            username: patientWithElectronicHealthRecordSummary.username,
            // Map other columns as needed
          })
        );

        dataRef.current = {
          ...dataRef.current,
          rows: [mappedRows],
        };

        setData((prevData) => ({
          ...prevData,
          rows: mappedRows,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                  EHR Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable canSearch={true} table={data} />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>View Patient EHR</DialogTitle>
        <DialogContent>
          <Avatar
            alt="Profile Picture"
            src={formData.profilePicture}
            sx={{ width: 100, height: 100, margin: "0 auto" }}
          />
          <TextField
            fullWidth
            label="Electronic Health Record ID"
            name="electronicHealthRecordId"
            value={formData.electronicHealthRecordId}
            readonly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="NRIC"
            name="nric"
            value={formData.nric}
            readonly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            readonly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            readonly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="Sex"
            name="sex"
            value={formData.sex}
            readonly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            readonly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            margin="dense"
          />
          <label>
            <Checkbox
              checked={isDetailsCorrect}
              onChange={(e) => setIsDetailsCorrect(e.target.checked)}
              name="isDetailsCorrect"
              color="primary"
            />
            Are details correct?
          </label>
          <label>
            <Checkbox
              checked={isPictureCorrect}
              onChange={(e) => setIsPictureCorrect(e.target.checked)}
              name="isPictureCorrect"
              color="primary"
            />
            Is picture correct?
          </label>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="primary">
            Cancel
          </MDButton>
          <MDButton
            onClick={handleGetElectronicHealthRecordByIdAndDateOfBirth}
            color="primary"
          >
            Submit
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EHR;

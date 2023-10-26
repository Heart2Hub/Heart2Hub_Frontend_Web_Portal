import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import {
  IconButton,
  Icon,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Divider,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { patientApi, ehrApi, imageServerApi } from "api/Api";
import { useDispatch } from "react-redux";
import { displayMessage } from "../../store/slices/snackbarSlice";
import { setEHRRecord } from "../../store/slices/ehrSlice";
import MDAvatar from "components/MDAvatar";
import { maskNric } from "utility/Utility";
import { treatmentPlanRecordApi } from "api/Api";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";

function EHR() {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const [imageURLs, setImageURLs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [listOfUnreadInvitations, setListOfUnreadInvitations] = useState([]);
  const [listOfReadInvitations, setListOfReadInvitations] = useState([]);

  //for opening the eyeball
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
        Cell: ({ value }) => {
          return <MDAvatar alt="Profile Picture" src={value} />;
        },
      },
      {
        Header: "NRIC",
        accessor: "nric",
        width: "20%",
        Cell: ({ value }) => maskNric(value),
      },
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

  //for datatable IS THIS TABLE EVEN BEING USED???
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
        Cell: ({ value }) => {
          return <MDAvatar alt="Profile Picture" src={value} />;
        },
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
    profilePicturePath: "",
    firstName: "",
    lastName: "",
    sex: "",
    username: "",
    dateOfBirth: "",
  });
  const [isDetailsCorrect, setIsDetailsCorrect] = useState(false);
  const [isPictureCorrect, setIsPictureCorrect] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);

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
        profilePicturePath:
          patientWithElectronicHealthRecordSummary.profilePicturePath,
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
          return;
        }
        const dateOfBirthFormatted = dateOfBirth + "T00:00:00";
        ehrApi
          .getElectronicHealthRecordByIdAndDateOfBirth(
            electronicHealthRecordId,
            dateOfBirthFormatted
          )
          .then((response) => {
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
            response.data = {
              ...response.data,
              username: formData.username,
              profilePicture: formData.profilePicturePath,
            };
            reduxDispatch(setEHRRecord(response.data));
            navigate("/ehr/ehrRecord");
          })
          .catch((err) => {
            console.log(err);
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
    setIsLoading(true);

    try {
      const response =
        await patientApi.getAllPatientsWithElectronicHealthRecordSummaryByName(
          ""
        );
      const patientsWithElectronicHealthRecordSummary = response.data;

      const imagePromises = patientsWithElectronicHealthRecordSummary.map(
        async (patient) => {
          if (patient.profilePicture) {
            const imageResponse = await imageServerApi.getImageFromImageServer(
              "id",
              patient.profilePicture
            );
            return {
              profilePictureId: patient.profilePicture,
              url: URL.createObjectURL(imageResponse.data),
            };
          }
          return null;
        }
      );

      const imageResults = await Promise.all(imagePromises);

      const newImageURLs = {};
      imageResults.forEach((image) => {
        if (image) {
          newImageURLs[image.profilePictureId] = image.url;
        }
      });

      setImageURLs(newImageURLs);
      // console.log(newImageURLs);

      const mappedRows = patientsWithElectronicHealthRecordSummary.map(
        (patientWithElectronicHealthRecordSummary) => {
          return {
            electronicHealthRecordId:
              patientWithElectronicHealthRecordSummary.electronicHealthRecordId,
            profilePicture:
              newImageURLs[
                patientWithElectronicHealthRecordSummary.profilePicture
              ],
            profilePicturePath:
              patientWithElectronicHealthRecordSummary.profilePicture,
            nric: patientWithElectronicHealthRecordSummary.nric,
            firstName: patientWithElectronicHealthRecordSummary.firstName,
            lastName: patientWithElectronicHealthRecordSummary.lastName,
            sex: patientWithElectronicHealthRecordSummary.sex,
            username: patientWithElectronicHealthRecordSummary.username,
          };
        }
      );

      dataRef.current = {
        ...dataRef.current,
        rows: [mappedRows],
      };

      setData((prevData) => ({
        ...prevData,
        rows: mappedRows,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setIsLoading(false);
  };

  const handleOpenInvitationDialog = async () => {
    setInvitationOpen(true);
    const response = await treatmentPlanRecordApi.getListOfInvitationsByStaffId(
      loggedInStaff.staffId
    );
    console.log(response.data);
    const listOfAllInvitations = response.data.filter(
      (inv) => inv.isPrimary === false
    );
    const listOfReadInvites = listOfAllInvitations.filter((inv) => inv.isRead);
    const listOfUnreadInvites = listOfAllInvitations.filter(
      (inv) => !inv.isRead
    );

    setListOfReadInvitations(listOfReadInvites);
    setListOfUnreadInvitations(listOfUnreadInvites);
  };

  const handleViewSelectedInvitationEHR = async (invitation) => {
    try {
      ehrApi
        .getElectronicHealthRecordById(invitation.electronicHealthRecordId)
        .then((response) => {
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Validation Success!",
              content:
                "Retrieved Electronic Health Record With ID: " +
                invitation.electronicHealthRecordId,
            })
          );
          setIsModalOpen(false);

          //set form data

          const patientWithElectronicHealthRecordSummary =
            dataRef.current.rows[0].find(
              (patientWithElectronicHealthRecordSummary) =>
                patientWithElectronicHealthRecordSummary.electronicHealthRecordId ===
                invitation.electronicHealthRecordId
            );

          // ROUTE HERE
          response.data = {
            ...response.data,
            username: patientWithElectronicHealthRecordSummary.username,
            profilePicture:
              patientWithElectronicHealthRecordSummary.profilePicturePath,
          };
          reduxDispatch(setEHRRecord(response.data));
          navigate("/ehr/ehrRecord");
        })
        .catch((err) => {
          console.log(err);
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <MDButton
            color="primary"
            sx={{ float: "right" }}
            onClick={handleOpenInvitationDialog}
          >
            My Invitations
          </MDButton>
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
        </>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>View Patient EHR</DialogTitle>
        <DialogContent>
          <Avatar
            alt="Profile Picture"
            src={imageURLs[formData.profilePicturePath]}
            sx={{ width: 100, height: 100, margin: "0 auto" }}
          />
          <TextField
            fullWidth
            label="Electronic Health Record ID"
            name="electronicHealthRecordId"
            value={formData.electronicHealthRecordId}
            readOnly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="NRIC"
            name="nric"
            value={formData.nric}
            readOnly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            readOnly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            readOnly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="Sex"
            name="sex"
            value={formData.sex}
            readOnly
            margin="dense"
            variant="standard"
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            readOnly
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
      <Dialog
        open={invitationOpen}
        onClose={() => setInvitationOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>My Invitations</DialogTitle>
        <DialogContent>
          <List
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::WebkitScrollbar": {
                display: "none",
              },
            }}
          >
            {/* for unread invitations */}

            {listOfUnreadInvitations.length === 0 && (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="10vh"
              >
                <ErrorOutlineIcon fontSize="large" />
                &nbsp;
                <MDTypography>You have no unread invitations</MDTypography>
              </MDBox>
            )}

            {listOfUnreadInvitations.map((invitation, index) => (
              <ListItem key={index} divider>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={4}>
                    <ListItemText
                      primary={`Invitation ID: ${invitation.invitationId}`}
                      secondary={`Treatment Plan ID: ${invitation.treatmentPlanRecordId}`}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <MDTypography variant="body2">
                      {`Invited By: ${invitation.invitedBy}`}
                    </MDTypography>

                    <ListItemSecondaryAction>
                      <MDButton
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          handleViewSelectedInvitationEHR(invitation)
                        }
                      >
                        View
                      </MDButton>
                    </ListItemSecondaryAction>
                  </Grid>
                </Grid>
              </ListItem>
            ))}

            <Divider />

            {/* for read invitations */}
            {listOfReadInvitations.length === 0 && (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="10vh"
              >
                <ErrorOutlineIcon fontSize="large" />
                &nbsp;
                <MDTypography>You have no read invitations</MDTypography>
              </MDBox>
            )}
            {listOfReadInvitations.map((invitation, index) => (
              <ListItem key={index} divider>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={4}>
                    <ListItemText
                      primary={`Invitation ID: ${invitation.invitationId}`}
                      secondary={`Treatment Plan ID: ${invitation.treatmentPlanRecordId}`}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <MDTypography variant="body2">
                      {`Invited By: ${invitation.invitedBy}`}
                    </MDTypography>

                    <ListItemSecondaryAction>
                      <MDButton
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          handleViewSelectedInvitationEHR(invitation)
                        }
                      >
                        View
                      </MDButton>
                    </ListItemSecondaryAction>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setInvitationOpen(false)} color="primary">
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EHR;

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { IconButton, Icon } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import React, { useEffect, useState } from "react";
import { IMAGE_SERVER } from "constants/RestEndPoint";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { problemRecordApi, ehrApi } from "api/Api";
import {
  selectEHRRecord,
  setEHRRecord,
  updateEHRRecord,
} from "../../../store/slices/ehrSlice";
import { selectStaff } from "../../../store/slices/staffSlice";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import {
  parseDateFromLocalDateTime,
  formatDateToYYYYMMDD,
} from "utility/Utility";
import { appointmentApi } from "api/Api";

function EHRRecord() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [nextOfKinEhrs, setNextOfKinEhrs] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openResolveProblemRecordModal, setOpenResolveProblemRecordModal] =
    useState(false);
  const [formData, setFormData] = useState({
    description: "",
    createdBy: "",
    createdDate: "",
    priorityEnum: "",
    problemTypeEnum: "",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenResolveProblemRecordModal = () => {
    setOpenResolveProblemRecordModal(true);
  };

  const handleCloseResolveProblemRecordModal = () => {
    setOpenResolveProblemRecordModal(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProblemRecord = () => {
    try {
      if (formData.description.trim() == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Description cannot be null",
          })
        );
        return;
      }
      if (formData.priorityEnum == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Priority cannot be null",
          })
        );
        return;
      }
      if (formData.problemTypeEnum == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Problem type cannot be null",
          })
        );
        return;
      }
      formData.createdBy =
        loggedInStaff.staffRoleEnum +
        " " +
        loggedInStaff.firstname +
        " " +
        loggedInStaff.lastname;
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")} ${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
      formData.createdDate = formattedDate;
      problemRecordApi
        .createProblemRecord(ehrRecord.electronicHealthRecordId, formData)
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfProblemRecords: [
              ...ehrRecord.listOfProblemRecords,
              response.data,
            ],
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          setFormData({
            description: "",
            createdBy: "",
            createdDate: "",
            priorityEnum: "",
            problemTypeEnum: "",
          });
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Created Facility!",
              content: formData.problemTypeEnum + " created",
            })
          );
          handleCloseModal();
        })
        .catch((err) => {
          console.log(err);
          setFormData({
            description: "",
            createdBy: "",
            createdDate: "",
            priorityEnum: "",
            problemTypeEnum: "",
          });
          // Weird functionality here. If allow err.response.detail when null whle react application breaks cause error is stored in the state. Must clear cache. Something to do with the state.
          if (err.response.data.detail) {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data.detail,
              })
            );
          } else {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data,
              })
            );
          }
          console.log(err.response.data.detail);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleResolveProblemRecord = (problemRecord) => {
    try {
      problemRecordApi
        .resolveProblemRecord(
          ehrRecord.electronicHealthRecordId,
          problemRecord.problemRecordId
        )
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfProblemRecords: ehrRecord.listOfProblemRecords.filter(
              (record) =>
                record.problemRecordId !== problemRecord.problemRecordId
            ),
            listOfMedicalHistoryRecords: [
              ...ehrRecord.listOfMedicalHistoryRecords,
              response.data,
            ],
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Resolved Problem Record!",
              content: response.data.problemTypeEnum + " resolved",
            })
          );
        })
        .catch((err) => {
          console.log(err);
          // Weird functionality here. If allow err.response.detail when null whle react application breaks cause error is stored in the state. Must clear cache. Something to do with the state.
          if (err.response.data.detail) {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data.detail,
              })
            );
          } else {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data,
              })
            );
          }
          console.log(err.response.data.detail);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    const fetchDataSequentially = async () => {
      const nextOfKinDataArray = [];
      for (const nextOfKin of ehrRecord.listOfNextOfKinRecords) {
        try {
          const response = await ehrApi.getElectronicHealthRecordByNric(
            nextOfKin.nric
          );
          const data = response.data;
          nextOfKinDataArray.push(data);
        } catch (error) {
          console.error("Error fetching EHR data:", error);
        }
      }
      setNextOfKinEhrs(nextOfKinDataArray);
      try {
        const response = await appointmentApi.viewPatientAppointments(
          ehrRecord.username
        );
        const allAppointments = response.data;
        setUpcomingAppointments([]);
        for (const appointment of allAppointments) {
          if (
            parseDateFromLocalDateTime(appointment.bookedDateTime) > new Date()
          ) {
            if (
              !upcomingAppointments.some(
                (existingAppointment) =>
                  existingAppointment.appointmentId ===
                  appointment.appointmentId
              )
            ) {
              setUpcomingAppointments((prevAppointments) => [
                ...prevAppointments,
                appointment,
              ]);
            }
          } else {
            // ADD PAST APPOINTMENT LOGIC HERE LATER ON
          }
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };
    fetchDataSequentially();
  }, [ehrRecord.listOfNextOfKinRecords]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header>
        <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="patient EHR information:"
            info={{
              firstName: ehrRecord.firstName,
              lastName: ehrRecord.lastName,
              birthDate: ehrRecord.dateOfBirth.split(" ")[0],
              address: ehrRecord.address,
              contactNumber: ehrRecord.contactNumber,
            }}
            shadow={false}
          />
        </MDBox>
      </Header>

      <MDBox position="relative" mb={5}>
        <MDBox position="relative" minHeight="5rem" />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            List of Problem Records:
            {ehrRecord.listOfProblemRecords.map((problemRecord, index) => (
              <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ProfileInfoCard
                      key={index}
                      title={`Problem ${index + 1}`}
                      info={{
                        createdBy: problemRecord.createdBy,
                        createdDate: problemRecord.createdDate.split(" ")[0],
                        description: problemRecord.description,
                        priority: problemRecord.priorityEnum,
                        problemType: problemRecord.problemTypeEnum,
                      }}
                      shadow={false}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    {loggedInStaff.staffRoleEnum === "DOCTOR" && (
                      <>
                        <MDButton
                          variant="contained"
                          color="primary"
                          onClick={handleOpenResolveProblemRecordModal}
                        >
                          Resolve Problem Record
                        </MDButton>
                        <Dialog
                          open={openResolveProblemRecordModal}
                          onClose={handleCloseResolveProblemRecordModal}
                        >
                          <DialogTitle>Confirm Resolution</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Are you sure you want to resolve this problem
                              record?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <MDButton
                              onClick={handleCloseResolveProblemRecordModal}
                              color="primary"
                            >
                              Cancel
                            </MDButton>
                            <MDButton
                              onClick={() => {
                                handleCloseResolveProblemRecordModal();
                                handleResolveProblemRecord(problemRecord);
                              }}
                              color="primary"
                            >
                              Confirm
                            </MDButton>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            ))}
            {loggedInStaff.staffRoleEnum === "DOCTOR" && (
              <MDBox mx={2} mt={3} px={2}>
                <MDButton
                  Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create New Problem Record
                  <Icon>add</Icon>
                </MDButton>
              </MDBox>
            )}
          </Typography>
        </Card>
      </MDBox>

      <MDBox position="relative" mb={5}>
        <MDBox position="relative" minHeight="5rem" />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            List of Upcoming Appointments:
            {upcomingAppointments.map((upcomingAppointment, index) => (
              <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ProfileInfoCard
                      key={index}
                      title={`Appointment ${index + 1}`}
                      info={{
                        bookedDateTime: formatDateToYYYYMMDD(
                          parseDateFromLocalDateTime(
                            upcomingAppointment.bookedDateTime
                          )
                        ),
                        departmentName: upcomingAppointment.departmentName,
                        description: upcomingAppointment.description,
                        estimatedDuration:
                          upcomingAppointment.estimatedDuration,
                      }}
                      shadow={false}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            ))}
          </Typography>
        </Card>
      </MDBox>

      {loggedInStaff.staffRoleEnum === "DOCTOR" && (
        <MDBox position="relative" mb={5}>
          <MDBox position="relative" minHeight="5rem" />
          <Card
            sx={{
              position: "relative",
              mt: -8,
              mx: 3,
              py: 2,
              px: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              List of Medical History Records:
            </Typography>
            {ehrRecord.listOfMedicalHistoryRecords.map(
              (medicalRecord, index) => (
                <ProfileInfoCard
                  key={index}
                  title={`Medical History ${index + 1}`}
                  info={{
                    createdBy: medicalRecord.createdBy,
                    createdDate: medicalRecord.createdDate.split(" ")[0],
                    resolvedDate: medicalRecord.resolvedDate.split(" ")[0],
                    description: medicalRecord.description,
                    priority: medicalRecord.priorityEnum,
                    problemType: medicalRecord.problemTypeEnum,
                  }}
                  shadow={false}
                />
              )
            )}
          </Card>
        </MDBox>
      )}

      {loggedInStaff.staffRoleEnum === "DOCTOR" && (
        <MDBox position="relative" mb={5}>
          <MDBox position="relative" minHeight="5rem" />
          <Card
            sx={{
              position: "relative",
              mt: -8,
              mx: 3,
              py: 2,
              px: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              List of Next of Kin Records:
            </Typography>
            {ehrRecord.listOfNextOfKinRecords.map((nextOfKinRecord, index) => {
              // Check if nextOfKinRecord.nric exists in nextOfKinEhrs
              const ehrMatch = nextOfKinEhrs.find(
                (ehr) => ehr.nric === nextOfKinRecord.nric
              );
              return (
                <Accordion key={index}>
                  <AccordionSummary>
                    <Typography variant="h6">
                      {nextOfKinRecord.relationship}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {ehrMatch ? (
                      // Render the EHR data here if a match is found
                      <MDBox>
                        <Typography>NRIC: {ehrMatch.nric}</Typography>
                        <Divider
                          orientation="horizontal"
                          sx={{ ml: -2, mr: 1 }}
                        />
                        {ehrMatch.listOfMedicalHistoryRecords.map(
                          (medicalHistory, medicalHistoryIndex) => (
                            <MDBox key={medicalHistoryIndex}>
                              <MDBox mb={1.5}>
                                <ProfileInfoCard
                                  key={index}
                                  title={`Medical History ${index + 1}`}
                                  info={{
                                    createdBy: medicalHistory.createdBy,
                                    createdDate:
                                      medicalHistory.createdDate.split(" ")[0],
                                    resolvedDate:
                                      medicalHistory.resolvedDate.split(" ")[0],
                                    description: medicalHistory.description,
                                    priority: medicalHistory.priorityEnum,
                                    problemType: medicalHistory.problemTypeEnum,
                                  }}
                                  shadow={false}
                                />
                              </MDBox>
                            </MDBox>
                          )
                        )}
                        <Divider
                          orientation="horizontal"
                          sx={{ ml: -2, mr: 1 }}
                        />
                        {ehrMatch.listOfProblemRecords.map(
                          (problem, problemIndex) => (
                            <MDBox key={problemIndex}>
                              <ProfileInfoCard
                                key={index}
                                title={`Problem ${index + 1}`}
                                info={{
                                  createdBy: problem.createdBy,
                                  createdDate:
                                    problem.createdDate.split(" ")[0],
                                  description: problem.description,
                                  priority: problem.priorityEnum,
                                  problemType: problem.problemTypeEnum,
                                }}
                                shadow={false}
                              />
                            </MDBox>
                          )
                        )}
                      </MDBox>
                    ) : (
                      <MDBox>
                        <Typography variant="h6">
                          {nextOfKinRecord.nric}
                        </Typography>
                        <Divider
                          orientation="horizontal"
                          sx={{ ml: -2, mr: 1 }}
                        />
                        <Typography>
                          No EHR data found for this next of kin.
                        </Typography>
                      </MDBox>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Card>
        </MDBox>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Create New Problem Record</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priorityEnum"
              value={formData.priorityEnum}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="problemTypeEnum"
              value={formData.problemTypeEnum}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="ALLERGIES_AND_IMMUNOLOGIC">
                Allergies and Immunologic
              </MenuItem>
              <MenuItem value="CARDIOVASCULAR">Cardiovascular</MenuItem>
              <MenuItem value="DENTAL_AND_ORAL">Dental and Oral</MenuItem>
              <MenuItem value="DERMATOLOGIC">Dermatologic</MenuItem>
              <MenuItem value="GASTROINTESTINAL">Gastrointestinal</MenuItem>
              <MenuItem value="ENDOCRINE_AND_METABOLIC">
                Endocrine and Metabolic
              </MenuItem>
              <MenuItem value="ENVIRONMENTAL_AND_SOCIAL">
                Environmental and Social
              </MenuItem>
              <MenuItem value="EYE_AND_EAR">Eye and Ear</MenuItem>
              <MenuItem value="GENITOURINARY_SYSTEM">
                Genitourinary System
              </MenuItem>
              <MenuItem value="GYNECOLOGIC">Gynecologic</MenuItem>
              <MenuItem value="HEMATOLOGIC">Hematologic</MenuItem>
              <MenuItem value="HEPATIC_AND_PANCREATIC">
                Hepatic and Pancreatic
              </MenuItem>
              <MenuItem value="INFECTIOUS_DISEASES">
                Infectious Diseases
              </MenuItem>
              <MenuItem value="INJURIES_AND_ACCIDENTS">
                Injuries and Accidents
              </MenuItem>
              <MenuItem value="INTEGUMENTARY_SYSTEM">
                Integumentary System
              </MenuItem>
              <MenuItem value="NEOPLASMS">Neoplasms</MenuItem>
              <MenuItem value="NERVOUS_SYSTEM">Nervous System</MenuItem>
              <MenuItem value="NUTRITIONAL">Nutritional</MenuItem>
              <MenuItem value="OBSTETRIC">Obstetric</MenuItem>
              <MenuItem value="OPTHALMOLOGIC">Ophthalmologic</MenuItem>
              <MenuItem value="OTOLOGIC_AND_LARYNGOLOGIC">
                Otologic and Laryngologic
              </MenuItem>
              <MenuItem value="OTHERS">Others</MenuItem>
              <MenuItem value="PEDIATRIC_AND_DEVELOPMENTAL">
                Pediatric and Developmental
              </MenuItem>
              <MenuItem value="POISONING">Poisoning</MenuItem>
              <MenuItem value="PSYCHIATRIC_MENTAL_HEALTH">
                Psychiatric Mental Health
              </MenuItem>
              <MenuItem value="REPRODUCTIVE">Reproductive</MenuItem>
              <MenuItem value="RESPIRATORY">Respiratory</MenuItem>
              <MenuItem value="SURGICAL_AND_POSTOPERATIVE">
                Surgical and Postoperative
              </MenuItem>
              <MenuItem value="TRAUMA_AND_ORTHOPEDIC">
                Trauma and Orthopedic
              </MenuItem>
              <MenuItem value="UROLOGIC">Urologic</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleCreateProblemRecord} color="primary">
            Create
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EHRRecord;


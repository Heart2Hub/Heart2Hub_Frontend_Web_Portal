import React from "react";
import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { displayMessage } from "../../../../store/slices/snackbarSlice";
import {
  selectEHRRecord,
  setEHRRecord,
  updateEHRRecord,
} from "../../../../store/slices/ehrSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import { problemRecordApi, ehrApi } from "api/Api";

function ProblemRecordsBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [openResolveProblemRecordModal, setOpenResolveProblemRecordModal] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <>
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
          <MDTypography variant="h6" gutterBottom>
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
                  onClick={handleOpenModal}
                >
                  Create New Problem Record
                  <Icon>add</Icon>
                </MDButton>
              </MDBox>
            )}
          </MDTypography>
        </Card>
      </MDBox>
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
    </>
  );
}

export default ProblemRecordsBox;

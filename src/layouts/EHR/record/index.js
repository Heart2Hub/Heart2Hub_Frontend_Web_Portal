import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { IconButton, Icon } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
import { problemRecordApi } from "api/Api";
import { selectEHRRecord, setEHRRecord, updateEHRRecord } from "../../../store/slices/ehrSlice";
import { selectStaff } from "../../../store/slices/staffSlice";
import { displayMessage } from "../../../store/slices/snackbarSlice";

function EHRRecord() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProblemRecord = () => {
    try {
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
      formData.createdBy = loggedInStaff.staffRoleEnum + " " + loggedInStaff.firstName + " " + loggedInStaff.lastName
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}T${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}:${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
      formData.createdDate = formattedDate
      console.log(ehrRecord)
      problemRecordApi
        .createProblemRecord(ehrRecord.electronicHealthRecordId
          , formData)
        .then((response) => {
          reduxDispatch(
            updateEHRRecord({
              ...ehrRecord,
              listOfProblemRecords: [...ehrRecord.listOfProblemRecords, response.data],
            })
          );        
          console.log(ehrRecord)
          console.log(response)
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
          console.log(err)
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

  useEffect(() => {
    console.log(ehrRecord); // This will log the updated ehrRecord
  }, [ehrRecord]);

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
              username: ehrRecord.username,
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
              <ProfileInfoCard
                key={index}
                title={`Problem ${index + 1}`}
                info={{
                  createdBy: problemRecord.createdBy,
                  createdDate: problemRecord.createdDate.join("/"),
                  description: problemRecord.description,
                  priority: problemRecord.priorityEnum,
                  problemType: problemRecord.problemTypeEnum,
                }}
                shadow={false}
              />
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
                    createdDate: medicalRecord.createdDate.join("/"),
                    description: medicalRecord.description,
                    priority: medicalRecord.priorityEnum,
                    problemType: medicalRecord.problemTypeEnum,
                    resolvedDate: medicalRecord.resolvedDate.join("/"),
                  }}
                  shadow={false}
                />
              )
            )}
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

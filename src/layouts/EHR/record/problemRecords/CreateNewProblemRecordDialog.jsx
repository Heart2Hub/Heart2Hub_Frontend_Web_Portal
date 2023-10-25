import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import MDButton from "components/MDButton";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import { problemRecordApi, ehrApi } from "api/Api";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectEHRRecord, updateEHRRecord } from "store/slices/ehrSlice";

function CreateNewProblemRecordDialog({
  openCreateProblemRecordDialog,
  handleCloseCreateProblemRecordDialog,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [formData, setFormData] = useState({
    description: "",
    createdBy: "",
    createdDate: "",
    priorityEnum: "",
    problemTypeEnum: "",
  });

  const handleFormChange = (event) => {
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
            content: "Description cannot be empty",
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
            content: "Priority cannot be empty",
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
            content: "Problem type cannot be empty",
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
          handleCloseCreateProblemRecordDialog();
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

  return (
    <>
      <Dialog
        open={openCreateProblemRecordDialog}
        onClose={handleCloseCreateProblemRecordDialog}
        sx={{ "& .MuiDialog-paper": { width: "500px", height: "350px" } }}
      >
        <DialogTitle>Create New Problem Record</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priorityEnum"
              value={formData.priorityEnum}
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
          <MDButton
            onClick={handleCloseCreateProblemRecordDialog}
            color="primary"
          >
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

export default CreateNewProblemRecordDialog;

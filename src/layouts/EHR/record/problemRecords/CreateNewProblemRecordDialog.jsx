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
import { problemRecordApi } from "api/Api";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectEHRRecord, updateEHRRecord } from "store/slices/ehrSlice";
import { listOfProblemTypeEnum } from "./ProblemTypeEnum";
import { listOfAllergenEnum } from "./AllergenEnum";

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
      if (formData.description.trim() === "") {
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
      if (formData.priorityEnum === "") {
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
      if (formData.problemTypeEnum === "") {
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

      if (formData.problemTypeEnum === "ALLERGIES_AND_IMMUNOLOGIC") {
        problemRecordApi
          .createAllergyRecord(ehrRecord.electronicHealthRecordId, formData)
          .then((response) => {
            const updatedEhrRecord = {
              ...ehrRecord,
              listOfMedicalHistoryRecords: [
                ...ehrRecord.listOfMedicalHistoryRecords,
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
                title: "Success!",
                content: "Successfully created Allergy",
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
      } else {
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
                title: "Success!",
                content: "Successfully created problem",
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
      }
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="problemTypeEnum"
              value={formData.problemTypeEnum}
              onChange={handleFormChange}
              sx={{ lineHeight: "3em" }}
            >
              {listOfProblemTypeEnum.map((problemType) => {
                return <MenuItem value={problemType}>{problemType}</MenuItem>;
              })}
            </Select>
          </FormControl>
          {formData.problemTypeEnum === "ALLERGIES_AND_IMMUNOLOGIC" ? (
            <FormControl fullWidth margin="dense">
              <InputLabel>Description</InputLabel>
              <Select
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                disabled={!formData.problemTypeEnum}
                sx={{ lineHeight: "3em" }}
              >
                {listOfAllergenEnum.map((allergen) => (
                  <MenuItem value={allergen}>{allergen}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              margin="dense"
              disabled={!formData.problemTypeEnum}
            />
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priorityEnum"
              value={formData.priorityEnum}
              onChange={handleFormChange}
              sx={{ lineHeight: "3em" }}
              disabled={!formData.problemTypeEnum}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
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

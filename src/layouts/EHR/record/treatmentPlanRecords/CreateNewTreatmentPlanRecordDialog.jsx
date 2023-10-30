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
import { treatmentPlanRecordApi } from "api/Api";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectEHRRecord, updateEHRRecord } from "store/slices/ehrSlice";
import { listOfTreatmentPlanTypes } from "./TreatmentPlanTypeEnum";
import MDTypography from "components/MDTypography";

function CreateNewTreatmentPlanRecordDialog({
  openCreateTreatmentPlanRecordDialog,
  handleCloseCreateTreatmentPlanRecordDialog,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    treatmentPlanTypeEnum: "",
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateTreatmentPlanRecord = () => {
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
      if (formData.treatmentPlanTypeEnum === "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Treatment Plan Type cannot be empty",
          })
        );
        return;
      }
      if (formData.startDate === "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Start Date cannot be empty",
          })
        );
        return;
      }

      // console.log(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputStartDate = new Date(formData.startDate);
      inputStartDate.setHours(0, 0, 0, 0);

      const inputEndDate = new Date(formData.endDate);
      inputEndDate.setHours(0, 0, 0, 0);
      // yyyy-MM-dd HH:mm:ss
      if (inputStartDate < today) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Start Date cannot be before Today",
          })
        );
        return;
      }

      if (inputEndDate < inputStartDate) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Start Date cannot be after End Date",
          })
        );
        return;
      }
      formData.startDate = formData.startDate + " 00:00:00";
      formData.endDate = formData.endDate + " 00:00:00";

      treatmentPlanRecordApi
        .createTreatmentPlanRecord(
          ehrRecord.electronicHealthRecordId,
          loggedInStaff.staffId,
          formData
        )
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfTreatmentPlanRecords: [
              ...ehrRecord.listOfTreatmentPlanRecords,
              response.data,
            ],
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          setFormData({
            description: "",
            startDate: "",
            endDate: "",
            treatmentPlanTypeEnum: "",
          });
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Success",
              content: "Successfully created Treatment Plan Record",
            })
          );
          handleCloseCreateTreatmentPlanRecordDialog();
        })
        .catch((err) => {
          console.log(err);
          setFormData({
            description: "",
            startDate: "",
            endDate: "",
            treatmentPlanTypeEnum: "",
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
        open={openCreateTreatmentPlanRecordDialog}
        onClose={handleCloseCreateTreatmentPlanRecordDialog}
        sx={{ "& .MuiDialog-paper": { width: "700px", height: "600px" } }}
      >
        <DialogTitle>Create New Treatment Plan</DialogTitle>

        <DialogContent>
          <FormControl fullWidth margin="dense">
            <MDTypography variant="h6">Start Date:</MDTypography>
            <TextField
              fullWidth
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleFormChange}
              margin="dense"
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <MDTypography variant="h6">End Date:</MDTypography>
            <TextField
              fullWidth
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleFormChange}
              margin="dense"
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Treatment Plan Type</InputLabel>
            <Select
              name="treatmentPlanTypeEnum"
              value={formData.treatmentPlanTypeEnum}
              onChange={handleFormChange}
              sx={{ lineHeight: "3em" }}
            >
              {listOfTreatmentPlanTypes.length > 0 &&
                listOfTreatmentPlanTypes.map((plan, index) => (
                  <MenuItem value={plan} key={index}>
                    {plan}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              margin="dense"
              multiline
              rows={6}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={handleCloseCreateTreatmentPlanRecordDialog}
            color="primary"
          >
            Cancel
          </MDButton>
          <MDButton onClick={handleCreateTreatmentPlanRecord} color="primary">
            Create
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateNewTreatmentPlanRecordDialog;

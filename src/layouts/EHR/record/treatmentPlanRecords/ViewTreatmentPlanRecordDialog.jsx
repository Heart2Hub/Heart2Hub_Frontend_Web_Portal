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
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import { treatmentPlanRecordApi } from "api/Api";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectEHRRecord, updateEHRRecord } from "store/slices/ehrSlice";
import { listOfTreatmentPlanTypes } from "./TreatmentPlanTypeEnum";
import MDTypography from "components/MDTypography";
import ViewImageDialog from "./ViewImageDialog";
import UploadImageDialog from "./UploadImageDialog";
import CompleteTreatmentPlanRecordDialog from "./CompleteTreatmentPlanRecordDialog";
import ViewInvitationDialog from "./ViewInvitationDialog";

function ViewTreatmentPlanRecordDialog({
  openViewTreatmentPlanRecordDialog,
  handleCloseViewTreatmentPlanRecordDialog,
  selectedTreatmentPlanRecordToView,
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

  //view image in treatment plan record
  const [openViewImageDialog, setOpenViewImageDialog] = useState(false);
  //upload image to treatment plan record
  const [openUploadImageDialog, setOpenUploadImageDialog] = useState(false);
  // complete treatment plan record
  const [
    openCompleteTreatmentPlanRecordDialog,
    setOpenCompleteTreatmentPlanRecordDialog,
  ] = useState(false);

  //view invitations to treatment plan record
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  //view image in treatment plan records
  const handleOpenViewImageDialog = () => {
    setOpenViewImageDialog(true);
  };

  const handleCloseViewImageDialog = () => {
    setOpenViewImageDialog(false);
  };

  //upload image in treatment plan records
  const handleOpenUploadImageDialog = () => {
    setOpenUploadImageDialog(true);
  };

  const handleCloseUploadImageDialog = () => {
    setOpenUploadImageDialog(false);
  };

  //complete treatment plan record
  const handleOpenCompleteTreatmentPlanRecordDialog = () => {
    setOpenCompleteTreatmentPlanRecordDialog(true);
  };
  const handleCloseCompleteTreatmentPlanRecordDialog = () => {
    setOpenCompleteTreatmentPlanRecordDialog(false);
  };

  //view invitations
  const handleOpenInvitationDialog = () => {
    setOpenInvitationDialog(true);
  };
  const handleCloseInvitationDialog = () => {
    setOpenInvitationDialog(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateTreatmentPlanRecord = () => {
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

      // Check that the endDate is after the startDate
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(formData.endDate);
      if (endDateObj <= startDateObj) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "End Date cannot be before or equal to Start Date",
          })
        );
        return;
      }

      formData.startDate = formData.startDate + " 00:00:00";
      formData.endDate = formData.endDate + " 00:00:00";

      console.log(selectedTreatmentPlanRecordToView.treatmentPlanRecordId);
      treatmentPlanRecordApi
        .updateTreatmentPlanRecord(
          ehrRecord.electronicHealthRecordId,
          selectedTreatmentPlanRecordToView.treatmentPlanRecordId,
          loggedInStaff.staffId,
          formData
        )
        .then((response) => {
          // Create a deep copy of the treatment plan records array
          const updatedTreatmentPlanRecords = [
            ...ehrRecord.listOfTreatmentPlanRecords,
          ];

          // Identify the index of the existing Treatment Plan in the list
          const existingRecordIndex = updatedTreatmentPlanRecords.findIndex(
            (record) =>
              record.treatmentPlanRecordId ===
              selectedTreatmentPlanRecordToView.treatmentPlanRecordId
          );

          // If found, replace the existing record with the updated one in the copy
          if (existingRecordIndex !== -1) {
            updatedTreatmentPlanRecords.splice(
              existingRecordIndex,
              1,
              response.data
            );
          }

          const updatedEhrRecord = {
            ...ehrRecord,
            listOfTreatmentPlanRecords: updatedTreatmentPlanRecords,
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
          handleCloseViewTreatmentPlanRecordDialog();
        })
        .catch((err) => {
          console.log(err);
          setFormData({
            description: selectedTreatmentPlanRecordToView.description,
            startDate:
              selectedTreatmentPlanRecordToView.startDate.split(" ")[0],
            endDate:
              selectedTreatmentPlanRecordToView.endDate !== null
                ? selectedTreatmentPlanRecordToView.endDate.split(" ")[0]
                : "",
            treatmentPlanTypeEnum:
              selectedTreatmentPlanRecordToView.treatmentPlanTypeEnum,
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

  const handleDeleteTreatmentPlanRecord = () => {
    try {
      treatmentPlanRecordApi
        .deleteTreatmentPlanRecord(
          ehrRecord.electronicHealthRecordId,
          selectedTreatmentPlanRecordToView.treatmentPlanRecordId,
          loggedInStaff.staffId
        )
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfTreatmentPlanRecords:
              ehrRecord.listOfTreatmentPlanRecords.filter(
                (record) =>
                  record.treatmentPlanRecordId !==
                  selectedTreatmentPlanRecordToView.treatmentPlanRecordId
              ),
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Deleted",
              content: "Treatment Plan has been deleted",
            })
          );
          handleCloseViewTreatmentPlanRecordDialog();
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
    if (selectedTreatmentPlanRecordToView) {
      console.log(selectedTreatmentPlanRecordToView);
      setFormData({
        description: selectedTreatmentPlanRecordToView.description,
        startDate: selectedTreatmentPlanRecordToView.startDate.split(" ")[0],
        endDate:
          selectedTreatmentPlanRecordToView.endDate !== null
            ? selectedTreatmentPlanRecordToView.endDate.split(" ")[0]
            : "",
        treatmentPlanTypeEnum:
          selectedTreatmentPlanRecordToView.treatmentPlanTypeEnum,
      });
    }
    console.log(selectedTreatmentPlanRecordToView);
  }, [selectedTreatmentPlanRecordToView]);

  return (
    <>
      {selectedTreatmentPlanRecordToView && (
        <>
          <Dialog
            open={openViewTreatmentPlanRecordDialog}
            onClose={handleCloseViewTreatmentPlanRecordDialog}
            sx={{ "& .MuiDialog-paper": { width: "1500px", height: "700px" } }}
          >
            <DialogTitle>
              Treatment Plan{" "}
              {selectedTreatmentPlanRecordToView.treatmentPlanRecordId}
            </DialogTitle>
            Created By: PRIMARY DOCTOR NEEDED
            <DialogActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <MDButton onClick={handleOpenInvitationDialog} color="dark">
                View Invitations
              </MDButton>
              <div>
                <MDButton
                  onClick={handleOpenViewImageDialog}
                  color="light"
                  style={{ marginRight: "10px" }}
                >
                  View Images
                </MDButton>
                {!selectedTreatmentPlanRecordToView.isCompleted && (
                  <MDButton onClick={handleOpenUploadImageDialog} color="light">
                    Add Images
                  </MDButton>
                )}
              </div>
            </DialogActions>
            <DialogContent>
              <FormControl fullWidth margin="dense">
                <MDTypography variant="h6">Start Date:</MDTypography>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  margin="dense"
                  disabled
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
                  disabled={selectedTreatmentPlanRecordToView.isCompleted}
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Treatment Plan Type</InputLabel>
                <Select
                  name="treatmentPlanTypeEnum"
                  value={formData.treatmentPlanTypeEnum}
                  onChange={handleFormChange}
                  sx={{ lineHeight: "3em" }}
                  disabled={selectedTreatmentPlanRecordToView.isCompleted}
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
                  rows={4}
                  disabled={selectedTreatmentPlanRecordToView.isCompleted}
                />
              </FormControl>
            </DialogContent>
            <DialogActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <MDButton
                onClick={handleCloseViewTreatmentPlanRecordDialog}
                color="info"
              >
                Close
              </MDButton>
              {!selectedTreatmentPlanRecordToView.isCompleted && (
                <div>
                  <MDButton
                    onClick={handleUpdateTreatmentPlanRecord}
                    color="success"
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </MDButton>
                  <MDButton
                    onClick={handleDeleteTreatmentPlanRecord}
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    Delete
                  </MDButton>
                  <MDButton
                    onClick={handleOpenCompleteTreatmentPlanRecordDialog}
                    color="warning"
                  >
                    Complete
                  </MDButton>
                </div>
              )}
            </DialogActions>
          </Dialog>
          <ViewImageDialog
            openViewImageDialog={openViewImageDialog}
            handleCloseViewImageDialog={handleCloseViewImageDialog}
            selectedRecordToViewImages={selectedTreatmentPlanRecordToView}
          />
          <UploadImageDialog
            selectedRecordToUploadImage={selectedTreatmentPlanRecordToView}
            openUploadImageDialog={openUploadImageDialog}
            handleCloseUploadImageDialog={handleCloseUploadImageDialog}
          />
          <CompleteTreatmentPlanRecordDialog
            openCompleteTreatmentPlanRecordDialog={
              openCompleteTreatmentPlanRecordDialog
            }
            selectedTreatmentPlanRecordToComplete={
              selectedTreatmentPlanRecordToView
            }
            handleCloseCompleteTreatmentPlanRecordDialog={
              handleCloseCompleteTreatmentPlanRecordDialog
            }
          />
          <ViewInvitationDialog
            openInvitationDialog={openInvitationDialog}
            handleCloseInvitationDialog={handleCloseInvitationDialog}
            selectedTreatmentPlanRecord={selectedTreatmentPlanRecordToView}
          />
        </>
      )}
    </>
  );
}

export default ViewTreatmentPlanRecordDialog;

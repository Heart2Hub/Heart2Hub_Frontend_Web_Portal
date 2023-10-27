import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { treatmentPlanRecordApi } from "api/Api";
import MDButton from "components/MDButton";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { updateEHRRecord } from "store/slices/ehrSlice";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectStaff } from "store/slices/staffSlice";

function CompleteTreatmentPlanRecordDialog({
  openCompleteTreatmentPlanRecordDialog,
  selectedTreatmentPlanRecordToComplete,
  handleCloseCompleteTreatmentPlanRecordDialog,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const handleCompleteTreatmentPlanRecord = (treatmentPlanRecord) => {
    try {
      treatmentPlanRecordApi
        .completeTreatmentPlanRecord(
          ehrRecord.electronicHealthRecordId,
          treatmentPlanRecord.treatmentPlanRecordId,
          loggedInStaff.staffId
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
              selectedTreatmentPlanRecordToComplete.treatmentPlanRecordId
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
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Completed Treatment Plan!",
              content: "Completed",
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

  const handleConfirmComplete = () => {
    handleCompleteTreatmentPlanRecord(selectedTreatmentPlanRecordToComplete);
    handleCloseCompleteTreatmentPlanRecordDialog();
  };

  return (
    <>
      <Dialog
        open={openCompleteTreatmentPlanRecordDialog}
        onClose={handleCloseCompleteTreatmentPlanRecordDialog}
      >
        <DialogTitle>Confirm Completion of Treatment Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to complete this Treatment Plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={handleCloseCompleteTreatmentPlanRecordDialog}
            color="primary"
          >
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirmComplete} color="primary">
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CompleteTreatmentPlanRecordDialog;

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
function ConfirmApproveTreatmentPlanDialog({
  openConfirmApproveTreatmentPlanRecordDialog,
  selectedTreatmentPlanRecord,
  handleCloseConfirmApproveTreatmentPlanRecordDialog,
  handleRefresh,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const handleConfirmApproveTreatmentPlanRecord = (treatmentPlanRecord) => {
    try {
      treatmentPlanRecordApi
        .setInvitationToApproved(
          treatmentPlanRecord.treatmentPlanRecordId,
          loggedInStaff.staffId
        )
        .then((response) => {
          console.log(response.data);
          // Create a deep copy of the treatment plan records array
          const updatedTreatmentPlanRecords = [
            ...ehrRecord.listOfTreatmentPlanRecords,
          ];

          // Identify the index of the existing Treatment Plan in the list
          const existingRecordIndex = updatedTreatmentPlanRecords.findIndex(
            (record) =>
              record.treatmentPlanRecordId ===
              selectedTreatmentPlanRecord.treatmentPlanRecordId
          );

          // If found, replace the existing record with the updated one in the copy
          if (existingRecordIndex !== -1) {
            updatedTreatmentPlanRecords.splice(
              existingRecordIndex,
              1,
              selectedTreatmentPlanRecord
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
              title: "Success",
              content: "Treatment Plan has been approved!",
            })
          );
        });
      handleRefresh();
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleConfirm = () => {
    handleConfirmApproveTreatmentPlanRecord(selectedTreatmentPlanRecord);
    handleCloseConfirmApproveTreatmentPlanRecordDialog();
  };

  return (
    <>
      <Dialog
        open={openConfirmApproveTreatmentPlanRecordDialog}
        onClose={handleCloseConfirmApproveTreatmentPlanRecordDialog}
      >
        <DialogTitle>Confirm Approve of Treatment Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this Treatment Plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={handleCloseConfirmApproveTreatmentPlanRecordDialog}
            color="primary"
          >
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirm} color="primary">
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmApproveTreatmentPlanDialog;

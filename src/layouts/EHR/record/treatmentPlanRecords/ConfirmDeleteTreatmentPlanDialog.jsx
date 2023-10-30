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
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { updateEHRRecord } from "store/slices/ehrSlice";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectStaff } from "store/slices/staffSlice";

function ConfirmDeleteTreatmentPlanDialog({
  openConfirmDeleteTreatmentPlanRecordDialog,
  selectedTreatmentPlanRecord,
  handleCloseConfirmDeleteTreatmentPlanRecordDialog,
  handleRefresh,
  handleCloseViewTreatmentPlanRecordDialog,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const handleDeleteTreatmentPlanRecord = () => {
    try {
      treatmentPlanRecordApi
        .deleteTreatmentPlanRecord(
          ehrRecord.electronicHealthRecordId,
          selectedTreatmentPlanRecord.treatmentPlanRecordId,
          loggedInStaff.staffId
        )
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfTreatmentPlanRecords:
              ehrRecord.listOfTreatmentPlanRecords.filter(
                (record) =>
                  record.treatmentPlanRecordId !==
                  selectedTreatmentPlanRecord.treatmentPlanRecordId
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
      handleRefresh();
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleConfirm = () => {
    handleDeleteTreatmentPlanRecord();
    handleCloseConfirmDeleteTreatmentPlanRecordDialog();
    handleCloseViewTreatmentPlanRecordDialog();
  };

  return (
    <>
      <Dialog
        open={openConfirmDeleteTreatmentPlanRecordDialog}
        onClose={handleCloseConfirmDeleteTreatmentPlanRecordDialog}
      >
        <DialogTitle>Confirm Delete of Treatment Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete this Treatment Plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={handleCloseConfirmDeleteTreatmentPlanRecordDialog}
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

export default ConfirmDeleteTreatmentPlanDialog;

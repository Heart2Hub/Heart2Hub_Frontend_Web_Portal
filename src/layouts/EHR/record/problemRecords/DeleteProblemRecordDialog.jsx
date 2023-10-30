import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { problemRecordApi } from "api/Api";
import MDButton from "components/MDButton";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { updateEHRRecord } from "store/slices/ehrSlice";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectStaff } from "store/slices/staffSlice";

function DeleteProblemRecordDialog({
  openDeleteProblemRecordDialog,
  selectedProblemRecordToDelete,
  handleCloseDeleteProblemRecordDialog,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const handleDeleteProblemRecord = (problemRecord) => {
    try {
      problemRecordApi
        .deleteProblemRecord(
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
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Deleted",
              content: "Problem Record has been deleted",
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

  const handleConfirmDelete = () => {
    handleDeleteProblemRecord(selectedProblemRecordToDelete);
    handleCloseDeleteProblemRecordDialog();
  };

  return (
    <>
      <Dialog
        open={openDeleteProblemRecordDialog}
        onClose={handleCloseDeleteProblemRecordDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this problem record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={handleCloseDeleteProblemRecordDialog}
            color="primary"
          >
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="primary">
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteProblemRecordDialog;

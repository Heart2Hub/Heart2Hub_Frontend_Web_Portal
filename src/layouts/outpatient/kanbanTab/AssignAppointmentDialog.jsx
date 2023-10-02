import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

function AssignAppointmentDialog({ open, onClose, onConfirm }) {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          {/* You can add any input elements or descriptions here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssignAppointmentDialog;

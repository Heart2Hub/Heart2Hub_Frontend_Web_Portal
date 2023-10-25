import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";

function AdmissionDialog({
  step,
  open,
  onClose,
  onConfirm,
  onNext,
  listOfWorkingStaff,
  selectedAppointmentToAssign,
  assigningToSwimlane,
}) {
  const [selectedStaff, setSelectedStaff] = useState(
    selectedAppointmentToAssign !== null &&
      selectedAppointmentToAssign.currentAssignedStaffId !== null
      ? selectedAppointmentToAssign.currentAssignedStaffId
      : 0
  );
  const [listOfApplicableWorkingStaff, setListOfApplicableWorkingStaff] =
    useState([]);

  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");

  const handleChange = (event) => {
    setSelectedStaff(event.target.value);
  };

  const findStaffInListByStaffId = (staffId) => {
    const foundStaff = listOfWorkingStaff.filter(
      (staff) => staff.staffId === staffId
    );
    if (foundStaff.length > 0) {
      const staff = foundStaff[0];
      return (
        staff.firstname +
        " " +
        staff.lastname +
        " (" +
        staff.staffRoleEnum +
        ")"
      );
    } else {
      return "ERROR";
    }
  };

  const handleFilterListOfApplicableWorkingStaff = (swimlaneName) => {
    if (swimlaneName === "Registration") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "ADMIN")
      );
    } else if (swimlaneName === "Triage") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "NURSE")
      );
    } else if (swimlaneName === "Consultation") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "DOCTOR")
      );
    } else if (swimlaneName === "Admission") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "ADMIN")
      );
    } else if (swimlaneName === "Discharge") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "ADMIN")
      );
    } else {
      // console.log("No Filter result of applicable working staff");
    }
  };

  useEffect(() => {
    handleFilterListOfApplicableWorkingStaff(assigningToSwimlane);
  }, [assigningToSwimlane, selectedAppointmentToAssign, selectedStaff]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {step === 1 ? "Create New Admission:" : "Staff Assignment to Ticket:"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {step === 1
              ? "Please fill in the duration and reason for admission."
              : "Please choose from the list of available staff members to assign this appointment ticket."}
          </DialogContentText>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            {step === 1 ? (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="duration"
                  label="Duration (days)"
                  fullWidth
                  variant="standard"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
                <TextField
                  margin="dense"
                  id="reason"
                  label="Reason for admission"
                  fullWidth
                  variant="standard"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </>
            ) : (
              <>
                <InputLabel id="demo-simple-select-label">Staff</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedStaff}
                  label="Select Staff"
                  onChange={handleChange}
                  sx={{ height: "50px" }}
                >
                  <MenuItem value={0}>Not assigned</MenuItem>
                  {listOfApplicableWorkingStaff.length !== 0 &&
                    listOfApplicableWorkingStaff.map((staff) => (
                      <MenuItem key={staff.staffId} value={staff.staffId}>
                        {findStaffInListByStaffId(staff.staffId)}
                      </MenuItem>
                    ))}
                </Select>
              </>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          {step === 1 ? (
            <Button onClick={onNext} color="primary">
              Next
            </Button>
          ) : (
            <Button
              onClick={() => onConfirm(selectedStaff, duration, reason)}
              color="primary"
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdmissionDialog;

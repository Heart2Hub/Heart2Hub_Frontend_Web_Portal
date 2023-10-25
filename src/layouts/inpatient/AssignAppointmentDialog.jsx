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
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";

function AssignAppointmentDialog({
  open,
  onClose,
  onConfirm,
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
        <DialogTitle>Staff Assignment to Ticket:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please choose from the list of available staff members to assign
            this appointment ticket.
          </DialogContentText>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
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
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => onConfirm(selectedStaff)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssignAppointmentDialog;

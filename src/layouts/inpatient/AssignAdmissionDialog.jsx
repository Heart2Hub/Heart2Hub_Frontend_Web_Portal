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

function AssignAdmissionDialog({
  open,
  onClose,
  onConfirm,
  listOfWorkingStaff,
  selectedAppointmentToAssign,
  roleToAssign,
}) {
  const [selectedNurse, setSelectedNurse] = useState(
    selectedAppointmentToAssign.assignedNurseId
      ? selectedAppointmentToAssign.assignedNurseId
      : 0
  );

  const [selectedAdmin, setSelectedAdmin] = useState(
    selectedAppointmentToAssign.assignedAdminId
      ? selectedAppointmentToAssign.assignedAdminId
      : 0
  );

  const handleChange = (event) => {
    if (roleToAssign === "NURSE") {
      setSelectedNurse(event.target.value);
    } else {
      setSelectedAdmin(event.target.value);
    }
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
              value={roleToAssign === "NURSE" ? selectedNurse : selectedAdmin}
              label="Select Staff"
              onChange={handleChange}
              sx={{ height: "50px" }}
            >
              <MenuItem value={0}>Not assigned</MenuItem>

              {listOfWorkingStaff
                .filter((staff) => staff.staffRoleEnum === roleToAssign)
                .map((staff) => (
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
          <Button
            onClick={() =>
              onConfirm(
                roleToAssign === "NURSE" ? selectedNurse : selectedAdmin,
                roleToAssign
              )
            }
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssignAdmissionDialog;

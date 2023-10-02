import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";

function AssignAppointmentDialog({
  open,
  onClose,
  onConfirm,
  listOfWorkingStaff,
  selectedAppointmentToAssign,
}) {
  const [selectedStaff, setSelectedStaff] = useState(
    selectedAppointmentToAssign !== null &&
      selectedAppointmentToAssign.currentAssignedStaffId !== null
      ? selectedAppointmentToAssign.currentAssignedStaffId
      : null
  );

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

  console.log(selectedAppointmentToAssign);
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          Select a Staff to assign this appointment ticket:
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Staff</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedStaff}
              label="Staff"
              onChange={handleChange}
              sx={{ height: "40px" }}
            >
              {listOfWorkingStaff.length !== 0 &&
                listOfWorkingStaff.map((staff) => (
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

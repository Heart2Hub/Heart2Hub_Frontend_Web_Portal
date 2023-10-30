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
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { staffApi } from "api/Api";

function AssignAdmissionDialog({
  open,
  onClose,
  onConfirm,
  listOfWorkingStaff,
  selectedAppointmentToAssign,
  listOfAssignedStaff,
  roleToAssign,
}) {
  const loggedInStaff = useSelector(selectStaff);

  //const [selectedRole, setSelectedRole] = useState("")
  //const [selectRoleOptions, setSelectRoleOptions] = useState([])

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

  const [selectedStaff, setSelectedStaff] = useState(0);

  useEffect(() => {
    const assignedStaffByRole = listOfAssignedStaff.filter(
      (staff) => staff.staffRoleEnum === loggedInStaff.staffRoleEnum
    )[0];
    if (assignedStaffByRole) {
      setSelectedStaff(assignedStaffByRole.staffId);
    }
  }, [listOfAssignedStaff]);

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

              {listOfWorkingStaff
                .filter(
                  (staff) => staff.staffRoleEnum === loggedInStaff.staffRoleEnum
                )
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
          <Button onClick={() => onConfirm(selectedStaff)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssignAdmissionDialog;

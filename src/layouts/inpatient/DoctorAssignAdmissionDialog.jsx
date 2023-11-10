import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { staffApi } from "api/Api";

function DoctorAssignAdmissionDialog({
  open,
  onClose,
  onConfirm,
  listOfWorkingStaff,
  listOfAssignedStaff,
}) {
  //console.log(step);
  const loggedInStaff = useSelector(selectStaff);

  const [step, setStep] = useState("1");
  const [selectedStaff, setSelectedStaff] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState("2");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStaffRole, setSelectedStaffRole] = useState("");
  const [listOfStaffToAssign, setListOfStaffToAssign] = useState([]);

  //   useEffect(() => {
  //     const assignedStaffByRole = listOfAssignedStaff.filter(
  //       (staff) => staff.staffRoleEnum === loggedInStaff.staffRoleEnum
  //     )[0];
  //     if (assignedStaffByRole) {
  //       setSelectedStaff(assignedStaffByRole.staffId);
  //     }
  //   }, [listOfAssignedStaff]);

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

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const handleNext = () => {
    setStep(selectedRadio);
    if (selectedRadio === "2") {
      setSelectedStaffRole("DOCTOR");
    }
  };

  const handleSelectDepartment = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleSelectStaffRole = (event) => {
    setSelectedStaffRole(event.target.value);
  };

  const getListOfStaffToAssign = async () => {
    const response = await staffApi.getStaffListByRole(
      selectedStaffRole,
      selectedDepartment
    );
    //console.log(response.data);
    setListOfStaffToAssign(response.data);
  };

  useEffect(() => {
    if (!open) {
      setStep("1");
      setSelectedStaff(0);
      setSelectedRadio("2");
      setSelectedDepartment("");
      setSelectedStaffRole("");
      setListOfStaffToAssign([]);
    }
  }, [open]);

  useEffect(() => {
    if (selectedDepartment !== "" && selectedStaffRole !== "") {
      console.log(listOfAssignedStaff);
      getListOfStaffToAssign();

      const filteredListOfAssignedStaff = listOfAssignedStaff.filter(
        (staff) =>
          staff.unit.name === selectedDepartment &&
          staff.staffRoleEnum === selectedStaffRole
      );

      if (filteredListOfAssignedStaff.length > 0) {
        setSelectedStaff(filteredListOfAssignedStaff[0].staffId);
      }
    }
  }, [selectedDepartment, selectedStaffRole]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {step === "1"
            ? "Assignment Options :"
            : step === "2"
            ? "Doctor Reassignment to Ticket"
            : "Treatment Assignment to Ticket"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please choose from the list of available staff members to assign
            this appointment ticket.
          </DialogContentText>

          {step === "1" && (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={selectedRadio}
                name="radio-buttons-group"
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Reassign admission to another doctor"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="Assign treatment to admission"
                />
              </RadioGroup>
            </FormControl>
          )}

          {step !== "1" && (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="departmentName">Department</InputLabel>
              <Select
                labelId="departmentName"
                id="departmentName"
                label="Department"
                name="departmentName"
                sx={{ lineHeight: "3em" }}
                onChange={handleSelectDepartment}
              >
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Emergency Medicine">
                  Emergency Medicine
                </MenuItem>
                <MenuItem value="Surgery">Surgery</MenuItem>
                <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                <MenuItem value="Radiology">Radiology</MenuItem>
              </Select>
            </FormControl>
          )}

          {selectedDepartment !== "" && step === "2" && (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Doctor</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Staff"
                value={selectedStaff}
                sx={{ lineHeight: "3em" }}
                onChange={handleChange}
              >
                <MenuItem value={0}>Not assigned</MenuItem>
                {listOfStaffToAssign.map((staff) => (
                  <MenuItem key={staff.staffId} value={staff.staffId}>
                    {`${staff.firstname} ${staff.lastname} (${staff.staffRoleEnum})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedDepartment !== "" && step === "3" && (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Treatment</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Treatment Type"
                sx={{ lineHeight: "3em" }}
                onChange={handleSelectStaffRole}
              >
                <MenuItem value="DIAGNOSTIC_RADIOGRAPHERS">
                  X-Ray Imaging
                </MenuItem>
                <MenuItem value="DIETITIANS">Nutritional Counseling</MenuItem>
                <MenuItem value="OCCUPATIONAL_THERAPISTS">
                  Occupational Therapy
                </MenuItem>
              </Select>
            </FormControl>
          )}

          {selectedStaffRole !== "" && step === "3" && (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Staff</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Staff"
                value={selectedStaff}
                sx={{ lineHeight: "3em" }}
                onChange={handleChange}
              >
                <MenuItem value={0}>Not assigned</MenuItem>
                {listOfStaffToAssign.map((staff) => (
                  <MenuItem key={staff.staffId} value={staff.staffId}>
                    {`${staff.firstname} ${staff.lastname} (${staff.staffRoleEnum})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>

          {step === "1" ? (
            <Button onClick={handleNext} color="primary">
              Next
            </Button>
          ) : (
            <Button
              onClick={() => onConfirm(selectedStaff, step)}
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

export default DoctorAssignAdmissionDialog;

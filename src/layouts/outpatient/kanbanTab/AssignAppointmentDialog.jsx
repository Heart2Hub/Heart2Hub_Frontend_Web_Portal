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
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { staffApi } from "api/Api";

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
  const [selectedTreatmentType, setSelectedTreatmentType] = useState("");
  const selectedTreatmentTypeRef = useRef("");
  const [listOfApplicableWorkingStaff, setListOfApplicableWorkingStaff] =
    useState([]);

  const handleChange = (event) => {
    setSelectedStaff(event.target.value);
  };

  const handleTreatmentTypeChange = (event) => {
    setSelectedTreatmentType(event.target.value);
    selectedTreatmentTypeRef.current = event.target.value;
    setSelectedStaff(0);
    console.log(selectedTreatmentType);
    console.log(selectedTreatmentTypeRef);
    handleFilterListOfApplicableWorkingStaff("Treatment");
  };

  const handleResetState = () => {
    setSelectedStaff(0);
    setSelectedTreatmentType("");
    setListOfApplicableWorkingStaff([]);
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
    } else if (swimlaneName === "Treatment") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter(
          (staff) => staff.staffRoleEnum === selectedTreatmentTypeRef.current
        )
      );
    } else if (swimlaneName === "Discharge") {
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "ADMIN")
      );
    } else if (swimlaneName === "Pharmacy") {
      setListOfApplicableWorkingStaff(listOfWorkingStaff);
    } else {
      // console.log("No Filter result of applicable working staff");
    }
  };

  const getPharmacyStaff = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      "Pharmacy"
    );
    listOfWorkingStaff = response.data;
  };

  const staffRoleEnumMapping = {
    DIAGNOSTIC_RADIOGRAPHERS: "X-Ray Imaging",
    DIETITIANS: "Nutritional Counseling",
    OCCUPATIONAL_THERAPISTS: "Occupational Therapy",
    MEDICAL_LABORATORY_TECHNOLOGISTS: "Laboratory Testing",
    PHYSIOTHERAPISTS: "Physical Therapy",
    PODIATRISTS: "Podiatric Care",
    PSYCHOLOGISTS: "Psychotherapy",
    PROSTHETISTS: "Prosthetic Fitting",
    ORTHOTISTS: "Orthotic Fitting",
    RADIATION_THERAPISTS: "Radiation Therapy",
    RESPIRATORY_THERAPISTS: "Respiratory Therapy",
    SPEECH_THERAPISTS: "Speech Therapy",
    AUDIOLOGISTS: "Audiology Services",
    MEDICAL_SOCIAL_WORKERS: "Medical Social Work",
    ORTHOPTISTS: "Orthoptics",
  };

  useEffect(() => {
    if (assigningToSwimlane === "Pharmacy") {
      getPharmacyStaff();
    }
    handleFilterListOfApplicableWorkingStaff(assigningToSwimlane);
  }, [assigningToSwimlane, selectedAppointmentToAssign, selectedStaff]);

  console.log(listOfApplicableWorkingStaff)

  return (
    <>
      {assigningToSwimlane === "Treatment" ? (
        <Dialog
          open={open}
          onClose={() => {
            onClose();
            handleResetState();
          }}
        >
          <DialogTitle>Treatment Assignment to Ticket:</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please choose a treatment type before selecting a staff member.
            </DialogContentText>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Treatment</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedTreatmentType}
                label="Select Treatment Type"
                onChange={handleTreatmentTypeChange}
                sx={{ height: "50px" }}
              >
                {listOfApplicableWorkingStaff.length !== 0 &&
                  listOfApplicableWorkingStaff.map((staff) =>
                    staff.staffRoleEnum === "doctor" ||
                    staff.staffRoleEnum === "nurse" ||
                    staff.staffRoleEnum === "admin" ? null : (
                      <MenuItem
                        key={staff.staffRoleEnum}
                        value={staff.staffRoleEnum}
                      >
                        {staffRoleEnumMapping[staff.staffRoleEnum]}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
            {selectedTreatmentType !== "" ? (
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
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            {selectedTreatmentType !== "" ? (
              <Button onClick={() => onConfirm(selectedStaff)} color="primary">
                Confirm
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>
      ) : (
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
      )}
    </>
  );
}

export default AssignAppointmentDialog;

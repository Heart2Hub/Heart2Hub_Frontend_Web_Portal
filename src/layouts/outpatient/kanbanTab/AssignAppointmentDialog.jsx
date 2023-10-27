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
      setListOfApplicableWorkingStaff(
        listOfWorkingStaff.filter((staff) => staff.staffRoleEnum === "PHARMACIST")
      );
    } else {
      // console.log("No Filter result of applicable working staff");
    }
  };

  const getPharmacyStaff = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      "Pharmacy"
    );
  };

  useEffect(() => {
    if (assigningToSwimlane === "Pharmacy") {
      getPharmacyStaff();
    }
    handleFilterListOfApplicableWorkingStaff(assigningToSwimlane);
  }, [assigningToSwimlane, selectedAppointmentToAssign, selectedStaff]);

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
                <MenuItem value="DIAGNOSTIC_RADIOGRAPHERS">
                  X-Ray Imaging
                </MenuItem>
                <MenuItem value="DIETITIANS">Nutritional Counseling</MenuItem>
                <MenuItem value="OCCUPATIONAL_THERAPISTS">
                  Occupational Therapy
                </MenuItem>
                <MenuItem value="MEDICAL_LABORATORY_TECHNOLOGISTS">
                  Laboratory Testing
                </MenuItem>
                <MenuItem value="PHYSIOTHERAPISTS">Physical Therapy</MenuItem>
                <MenuItem value="PODIATRISTS">Podiatric Care</MenuItem>
                <MenuItem value="PSYCHOLOGISTS">Psychotherapy</MenuItem>
                <MenuItem value="PROSTHETISTS">Prosthetic Fitting</MenuItem>
                <MenuItem value="ORTHOTISTS">Orthotic Fitting</MenuItem>
                <MenuItem value="RADIATION_THERAPISTS">
                  Radiation Therapy
                </MenuItem>
                <MenuItem value="RESPIRATORY_THERAPISTS">
                  Respiratory Therapy
                </MenuItem>
                <MenuItem value="SPEECH_THERAPISTS">Speech Therapy</MenuItem>
                <MenuItem value="AUDIOLOGISTS">Audiology Services</MenuItem>
                <MenuItem value="MEDICAL_SOCIAL_WORKERS">
                  Medical Social Work
                </MenuItem>
                <MenuItem value="ORTHOPTISTS">Orthoptics</MenuItem>
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

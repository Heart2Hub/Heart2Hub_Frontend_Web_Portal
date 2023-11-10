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

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { parseDateFromLocalDateTime } from "utility/Utility";

function ExtendAdmissionDialog({
  open,
  onClose,
  onConfirm,
  originalDischargeDate,
}) {
  //console.log(step);
  const originalDischargeDateValue = dayjs(originalDischargeDate.slice(0, 3));
  const [selectedDate, setSelectedDate] = useState(originalDischargeDateValue);

  const loggedInStaff = useSelector(selectStaff);

  const [step, setStep] = useState("1");
  const [selectedStaff, setSelectedStaff] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState("2");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStaffRole, setSelectedStaffRole] = useState("");
  const [listOfStaffToAssign, setListOfStaffToAssign] = useState([]);

  const handleChange = (event) => {
    setSelectedStaff(event.target.value);
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

  //   useEffect(() => {
  //     if (!open) {
  //       setStep("1");
  //       setSelectedStaff(0);
  //       setSelectedRadio("2");
  //       setSelectedDepartment("");
  //       setSelectedStaffRole("");
  //       setListOfStaffToAssign([]);
  //     }
  //   }, [open]);

  //   useEffect(() => {
  //     const selectedDateString = dayjs(selectedDate).format(
  //       "YYYY-MM-DDT12:00:00"
  //     );
  //     console.log(selectedDateString);
  //   }, [selectedDate]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Change Discharge Date</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a new discharge date for this admission ticket
          </DialogContentText>

          <FormControl fullWidth margin="dense">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Select Appointment Date"
                  format="DD/MM/YYYY"
                  value={selectedDate}
                  minDate={dayjs().add(1, "day")}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>

          <Button onClick={() => onConfirm(selectedDate)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExtendAdmissionDialog;

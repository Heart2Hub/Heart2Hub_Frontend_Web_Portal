import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Box,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useForm, Controller, reset } from "react-hook-form";
import { selectStaff } from "../../store/slices/staffSlice";
import { useDispatch, useSelector } from "react-redux";
import { patientApi, appointmentApi } from "api/Api";
import { displayMessage } from "../../store/slices/snackbarSlice";
import { prescriptionRecordApi } from "api/Api";
import { ehrApi } from "api/Api";
import { setEHRRecord } from "store/slices/ehrSlice";
import DataTable from "examples/Tables/DataTable";
import dayjs from 'dayjs';

function CreateNewTicket({ isOpen, onClose, onAppointmentCreated }) {
  const reduxDispatch = useDispatch();

  const staff = useSelector(selectStaff);
  const [nric, setNric] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [isNricValid, setIsNricValid] = useState(false);
  const [prescriptionRecords, setPrescriptionRecords] = useState([]);
  const [ehr, setEhr] = useState();
  //const singaporeTimeOptions = { timeZone: 'Asia/Singapore' };

  const currentD = new Date();

  currentD.setHours((currentD.getHours() + 1) % 24);
  // currentD.setMinutes(0);
  // currentD.setSeconds(0);

  const year = currentD.getFullYear();
  let day = String(currentD.getDate()).padStart(2, "0");
  const month = String(currentD.getMonth() + 1).padStart(2, "0"); // Adding 1 to month as it's zero-based
  const hours = String(currentD.getHours()).padStart(2, "0");
  const minutes = String(currentD.getMinutes()).padStart(2, "0");
  const seconds = String(currentD.getSeconds()).padStart(2, "0");
  const milliseconds = String(currentD.getMilliseconds()).padStart(3, "0");

  let currentDate = `${year}-${month}-${day}T${String(
    currentD.getHours() - 1
  ).padStart(2, "0")}:${minutes}:${seconds}.${milliseconds}`;

  if (currentD.getHours() === 0) {
    day = String(currentD.getDate() + 1).padStart(2, "0");
    currentDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "65%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "15px",
  };

  const { handleSubmit, control, reset } = useForm();

  // Define your appointment creation form here
  const onSubmit = (data) => {
    const n = new Date();

    // Ensure that the selected time is not earlier than the current time
    const et = time.split(":");
    const appointmentDate = new Date(year, month - 1, day, et[0], et[1]);

    if (appointmentDate < n) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Invalid Appointment Time",
          content: "Appointment time cannot be earlier than the current time.",
        })
      );
      return; // Don't proceed with appointment creation
    }

    const now = new Date();
    const defaultDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )
      .toISOString()
      .slice(0, 10);

    const enteredTime = time; // Entered time from the form
    const actualDateTime = dayjs().format("YYYY-MM-DDTHH:mm:ss")

    const appointmentData = {
      description: description,
      // actualDateTime: actualDateTime, // Set to current date time
      // bookedDateTime: currentDate, // Use the state valuee
      bookedDateTime: actualDateTime, // Use the state valuee
      priority: 'LOW',
      patientUsername: nric,
      departmentName: staff.unit.name,
    };
    appointmentApi
      .createNewPharmacyTicket(
        appointmentData.description,
        // appointmentData.actualDateTime,
        appointmentData.bookedDateTime,
        appointmentData.priority,
        appointmentData.patientUsername,
        appointmentData.departmentName
      )
      .then((response) => {
        console.log("Appointment created:", response.data);

        //setTime("");
        setDescription("");
        onAppointmentCreated();
        setNric("");
        setIsNricValid(false);
        setEhr(null);
        reset();
        onClose();
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Successfully Created Pharmacy Ticket!",
          })
        );
      })
      .catch((error) => {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: error.response.data,
          })
        );
        console.error("Error fetching data:", error);
      });
  };

  const handleCancel = () => {
    reset();
    setNric("");
    setIsNricValid(false);
    setEhr(null)
    onClose();
  };

  const handleSearchNric = async (nric) => {
    try {
      const response = await prescriptionRecordApi.getPrescriptionRecordByNric(nric);
      if (response.status === 200) {
        const ehr = await ehrApi.getElectronicHealthRecordByNric(nric);
        if (response.data.length > 0) {
          setPrescriptionRecords(response.data);
          setIsNricValid(true);
          setEhr(ehr.data);
          const mappedRows = response.data.map((record) => ({
            prescriptionRecordId: record.prescriptionRecordId,
            medicationName: record.medicationName,
            medicationQuantity: record.medicationQuantity,
            dosage: record.dosage,
            prescribedBy: record.prescribedBy,
            lastCollectDate: record.lastCollectDate,
            prescriptionStatusEnum: record.prescriptionStatusEnum
        }));

        // Update the 'data' state with the mapped data
        setData((prevData) => ({
            ...prevData,
            rows: mappedRows,
        }));
        } else {
          reduxDispatch(
            displayMessage({
              color: "warning",
              icon: "warning",
              title: "Error Encountered",
              content: "Patient does not have any prescription records!",
            })
          );
        }
      }
    } catch (error) {
      console.log(error)
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: `Patient is not registered in H2H database!`,
        })
      );
    }
  }

  const [data, setData] = useState({
    columns: [
      {
        Header: "Prescription Record ID",
        accessor: "prescriptionRecordId",
        width: "10%",
      },
      {
        Header: "Medication Name",
        accessor: "medicationName",
        width: "15%",
      },
      { 
        Header: "Medication Quantity", 
        accessor: "medicationQuantity", 
        width: "10%" 
      },
      { 
        Header: "Dosage", 
        accessor: "dosage", 
        width: "10%" 
      },
      { 
        Header: "Prescribed By", 
        accessor: "prescribedBy", 
        width: "15%" 
      },
      { 
        Header: "Last Collect Date", 
        accessor: "lastCollectDate", 
        width: "15%" 
      },
      { 
        Header: "Prescription Status", 
        accessor: "prescriptionStatusEnum", 
        width: "15%" 
      }
    ],
    rows: [],
  });

  return (
    <Modal open={isOpen} onClose={handleCancel}>
      <Box sx={style}>
        <h3>Create Pharmacy Ticket</h3>
        <h4>
          Date: {day}/{month}/{year}
        </h4>
        {/* <h3>Time: {time}</h3> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize:"15px", borderColor: "gainsboro", borderRadius: "6px", }}
              placeholder="Search NRIC"
              inputProps={{ 'aria-label': 'search nric' }}
              value={nric}
              onChange={(e) => setNric(e.target.value)}
            />
            <IconButton 
              type="button" 
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={() => handleSearchNric(nric)}>
              <SearchIcon />
            </IconButton>
          </Paper>
          {/* <TextField
            label="NRIC"
            fullWidth
            margin="normal"
            name="nric"
            value={nric}
            onChange={(e) => setNric(e.target.value)}
          /> */}<br/>
          {isNricValid && ehr &&
          <div>
            <b>Patient:</b> {ehr.firstName} {ehr.lastName}
            {data.length === 0 && "Patient does not have any prescription records."}
            <DataTable table={data} />
          </div>}
          {isNricValid && <TextareaAutosize
            minRows={3}
            label="Description"
            placeholder="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            // Use Controller to register the Description field
            name="description"
            control={control}
            style={{ width: "100%", minHeight: "30px", borderColor: "gainsboro", borderRadius: "6px", fontFamily: 'Arial', padding: "10px", fontSize: "15px" }}
          />}

          <div
            style={{ display: "flex", justifyContent: "space-between" }}
          ></div>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: "8px" }}
            style={{ backgroundColor: "red", color: "white" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginLeft: "8px" }}
            type="submit"
            disabled={!isNricValid}
            style={{ backgroundColor: "green", color: "white" }}
          >
            Create
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default CreateNewTicket;

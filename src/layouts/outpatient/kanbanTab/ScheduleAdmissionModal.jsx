import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Box,
  List,
  ListItem,
  Chip,
  Skeleton,
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import {
  calculateAge,
  parseDateFromLocalDateTime,
  formatDateToYYYYMMDDHHMM,
} from "utility/Utility";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import {
  staffApi,
  inventoryApi,
  transactionItemApi,
  imageServerApi,
} from "api/Api";

import { ehrApi } from "api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEHRRecord } from "../../../store/slices/ehrSlice";
import ArrivalButton from "./ArrivalButton";
import { displayMessage } from "store/slices/snackbarSlice";
import { admissionApi, appointmentApi, wardApi } from "../../../api/Api";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDBox from "components/MDBox";
import AddAttachmentButton from "./AddAttachmentButton";
import ViewAttachmentsButton from "./ViewAttachmentsButton";
import AdmissionDialog from "./AdmissionDialog";
import {
  Calendar,
  Views,
  momentLocalizer,
  luxonLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import { DateTime } from "luxon";
import "react-big-calendar/lib/css/react-big-calendar.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

function ScheduleAdmissionModal({
  openModal,
  handleCloseModal,
  selectedAppointment,
  replaceItemByIdWithUpdated,
  columnName,
  listOfWorkingStaff,
  forceRefresh,
}) {
  const loggedInStaff = useSelector(selectStaff);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [assignedStaff, setAssignedStaff] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [editableComments, setEditableComments] = useState("");
  const [commentsTouched, setCommentsTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  //For Cart
  const [medications, setMedications] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedMedicationQuantity, setSelectedMedicationQuantity] =
    useState(1);
  const [selectedService, setSelectedService] = useState(null);

  //For Managing the Cart
  const [cartItems, setCartItems] = useState([]);

  //for assigning appointment to staff in the AppointmentTicketModal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [assigningToSwimlane, setAssigningToSwimlane] = useState("");

  //for fetching image
  const [profileImage, setProfileImage] = useState(null);

  //for scheduling admission
  const [wardClass, setWardClass] = useState("A");
  const [wards, setWards] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [admissionDateTime, setAdmissionDateTime] = useState("");
  const [dischargeDateTime, setDischargeDateTime] = useState("");
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [scheduled, setScheduled] = useState(false);

  //for setting calendar to start today
  moment.locale("ko", {
    week: {
      dow: new Date().getDay(),
    },
  });
  const localizer = momentLocalizer(moment);

  const handleGetProfileImage = async () => {
    if (selectedAppointment.patientProfilePicture !== null) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        selectedAppointment.patientProfilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      setProfileImage(imageURL);
    }
  };

  const handleCommentsTouched = () => {
    setCommentsTouched(true);
  };

  // Fetch lists of all medications and service items from the API
  const fetchMedicationsAndServices = async () => {
    try {
      const medicationsResponse = await inventoryApi.getAllMedication("");
      setMedications(medicationsResponse.data);
      // console.log(medicationsResponse.data)

      const servicesResponse = await inventoryApi.getAllServiceItem("");
      setServices(servicesResponse.data);
      // console.log(servicesResponse.data)
      // console.log(selectedAppointment)
    } catch (error) {
      console.error("Error fetching medications and services:", error);
    }
  };

  const fetchPatientCart = async () => {
    try {
      const response = await transactionItemApi.getCartItems(
        selectedAppointment.patientId
      );

      setCartItems(response.data);
      console.log(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleDeleteCartItem = async (cartItemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await transactionItemApi.removeFromCart(
          selectedAppointment.patientId,
          cartItemId
        );
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Success",
            content: "Item has been deleted from the cart!",
          })
        );
        fetchPatientCart();
      } catch (error) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error",
            content: error.response.data,
          })
        );
      }
    } else {
      // If the user cancels the deletion
      reduxDispatch(
        displayMessage({
          color: "info",
          icon: "notification",
          title: "Info",
          content: "Deletion has been canceled.",
        })
      );
    }
  };

  const handleAddMedicationToPatient = async (medication) => {
    try {
      if (selectedMedicationQuantity <= 0) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Invalid Quantity",
            content: "Please select a valid quantity for the medication.",
          })
        );
        return;
      }
      const patientId = selectedAppointment.patientId; // Replace with the actual patient ID
      const requestBody = {
        transactionItemName: medication.inventoryItemName,
        transactionItemDescription: medication.inventoryItemDescription,
        transactionItemQuantity: selectedMedicationQuantity,
        transactionItemPrice: medication.retailPricePerQuantity, // Replace with the actual price
        inventoryItem: medication.inventoryItemId,
      };

      console.log(requestBody);

      transactionItemApi
        .addToCart(patientId, requestBody)
        .then((response) => {
          const item = response.data;
          console.log(item);
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Added Medication!",
            })
          );
          //setMedications([]);
          setSelectedMedicationQuantity(1);
          fetchPatientCart();
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
    } catch (error) {
      console.error("Error fetching medications and services:", error);
    }
  };

  const handleAddServiceToPatient = (service) => {
    try {
      const patientId = selectedAppointment.patientId; // Replace with the actual patient ID
      const requestBody = {
        transactionItemName: service.inventoryItemName,
        transactionItemDescription: service.inventoryItemDescription,
        transactionItemQuantity: 1,
        transactionItemPrice: service.retailPricePerQuantity, // Replace with the actual price
        inventoryItem: service.inventoryItemId,
      };

      console.log(requestBody);

      transactionItemApi
        .addToCart(patientId, requestBody)
        .then((response) => {
          const item = response.data;
          console.log(item);
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Added Service!",
            })
          );
          //setServices([]);
          fetchPatientCart();
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
    } catch (error) {
      console.error("Error fetching medications and services:", error);
    }
  };

  const renderMedicationsDropdown = () => {
    return (
      <Box style={{ width: "100%" }}>
        <InputLabel id="medication-label"> Select Medication</InputLabel>
        <Select
          onChange={(e) => setSelectedMedication(e.target.value)}
          style={{ width: "50%" }}
          sx={{ lineHeight: "3em" }}
        >
          {medications.map((medication) => (
            <MenuItem key={medication.inventoryItemId} value={medication}>
              {medication.inventoryItemName}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Quantity"
          type="number"
          value={selectedMedicationQuantity}
          onChange={(e) => setSelectedMedicationQuantity(e.target.value)}
          style={{ width: "10%", marginLeft: 20 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <MDButton
            onClick={() => handleAddMedicationToPatient(selectedMedication)}
            variant="gradient"
            color="primary"
          >
            Add Medication
          </MDButton>
        </Box>
      </Box>
    );
  };

  const renderServicesDropdown = () => {
    return (
      <Box style={{ width: "100%" }}>
        <InputLabel id="medication-label"> Select Services</InputLabel>

        <Select
          onChange={(e) => setSelectedService(e.target.value)}
          style={{ width: "50%" }}
          sx={{ lineHeight: "3em" }}
        >
          {services.map((service) => (
            <MenuItem key={service.inventoryItemId} value={service}>
              {service.inventoryItemName}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <MDButton
            onClick={() => handleAddServiceToPatient(selectedService)}
            variant="gradient"
            color="primary"
          >
            Add Service
          </MDButton>
        </Box>
      </Box>
    );
  };

  const handleCommentsChange = (event) => {
    setEditableComments(event.target.value);
    if (!commentsTouched) {
      handleCommentsTouched();
    }
  };

  //get the facility location
  const getFacilityLocationByStaffIdThroughShift = (staffId) => {
    let facility = listOfWorkingStaff.filter(
      (staff) => staff.staffId === staffId
    )[0];

    if (facility) {
      return facility.name + " (" + facility.location + ")";
    } else {
      return null;
    }
  };

  const getAssignedStaffName = async (staffId) => {
    const response = await staffApi.getStaffByStaffId(staffId);
    setAssignedStaff(response.data);
  };

  const handleUpdateAppointmentArrival = async () => {
    setLoading(true);

    try {
      const response = await appointmentApi.updateAppointmentArrival(
        selectedAppointment.appointmentId,
        !selectedAppointment.arrived,
        loggedInStaff.staffId
      );
      let updatedAppointment = response.data;

      //update the old appt
      replaceItemByIdWithUpdated(
        updatedAppointment.appointmentId,
        columnName,
        updatedAppointment
      );

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Update Success",
          content: "Patient's Arrival Status is updated",
        })
      );
    } catch (error) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Update Failed!",
          content: error.response.data,
        })
      );
    }
    setLoading(false);
  };

  const handleUpdateComments = async () => {
    setLoading(true);

    try {
      const response = await appointmentApi.updateAppointmentComments(
        selectedAppointment.appointmentId,
        editableComments,
        loggedInStaff.staffId
      );
      let updatedAppointment = response.data;

      //update the old appt
      replaceItemByIdWithUpdated(
        updatedAppointment.appointmentId,
        columnName,
        updatedAppointment
      );

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Update Success",
          content: "Comments are updated",
        })
      );
    } catch (error) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Update Failed!",
          content: error.response.data,
        })
      );
    }
    setEditableComments("");
    setCommentsTouched(false);
    setLoading(false);
  };

  const handleOpenAssignDialog = () => {
    setIsDialogOpen(true);
  };

  //has its own set of logic for assignAppointmentDialog to not clash with the drag and drop version
  const handleConfirmAssignDialog = async (selectedStaffId) => {
    if (selectedStaffId === 0) {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Please select a staff to assign!",
        })
      );
      return;
    }

    try {
      //send to BE to assign staff
      console.log(selectedAppointment);
      const response = await appointmentApi.assignAppointmentToStaff(
        selectedAppointment.appointmentId,
        selectedStaffId,
        loggedInStaff.staffId
      );

      const updatedAssignment = response.data;

      //force a rerender instead
      forceRefresh();

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: "Appointment has been updated successfully!!",
        })
      );

      handleCloseModal();
    } catch (error) {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: error.response.data,
        })
      );
    }
    // }

    setIsDialogOpen(false);
  };

  const handleCloseAssignDialog = () => {
    reduxDispatch(
      displayMessage({
        color: "info",
        icon: "notification",
        title: "Info",
        content: "No action was taken",
      })
    );
    setIsDialogOpen(false);
  };

  const handleClickToEhr = () => {
    // Can refactor to util
    console.log(selectedAppointment);
    const dateComponents = selectedAppointment.dateOfBirth;
    const [year, month, day, hours, minutes] = dateComponents;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateOfBirthFormatted = `${year}-${formattedMonth}-${formattedDay}T${String(
      hours
    ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    ehrApi
      .getElectronicHealthRecordByIdAndDateOfBirth(
        selectedAppointment.electronicHealthRecordId,
        dateOfBirthFormatted
      )
      .then((response) => {
        console.log(response);
        // ROUTE HERE
        response.data = {
          ...response.data,
          username: selectedAppointment.username,
          profilePicture: selectedAppointment.patientProfilePicture,
        };
        reduxDispatch(setEHRRecord(response));
        navigate("/ehr/ehrRecord");
      });
  };

  useEffect(() => {
    if (openModal) {
      console.log(selectedAppointment);
      getAssignedStaffName(selectedAppointment.currentAssignedStaffId);
      setFacilityLocation(
        getFacilityLocationByStaffIdThroughShift(
          selectedAppointment.currentAssignedStaffId
        )
      );
      handleGetProfileImage();

      // for setting admission textarea fields
      if (selectedAppointment.admissionDate) {
        const admissionMoment = moment(selectedAppointment.admissionDate);
        const dischargeMoment = moment(selectedAppointment.dischargeDate);
        setAdmissionDateTime(admissionMoment.format("YYYY-MM-DD HH:mm:ss"));
        setDischargeDateTime(dischargeMoment.format("YYYY-MM-DD HH:mm:ss"));
        setSelectedWard(selectedAppointment.ward);
        setScheduled(true);
      }
    }

    // fetchMedicationsAndServices();
    // fetchPatientCart();
    // setAssigningToSwimlane(columnName);
  }, [openModal]);

  //FOR SCHEDULING ADMISSION

  const fetchWards = async (wardClass) => {
    try {
      const response = await wardApi.getAllWardsByWardClass(wardClass);
      const wardsData = response.data;
      setWards(wardsData);

      const duration = selectedAppointment.admissionDuration;
      let startTime = 0;
      const wardAvailabilityEvents = [];
      wardsData.forEach((ward) => {
        //console.log(startTime);
        const wardAvailabilities = ward.listOfWardAvailabilities;
        wardAvailabilities.forEach((wa) => {
          const startDate = wa.date.split(" ")[0];
          const startDateArr = startDate.split("-"); // 0: year, 1: month, 2: day
          //const selectable = 8 % wa.wardAvailabilityId >= duration;

          const event = {
            id: wa.wardAvailabilityId,
            wardName: ward.name,
            title: "Beds: " + wa.bedsAvailable,
            start: new Date(
              startDateArr[0],
              startDateArr[1] - 1,
              startDateArr[2],
              startTime,
              0,
              0,
              0
            ),
            end: new Date(
              startDateArr[0],
              startDateArr[1] - 1,
              startDateArr[2],
              startTime + 1,
              0,
              0,
              0
            ),
            actual: new Date(wa.date.replace(" ", "T")),
          };

          wardAvailabilityEvents.push(event);
        });

        //console.log(wardAvailabilityEvents);

        //setCalendarEvents([...calendarEvents, ...wardAvailabilityEvents]);

        startTime++;
      });

      console.log(wardAvailabilityEvents);
      setCalendarEvents(wardAvailabilityEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWards(wardClass);
  }, [wardClass]);

  // Function to handle cell selection

  const handleSelectEvent = (event) => {
    console.log(event);
    const duration = selectedAppointment.admissionDuration;
    const startCol = (event.id - 1) % 7; //0-6
    const endCol = (startCol + duration - 1) % 7;

    if (startCol <= endCol) {
      const eventIds = [];
      let eventId = event.id;
      for (let i = 0; i < duration; i++) {
        const filteredEvent = calendarEvents.filter(
          (calendarEvent) => calendarEvent.id === eventId
        )[0];
        const beds = filteredEvent.title.split(" ")[1];

        if (beds === "0") {
          reduxDispatch(
            displayMessage({
              color: "warning",
              icon: "notification",
              title: "Error",
              content: "There are not enough beds for the entire duration",
            })
          );
          break;
        }

        eventIds.push(eventId);
        eventId = eventId + 1;
      }

      setSelectedWard(event.wardName);
      setSelectedEventIds(eventIds);

      const actualDate = moment(event.actual);
      //console.log(actualDate);

      if (actualDate.subtract(1, "days").isBefore(moment())) {
        setAdmissionDateTime(moment().format("YYYY-MM-DD HH:mm:ss"));
      } else {
        actualDate.hour(13);
        setAdmissionDateTime(actualDate.format("YYYY-MM-DD HH:mm:ss"));
      }
    } else {
      console.log("CANNOT");
      setSelectedEventIds([]);
      setAdmissionDateTime("");
      setDischargeDateTime("");
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Admission duration is too short for this date",
        })
      );
    }
  };

  useEffect(() => {
    if (admissionDateTime) {
      const duration = selectedAppointment.admissionDuration;
      const dischargeMoment = moment(admissionDateTime, "YYYY-MM-DD HH:mm:ss");
      dischargeMoment.add(duration, "days");
      dischargeMoment.hour(12);
      dischargeMoment.minute(0);
      dischargeMoment.second(0);
      setDischargeDateTime(dischargeMoment.format("YYYY-MM-DD HH:mm:ss"));
    }
  }, [admissionDateTime]);

  const handleSelectWardClass = (event) => {
    setWardClass(event.target.value);
  };

  const handleScheduleAdmission = async () => {
    try {
      if (admissionDateTime) {
        const admission = admissionDateTime.replace(" ", "T");
        const discharge = dischargeDateTime.replace(" ", "T");
        const response = await admissionApi.scheduleAdmission(
          selectedAppointment.admissionId,
          selectedEventIds[0],
          admission,
          discharge
        );
        console.log(response.data);
        forceRefresh();
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Success",
            content: "Admission has been successfully scheduled",
          })
        );
        handleCloseModal();
      } else {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error",
            content: "Please select an admission date",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, maxHeight: "80vh", overflow: "auto" }}>
          {selectedAppointment && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <MDTypography
                  id="modal-modal-title"
                  variant="h3"
                  component="h2"
                  gutterBottom
                >
                  HH-{selectedAppointment.appointmentId}:{" "}
                  {selectedAppointment.firstName} {selectedAppointment.lastName}{" "}
                  ({calculateAge(selectedAppointment?.dateOfBirth)}
                  {selectedAppointment.sex === "Male" ? "M" : "F"})
                </MDTypography>
                {selectedAppointment.patientProfilePicture !== null && (
                  <MDAvatar
                    src={profileImage}
                    alt="profile-image"
                    size="xxl"
                    shadow="xxl"
                    style={{ height: "150px", width: "150px" }}
                  />
                )}
                {selectedAppointment.patientProfilePicture === null && (
                  <Skeleton
                    className="avatar-right"
                    variant="circular"
                    style={{ height: "150px", width: "150px" }}
                  />
                )}
              </Box>
              <List>
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Location:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom color="black">
                    {facilityLocation !== null
                      ? facilityLocation
                      : "No Location Yet"}
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h5" gutterBottom>
                    Link to Electronic Health Record:
                  </MDTypography>
                  <MDBox>
                    <Stack direction="row" spacing={2}>
                      <AddAttachmentButton
                        selectedAppointment={selectedAppointment}
                      />
                      <ViewAttachmentsButton
                        selectedAppointment={selectedAppointment}
                      />
                    </Stack>
                  </MDBox>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom>
                    <MDButton
                      onClick={handleClickToEhr}
                      color="primary"
                      //quick fix for SR2
                      disabled={
                        selectedAppointment.currentAssignedStaffId !=
                        loggedInStaff.staffId
                      }
                    >
                      EHR
                    </MDButton>
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Assigned To :
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom color="black">
                    {assignedStaff === null
                      ? "No Staff Assigned"
                      : assignedStaff.firstname +
                        " " +
                        assignedStaff.lastname +
                        " (" +
                        assignedStaff.staffRoleEnum +
                        ")"}
                  </MDTypography>
                  <MDButton
                    disabled={loading}
                    onClick={handleOpenAssignDialog}
                    variant="gradient"
                    color="primary"
                  >
                    {selectedAppointment.currentAssignedStaffId === null
                      ? "Assign"
                      : "Reassign"}
                  </MDButton>
                </ListItem>
                {/* <ListItem>
                  <ListItemText primary="Priority:" secondary={""} />
                </ListItem>
                <ListItem>
                  <Chip
                    color={
                      selectedAppointment.priorityEnum === "LOW"
                        ? "success"
                        : selectedAppointment.priorityEnum === "MEDIUM"
                        ? "warning"
                        : "error"
                    }
                    label={selectedAppointment.priorityEnum}
                  />
                </ListItem> */}
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Arrival Status:
                  </MDTypography>
                  {/* <ListItemText primary="Arrival Status:" secondary="" /> */}
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom>
                    <Chip
                      color={
                        selectedAppointment.arrived ? "success" : "default"
                      }
                      label={selectedAppointment.arrived ? "Yes" : "No"}
                    />
                  </MDTypography>
                  <ArrivalButton
                    selectedAppointment={selectedAppointment}
                    handleUpdateAppointmentArrival={
                      handleUpdateAppointmentArrival
                    }
                    disableButton={loading}
                  />
                </ListItem>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Description:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <textarea
                    readOnly
                    value={selectedAppointment.description}
                    placeholder="This appointment has no description yet"
                    style={{
                      width: "100%",
                      height: "40px",
                      borderColor: "gainsboro",
                      borderRadius: "6px",
                      fontFamily: "Arial",
                      padding: "10px",
                      fontSize: "15px",
                      overflowY: "auto",
                      resize: "none",
                      "::WebkitScrollbar": {
                        display: "none",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  />
                </ListItem>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Comments:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <textarea
                    readOnly
                    value={selectedAppointment.comments}
                    placeholder="This appointment has no comments yet"
                    style={{
                      width: "100%",
                      height: "60px",
                      borderColor: "gainsboro",
                      borderRadius: "6px",
                      fontFamily: "Arial",
                      padding: "10px",
                      fontSize: "15px",
                      overflowY: "auto",
                      resize: "none",
                      "::WebkitScrollbar": {
                        width: "0px",
                        background: "transparent",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  />
                </ListItem>
                <ListItem sx={{ marginTop: "10px" }}>
                  <textarea
                    value={editableComments}
                    onChange={handleCommentsChange}
                    placeholder="Add new comment here"
                    style={{
                      width: "100%",
                      height: "40px",
                      borderColor: "gainsboro",
                      borderRadius: "6px",
                      fontFamily: "Arial",
                      padding: "10px",
                      fontSize: "15px",
                      overflowY: "auto",
                      resize: "none",
                      "::WebkitScrollbar": {
                        width: "0px",
                        background: "transparent",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  />
                </ListItem>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  <MDButton
                    disabled={!commentsTouched || loading}
                    onClick={handleUpdateComments}
                    variant="gradient"
                    color="primary"
                  >
                    Save Comments
                  </MDButton>
                </Box>

                {/* ADMISSION */}
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Admission:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <textarea
                    readOnly
                    value={`Duration: ${selectedAppointment.admissionDuration}\nReason: ${selectedAppointment.admissionReason}\nWard: ${selectedWard}\nAdmission Date: ${admissionDateTime}\nDischarge Date: ${dischargeDateTime}`}
                    style={{
                      width: "100%",
                      height: "120px",
                      borderColor: "gainsboro",
                      borderRadius: "6px",
                      fontFamily: "Arial",
                      padding: "10px",
                      fontSize: "15px",
                      overflowY: "auto",
                      resize: "none",
                      "::WebkitScrollbar": {
                        width: "0px",
                        background: "transparent",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  />
                </ListItem>

                {scheduled ? null : (
                  <>
                    <InputLabel
                      id="select-ward-class"
                      sx={{ marginTop: "10px" }}
                    >
                      <MDTypography variant="h6" gutterBottom color="black">
                        Search Ward Class
                      </MDTypography>
                    </InputLabel>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Select
                        sx={{ width: "150px", height: "40px" }}
                        labelId="select-ward-class"
                        value={wardClass}
                        onChange={handleSelectWardClass}
                      >
                        <MenuItem value={"A"}>A</MenuItem>
                        <MenuItem value={"B1"}>B1</MenuItem>
                        <MenuItem value={"B2"}>B2</MenuItem>
                        <MenuItem value={"C"}>C</MenuItem>
                      </Select>

                      <MDButton
                        onClick={handleScheduleAdmission}
                        variant="gradient"
                        color="primary"
                      >
                        Schedule Admission
                      </MDButton>
                    </Box>

                    <MDBox pt={3}>
                      <Calendar
                        className="schedule-admission-calendar"
                        localizer={localizer}
                        events={calendarEvents}
                        defaultView={Views.WEEK}
                        startAccessor="start"
                        endAccessor="end"
                        formats={{
                          timeGutterFormat: (date) =>
                            wards[date.getHours()].name,
                        }}
                        min={new Date().setHours(0, 0, 0, 0)}
                        max={new Date().setHours(wards.length, 0, 0, 0)}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={(event) => ({
                          style: {
                            backgroundColor: selectedEventIds.includes(event.id)
                              ? "green"
                              : "blue",
                          },
                        })}
                        // selectable={true}
                        // onSelectSlot={handleSelectSlot}
                      />
                    </MDBox>
                  </>
                )}
              </List>
            </>
          )}
        </Box>
      </Modal>
      <AssignAppointmentDialog
        open={isDialogOpen}
        onConfirm={handleConfirmAssignDialog}
        onClose={handleCloseAssignDialog}
        listOfWorkingStaff={listOfWorkingStaff}
        selectedAppointmentToAssign={selectedAppointment}
        assigningToSwimlane={columnName}
      />
    </>
  );
}

export default ScheduleAdmissionModal;

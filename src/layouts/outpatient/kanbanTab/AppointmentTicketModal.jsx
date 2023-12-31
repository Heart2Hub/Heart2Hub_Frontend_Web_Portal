import React, { useEffect, useState } from "react";
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
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import PrescriptionDialog from "./PrescriptionRecord";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MDTypography from "components/MDTypography";
import { calculateAge } from "utility/Utility";
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
import { appointmentApi } from "../../../api/Api";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDBox from "components/MDBox";
import AddAttachmentButton from "./AddAttachmentButton";
import ViewAttachmentsButton from "./ViewAttachmentsButton";
import ViewFacilityInventoryButton from "layouts/administration/facility-management/viewFacilityInventoryButton";
import AdmissionDialog from "./AdmissionDialog";

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

function AppointmentTicketModal({
  openModal,
  handleCloseModal,
  selectedAppointment,
  replaceItemByIdWithUpdated,
  columnName,
  listOfWorkingStaff,
  forceRefresh,
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [assignedStaff, setAssignedStaff] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [editableComments, setEditableComments] = useState("");
  const [commentsTouched, setCommentsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facility, setFacility] = useState("");
  //For Cart
  const [medications, setMedications] = useState([]);
  const [medicationsAllergy, setMedicationsAllergy] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedMedicationQuantity, setSelectedMedicationQuantity] =
    useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isConfirmDischargeOpen, setConfirmDischargeOpen] = useState(false);

  //For Managing the Cart
  const [cartItems, setCartItems] = useState([]);

  const handleOpenDeleteDialog = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  //for assigning appointment to staff in the AppointmentTicketModal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [assigningToSwimlane, setAssigningToSwimlane] = useState("");

  //logged in staff
  const loggedInStaff = useSelector(selectStaff);

  //for fetching image
  const [profileImage, setProfileImage] = useState(null);

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

  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] =
    useState(false);

  // function to open the prescription dialog
  const handleOpenPrescriptionDialog = () => {
    setIsPrescriptionDialogOpen(true);
  };

  //Only for Discharge ticket, will create an Invoice after discharfe
  const handleDischarge = async () => {
    if (!selectedAppointment.arrived) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Patient has not arrived! ",
        })
      );
      return;
    }

    try {
      await transactionItemApi.checkout(
        selectedAppointment.patientId,
        selectedAppointment.appointmentId
      );
      // Perform any necessary actions after discharge
      console.log("Patient has been discharged.");

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: "Patient has been discharged.",
        })
      );

      handleCloseModal();
      handleCloseConfirmDischarge();
      forceRefresh();
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
  };

  // Fetch lists of all medications and service items from the API
  const fetchMedicationsAndServices = async () => {
    try {
      const medicationsResponse = await inventoryApi.getAllMedicationsByAllergy(
        selectedAppointment.patientId
      );
      const outpatientMedicationAllergy = medicationsResponse.data.filter(
        (item) => item.itemTypeEnum !== "MEDICINE_INPATIENT"
      );
      setMedicationsAllergy(outpatientMedicationAllergy);

      const medicationsResponse2 = await inventoryApi.getAllMedication();
      const outpatientMedication = medicationsResponse2.data.filter(
        (item) => item.itemTypeEnum !== "MEDICINE_INPATIENT"
      );
      setMedications(outpatientMedication);

      const servicesResponse = await inventoryApi.getAllServiceItemByUnit(
        loggedInStaff.unit.unitId
      );
      const outpatientServices = servicesResponse.data.filter(
        (service) => service.itemTypeEnum === "OUTPATIENT"
      );
      setServices(outpatientServices);
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

  const handlePageRefresh = () => {
    fetchPatientCart();
  };

  const handleConfirmDelete = async () => {
    try {
      await transactionItemApi.removeFromCart(
        selectedAppointment.patientId,
        selectedItemId
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
    handleCloseDeleteDialog();
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

      const existsInAllergy = medicationsAllergy.some(
        (item) => item.inventoryItemId === requestBody.inventoryItem
      );

      if (!existsInAllergy) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error",
            content:
              "Patient has allergy restrictions from selected Medication.",
          })
        );
        return;
      }
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
      <Box style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Autocomplete
          disablePortal
          id="medication-label"
          options={medications}
          getOptionLabel={(option) => option.inventoryItemName}
          style={{ width: "80%" }}
          sx={{ lineHeight: "3em" }}
          renderInput={(params) => (
            <TextField {...params} label="Select Medication" />
          )}
          value={selectedMedication}
          onChange={(event, newValue) => {
            setSelectedMedication(newValue);
          }}
        />
        <TextField
          label="Quantity"
          type="number"
          value={selectedMedicationQuantity}
          onChange={(e) => setSelectedMedicationQuantity(e.target.value)}
          style={{ width: "20%", marginLeft: 10 }}
        />
        <ListItem sx={{ display: "flex", justifyContent: "flex-end" }}>
          <MDButton
            onClick={() => handleAddMedicationToPatient(selectedMedication)}
            variant="gradient"
            color="primary"
          >
            Add Medication
          </MDButton>
        </ListItem>
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}> */}
        {/* </Box> */}
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

    //AMELIA REMOVED THIS LINE BELOW BECAUSE THERE WAS A BUG BUT ACTUALLY HAVENT FIX YET

    // console.log("Facility Id: " + facility.facilityId);

    if (facility) {
      setFacility(facility);
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

  const handleCloseConfirmDischarge = () => {
    setConfirmDischargeOpen(false);
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
    // console.log(selectedAppointment);
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
        console.log(response);
        console.log(response.data);
        reduxDispatch(setEHRRecord(response.data));
        navigate("/ehr/ehrRecord");
      });
  };

  useEffect(() => {
    setAssignedStaff(null);
    if (selectedAppointment.currentAssignedStaffId !== null) {
      getAssignedStaffName(selectedAppointment.currentAssignedStaffId);
      setFacilityLocation(
        getFacilityLocationByStaffIdThroughShift(
          selectedAppointment.currentAssignedStaffId
        )
      );
    }
    handleGetProfileImage();
    fetchMedicationsAndServices();
    fetchPatientCart();
    // setAssigningToSwimlane(columnName);
    console.log(selectedAppointment);
  }, [selectedAppointment, listOfWorkingStaff]);

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
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom>
                    {facilityLocation !== null
                      ? facilityLocation
                      : "No Location Yet"}
                  </MDTypography>
                  <MDBox>
                    <Stack direction="row">
                      {facilityLocation !== null && (
                        <ViewFacilityInventoryButton
                          selectedFacility={facility}
                          selectedAppointment={selectedAppointment}
                        />
                      )}
                    </Stack>
                  </MDBox>
                </ListItem>
                <ListItem
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
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
                  <MDTypography variant="h6" gutterBottom>
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

                <List>
                  {/* ... existing list items ... */}
                  <ListItem>
                    <MDTypography variant="h5" gutterBottom>
                      Prescription Records:
                    </MDTypography>
                  </ListItem>
                  <ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 2,
                      }}
                    >
                      <MDButton
                        onClick={handleOpenPrescriptionDialog}
                        variant="gradient"
                        color="primary"
                      >
                        View Prescription Records
                      </MDButton>
                    </Box>
                  </ListItem>
                </List>
                {/* ... rest of the existing code ... */}
                <PrescriptionDialog
                  open={isPrescriptionDialogOpen}
                  onClose={() => setIsPrescriptionDialogOpen(false)}
                  electronicHealthRecordId={
                    selectedAppointment.electronicHealthRecordId
                  }
                  handlePageRefresh={handlePageRefresh}
                />
                <br></br>
                {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
                  <>
                    <List>
                      <ListItem>
                        <MDTypography variant="h5" gutterBottom>
                          Medications:
                        </MDTypography>
                      </ListItem>
                      <ListItem>{renderMedicationsDropdown()}</ListItem>
                    </List>
                    <br></br>
                    <List>
                      <ListItem>
                        <MDTypography variant="h5" gutterBottom>
                          Services:
                        </MDTypography>
                      </ListItem>
                      <ListItem>{renderServicesDropdown()}</ListItem>
                    </List>
                  </>
                ) : null}
                <List>
                  <ListItem>
                    <MDTypography variant="h5" gutterBottom>
                      Patient's Cart:
                    </MDTypography>
                    <IconButton onClick={fetchPatientCart} aria-label="refresh">
                      <RefreshIcon />
                    </IconButton>
                  </ListItem>
                  {cartItems.length === 0 ? (
                    <ListItem>
                      <MDTypography variant="subtitle1">
                        Patient's cart is empty.
                      </MDTypography>
                    </ListItem>
                  ) : (
                    <ListItem>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell> Name</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cartItems.map((item) => (
                              <TableRow
                                key={item.transactionItemId}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {item.transactionItemName}
                                </TableCell>
                                <TableCell align="right">
                                  Quantity: {item.transactionItemQuantity}
                                </TableCell>
                                {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
                                  <TableCell align="right">
                                    <Button
                                      variant="contained"
                                      style={{
                                        backgroundColor: "#f44336",
                                        color: "white",
                                      }}
                                      onClick={() =>
                                        handleOpenDeleteDialog(
                                          item.transactionItemId
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                ) : null}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ListItem>
                  )}
                </List>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  {selectedAppointment.swimlaneStatusEnum === "DISCHARGE" && (
                    <MDButton
                      onClick={() => setConfirmDischargeOpen(true)}
                      variant="gradient"
                      color="success"
                      style={{ marginTop: "20px" }}
                    >
                      Discharge
                    </MDButton>
                  )}
                </Box>
              </List>
            </>
          )}
        </Box>
      </Modal>
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <MDButton
            onClick={handleConfirmDelete}
            color="primary"
            variant="contained"
          >
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isConfirmDischargeOpen}
        onClose={handleCloseConfirmDischarge}
      >
        <DialogTitle>Confirm Discharge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to discharge {selectedAppointment.firstName}{" "}
            {selectedAppointment.lastName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDischarge} color="primary">
            Cancel
          </Button>
          <MDButton
            onClick={handleDischarge}
            color="primary"
            variant="contained"
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
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

export default AppointmentTicketModal;

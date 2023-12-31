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
  Icon,
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
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
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
import { setEHRRecord } from "store/slices/ehrSlice";
import ArrivalButton from "../outpatient/kanbanTab/ArrivalButton";
import { displayMessage } from "store/slices/snackbarSlice";
import { appointmentApi } from "api/Api";
import AssignAppointmentDialog from "../outpatient/kanbanTab/AssignAppointmentDialog";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDBox from "components/MDBox";
import AddAttachmentButton from "../outpatient/kanbanTab/AddAttachmentButton";
import ViewAttachmentsButton from "../outpatient/kanbanTab/ViewAttachmentsButton";
import PrescriptionDialog from "layouts/outpatient/kanbanTab/PrescriptionRecord";
import EditCart from "./EditCart";

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
  setCart
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [assignedStaff, setAssignedStaff] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [editableComments, setEditableComments] = useState("");
  const [commentsTouched, setCommentsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  //For Cart
  const [medications, setMedications] = useState([]);
  const [medicationsAllergy, setMedicationsAllergy] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedMedicationQuantity, setSelectedMedicationQuantity] =
    useState(1);
  const [selectedService, setSelectedService] = useState(null);

  //For Managing the Cart
  const [cartItems, setCartItems] = useState([]);
  const [isEditCartOpen, setIsEditCartOpen] = useState(false);

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

  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);

  // function to open the prescription dialog
  const handleOpenPrescriptionDialog = () => {
    setIsPrescriptionDialogOpen(true);
  };

  //Only for Discharge ticket, will create an Invoice after discharfe
  const handleDischarge = async () => {
    const confirmed = window.confirm("Are you sure you want to discharge the patient?");

    if (confirmed) {
      try {
        await transactionItemApi.checkout(selectedAppointment.patientId, selectedAppointment.appointmentId);
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
    }
  };

  // Fetch lists of all medications and service items from the API
  const fetchMedicationsAndServices = async () => {
    try {
      const medicationsResponse = await inventoryApi.getAllMedicationsByAllergy(selectedAppointment.patientId);
      const outpatientMedicationAllergy = medicationsResponse.data.filter(
        (item) => item.itemTypeEnum !== "MEDICINE_INPATIENT"
      );
      setMedicationsAllergy(outpatientMedicationAllergy);

      const medicationsResponse2 = await inventoryApi.getAllMedication();
      const outpatientMedication = medicationsResponse2.data.filter(
        (item) => item.itemTypeEnum !== "MEDICINE_INPATIENT"
      );
      setMedications(outpatientMedication);

      const servicesResponse = await inventoryApi.getAllServiceItemByUnit(loggedInStaff.unit.unitId);
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
      setCart(response.data)
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
            content: "Patient has allergy restrictions from selected Medication.",
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

      transactionItemApi
        .addToCart(patientId, requestBody)
        .then((response) => {
          const item = response.data;
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

  const handleEditCartClose = () => {
    setEditIndex(null);
    setIsEditCartOpen(false);
  }

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
        reduxDispatch(setEHRRecord(response.data));
        navigate("/ehr/ehrRecord");
      });
  };

  const updateCartQuantity = async (lineItem) => {
    try {
      const r = await transactionItemApi.updateTransactionItem(lineItem.transactionItemId, lineItem.transactionItemQuantity)
      handleEditCartClose();
      // for (let i=0; i<cartItems.length; i++) {
      //   if (cartItems[i].transactionItemId === lineItem.transactionItemId) {
      //     let temp = cartItems;
      //     temp[i].transactionItemQuantity = Number(lineItem.transactionItemQuantity)
      //     setCartItems(temp);
      //     setCart(temp);
      //   }
      // }
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
  }

  useEffect(() => {
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
  }, [selectedAppointment, listOfWorkingStaff, editIndex]);

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
                  {selectedAppointment.dispensaryStatusEnum === "READY_TO_COLLECT" ?
                    <ArrivalButton
                      selectedAppointment={selectedAppointment}
                      handleUpdateAppointmentArrival={
                        handleUpdateAppointmentArrival
                      }
                      disableButton={loading}
                    /> : null}
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
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
                  electronicHealthRecordId={selectedAppointment.electronicHealthRecordId}
                  handlePageRefresh={handlePageRefresh}
                />
                <br></br>
                {loggedInStaff.staffRoleEnum === "PHARMACIST" &&
                  <List>
                    <ListItem>
                      <MDTypography variant="h5" gutterBottom>
                        Medications:
                      </MDTypography>
                    </ListItem>
                    <ListItem>{renderMedicationsDropdown()}</ListItem>
                  </List>}
                <br></br>
                {/* <List>
                  <ListItem>
                    <MDTypography variant="h5" gutterBottom>
                      Services:
                    </MDTypography>
                  </ListItem>
                  <ListItem>{renderServicesDropdown()}</ListItem>
                </List> */}
                <List>
                  <ListItem>
                    <MDTypography variant="h5" gutterBottom>
                      Patient's Cart:
                    </MDTypography>
                    <IconButton
                      onClick={fetchPatientCart}
                      aria-label="refresh"
                    >
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
                            {cartItems.map((item, index) => (
                              <TableRow
                                key={item.transactionItemId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {item.transactionItemName}
                                </TableCell>
                                <TableCell align="right">
                                  Quantity: {item.transactionItemQuantity} &nbsp;
                                  <IconButton
                                    color="secondary"
                                    onClick={() => { setEditIndex(index); setIsEditCartOpen(true); }}
                                  >
                                    <Icon>edit</Icon>
                                  </IconButton>
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
                      onClick={handleDischarge}
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
      {/* <AssignAppointmentDialog
        open={isDialogOpen}
        onConfirm={handleConfirmAssignDialog}
        onClose={handleCloseAssignDialog}
        listOfWorkingStaff={listOfWorkingStaff}
        selectedAppointmentToAssign={selectedAppointment}
        assigningToSwimlane={columnName}
      /> */}
      <EditCart
        open={isEditCartOpen}
        onClose={handleEditCartClose}
        cart={cartItems[editIndex]}
        updateCartQuantity={updateCartQuantity} />

    </>
  );
}

export default AppointmentTicketModal;

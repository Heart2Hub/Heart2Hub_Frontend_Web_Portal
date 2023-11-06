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
import ArrivalButton from "./ArrivalButton";
import { displayMessage } from "store/slices/snackbarSlice";
import { appointmentApi } from "api/Api";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDBox from "components/MDBox";
import AddAttachmentButton from "./AddAttachmentButton";
import ViewAttachmentsButton from "./ViewAttachmentsButton";
import AdmissionDialog from "./AdmissionDialog";
import moment from "moment";
import { medicationOrderApi } from "api/Api";

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

function MedicationOrderModal({
  openModal,
  handleCloseModal,
  selectedAdmission,
  selectedSlot,
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
  const [medicationOrders, setMedicationOrders] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [comments, setComments] = useState(null);

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

  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] =
    useState(false);

  // function to open the prescription dialog
  const handleOpenPrescriptionDialog = () => {
    setIsPrescriptionDialogOpen(true);
  };

  // Fetch lists of all medications and service items from the API
  const fetchMedicationsAndServices = async () => {
    try {
      const medicationsResponse = await inventoryApi.getAllMedicationsByAllergy(
        selectedAdmission.patientId
      );
      setMedicationsAllergy(medicationsResponse.data);

      const medicationsResponse2 = await inventoryApi.getAllMedication();
      setMedications(medicationsResponse2.data);

      const servicesResponse = await inventoryApi.getAllServiceItemByUnit(
        loggedInStaff.unit.unitId
      );
      setServices(servicesResponse.data);
      // console.log(servicesResponse.data)
      // console.log(selectedAdmission)
    } catch (error) {
      console.error("Error fetching medications and services:", error);
    }
  };

  // const fetchPatientCart = async () => {
  //   try {
  //     const response = await transactionItemApi.getCartItems(
  //       selectedAdmission.patientId
  //     );

  //     setCartItems(response.data);
  //     console.log(cartItems);
  //   } catch (error) {
  //     console.error("Error fetching cart items:", error);
  //   }
  // };

  const fetchMedicationOrders = async () => {
    try {
      console.log("fetchiong");
      const response = await medicationOrderApi.getAllMedicationOrdersOfAdmission(
        selectedAdmission.admissionId
      );
      console.log(response.data);

      setMedicationOrders(response.data);
      console.log(medicationOrders);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handlePageRefresh = () => {
    fetchMedicationOrders();
  };

  const handleConfirmDelete = async () => {
    try {
      await transactionItemApi.removeFromCart(
        selectedAdmission.patientId,
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
      // fetchPatientCart();
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

  const handleAddMedicationOrder = async (medication) => {
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
      const admissionId = selectedAdmission.admissionId; // Replace with the actual patient ID
      const requestBody = {
        title: selectedAdmission.patientId,
        quantity: selectedMedicationQuantity,
        comments: comments,
        startDate: startDate,
        endDate: endDate,
        isComplete: false,
      };

      // const existsInAllergy = medicationsAllergy.some(
      //   (item) => item.inventoryItemId === requestBody.inventoryItem
      // );

      // if (!existsInAllergy) {
      //   reduxDispatch(
      //     displayMessage({
      //       color: "error",
      //       icon: "notification",
      //       title: "Error",
      //       content:
      //         "Patient has allergy restrictions from selected Medication.",
      //     })
      //   );
      //   return;
      // }
      console.log(requestBody);
      console.log(medication.inventoryItemId);

      medicationOrderApi
        .createMedicationOrder(medication.inventoryItemId, admissionId, requestBody)
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
          fetchMedicationOrders();
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
            onClick={() => handleAddMedicationOrder(selectedMedication)}
            variant="gradient"
            color="primary"
          >
            Add Medication
          </MDButton>
        </ListItem>
      </Box>
    );
  };

  // console.log(selectedAdmission);


  useEffect(() => {
    const startMoment = moment(selectedSlot.start);
    const endMoment = moment(selectedSlot.end);
    setStartDate(startMoment.format("YYYY-MM-DD HH:mm:ss"));
    setEndDate(endMoment.format("YYYY-MM-DD HH:mm:ss"));
    fetchMedicationsAndServices();
    fetchMedicationOrders();
  }, [selectedSlot]);

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, maxHeight: "80vh", overflow: "auto" }}>
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
              Medication Order for {selectedAdmission.firstName}{" "}
              {selectedAdmission.lastName}
            </MDTypography>
          </Box>
          <List>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                Start Date :
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h6" gutterBottom color="black">
                {startDate}
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                End Date :
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h6" gutterBottom color="black">
                {endDate}
              </MDTypography>
            </ListItem>
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
              selectedAdmission.electronicHealthRecordId
            }
            handlePageRefresh={handlePageRefresh}
          />
          <br></br>
          {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
            <>
              <List>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Comments:
                  </MDTypography>
                </ListItem>
                <ListItem sx={{ marginTop: "10px" }}>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add new comment here"
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
                  <MDTypography variant="h5" gutterBottom >
                    Medications:
                  </MDTypography>
                </ListItem>
                <ListItem>{renderMedicationsDropdown()}</ListItem>
              </List>
              <br></br>
              {/* <List>
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Services:
                  </MDTypography>
                </ListItem>
                <ListItem>{renderServicesDropdown()}</ListItem>
              </List> */}
            </>
          ) : null}
          <List>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                List of Medication Orders:
              </MDTypography>
              <IconButton onClick={fetchMedicationOrders} aria-label="refresh">
                <RefreshIcon />
              </IconButton>
            </ListItem>
            {medicationOrders.length === 0 ? (
              <ListItem>
                <MDTypography variant="subtitle1">No Orders Added</MDTypography>
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
                      {medicationOrders.map((item) => (
                        <TableRow
                          key={item.medicationOrderId}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {item.medication.inventoryItemName}
                          </TableCell>
                          <TableCell align="right">
                            Quantity: {item.quantity}
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
                                  handleOpenDeleteDialog(item.transactionItemId)
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
    </>
  );
}

export default MedicationOrderModal;

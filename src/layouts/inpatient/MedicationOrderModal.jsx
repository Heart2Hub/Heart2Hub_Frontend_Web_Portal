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
import { admissionApi } from "api/Api";

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
  startDate,
  endDate,
  existingMedicationOrders,
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [comments, setComments] = useState(null);
  const [medicationOrders, setMedicationOrders] = useState(existingMedicationOrders);

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
  const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);


  const handleOpenDeleteDialog = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenCompleteDialog = (itemId) => {
    setSelectedItemId(itemId);
    setCompleteDialogOpen(true);
    setIsCompleted(true)
  };

  const handleCloseCompleteDialog = () => {
    setCompleteDialogOpen(false);
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
  const fetchMedications = async () => {
    try {
      const medicationsResponse = await inventoryApi.getAllInpatientMedicationsByAllergy(
        selectedAdmission.patientId
      );
      setMedicationsAllergy(medicationsResponse.data);
      console.log("allergy " + medicationsResponse.data)

      const medicationsResponse2 = await inventoryApi.getAllInpatientMedication();
      setMedications(medicationsResponse2.data);
      console.log("no allergy " + medicationsResponse2.data)

    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  // const fetchMedicationOrder= async (id) => {
  //   try {
  //     const response = await medicationOrderApi.getMedicationOrderById(id);
  //     const medication = response.data;
  //     getMedicationOrders(admission.listOfMedicationOrderIds);
  //   } catch (error) {
  //     console.error("Error fetching medication orders:", error);
  //   }
  // }

  const fetchAdmission = async (id) => {
    try {
      const response = await admissionApi.getAdmissionByAdmissionId(id);
      const admission = response.data;
      getMedicationOrders(admission.listOfMedicationOrderIds);
    } catch (error) {
      console.error("Error fetching medication orders:", error);
    }
  }

  const getMedicationOrders = async (medicationOrderIds) => {
    const medicationOrderPromises = medicationOrderIds.map((id) =>
      medicationOrderApi.getMedicationOrderById(id)
    );
    const medicationOrderResponses = await Promise.all(medicationOrderPromises);
    const listOfMedicationOrders = medicationOrderResponses.map(
      (response) => response.data
    );
    //console.log(listOfMedicationOrders);
    setMedicationOrders(listOfMedicationOrders);
  };

  useEffect(() => {
    fetchMedications();
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const startDateString = startMoment.format("YYYY-MM-DD HH:mm:ss");
    const endDateString = endMoment.format("YYYY-MM-DD HH:mm:ss");
    setStartDateString(startDateString);
    setEndDateString(endDateString);
  }, []);

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
        startDate: startDateString,
        endDate: endDateString,
        isCompleted: false,
      };

      // if (requestBody.comments == '') {
      //   reduxDispatch(
      //     displayMessage({
      //       color: "error",
      //       icon: "notification",
      //       title: "Error Encountered",
      //       content: "Comment cannot be empty",
      //     })
      //   );
      //   return
      // }

      const existsInAllergy = medicationsAllergy.some(
        (item) => item.inventoryItemId === medication.inventoryItemId
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
      console.log(medication.inventoryItemId);

      const containsMedication = medicationOrders.some(
        (item) => item.medication.inventoryItemId === medication.inventoryItemId
      );

      if (containsMedication) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error",
            content:
              "Medication already added to order.",
          })
        );
        return;
      }

      medicationOrderApi
        .createMedicationOrder(
          medication.inventoryItemId,
          admissionId,
          requestBody
        )
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
          setMedicationOrders([...medicationOrders, item]);
          //fetchMedicationOrders();
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
      console.error("Error fetching medications:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await medicationOrderApi
        .deleteMedicationOrder(
          selectedItemId,
          selectedAdmission.admissionId
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
      console.log("Before: " + medicationOrders);
      const updatedMedicationOrders = medicationOrders.filter(item => item.medicationOrderId !== selectedItemId);
      setMedicationOrders(updatedMedicationOrders);
      // fetchAdmission(selectedAdmission.admissionId);
      // getMedicationOrders(selectedAdmission.listOfMedicationOrderIds);
      console.log(selectedAdmission.listOfMedicationOrderIds);
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

  const handleConfirmComplete = async () => {
    try {
      await medicationOrderApi
        .updateComplete(
          selectedItemId,
          selectedAdmission.admissionId,
          isCompleted
        );
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: "Medication order has been completed!",
        })
      );
      const updatedMedicationOrders = medicationOrders.map((item) =>
        item.medicationOrderId === selectedItemId ? { ...item, isCompleted: true } : item
      );
      setMedicationOrders(updatedMedicationOrders);
      // fetchPatientCart();
      // fetchAdmission(selectedAdmission.admissionId);
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
    handleCloseCompleteDialog();
  };

  //   const renderIsCompleteButton = (item) => {
  //     return ( 
  //       if (!item.isCompleted) {
  //       return (
  //         <Button
  //           variant="contained"
  //           style={{
  //             backgroundColor: "#f44336",
  //             color: "white",
  //           }}
  //           onClick={() => handleOpenCompleteDialog(item.medicationOrderId)}
  //         >
  //           Complete
  //         </Button>
  //       );
  //     } else {
  //       return null;
  //     }
  //     );
  // };

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
                {startDateString}
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                End Date :
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h6" gutterBottom color="black">
                {endDateString}
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
          //handlePageRefresh={handlePageRefresh}
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
                  <MDTypography variant="h5" gutterBottom>
                    Medications:
                  </MDTypography>
                </ListItem>
                <ListItem>{renderMedicationsDropdown()}</ListItem>
              </List>
              <br></br>
            </>
          ) : null}
          <List>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                List of Medication Orders:
              </MDTypography>
              {/* <IconButton onClick={fetchMedicationOrders} aria-label="refresh">
                <RefreshIcon />
              </IconButton> */}
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
                        <>
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
                            <TableCell>
                              <div>Quantity: {item.quantity}</div>
                              <div>Comments: {item.comments}</div>
                            </TableCell>
                            {loggedInStaff.staffRoleEnum == "DOCTOR" && item.isCompleted == false ? (
                              <TableCell align="right">
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: "#f44336",
                                    color: "white",
                                  }}
                                  onClick={() =>
                                    handleOpenDeleteDialog(
                                      item.medicationOrderId
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            ) : null}
                            {loggedInStaff.staffRoleEnum == "NURSE" && item.isCompleted == false ? (
                              <TableCell align="right">
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: "#f44336",
                                    color: "white",
                                  }}
                                  onClick={() => handleOpenCompleteDialog(item.medicationOrderId)}
                                // disabled={item.isCompleted !== false}
                                >
                                  Complete
                                </Button>
                              </TableCell>
                            ) : null}
                          </TableRow>
                        </>
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
      <Dialog open={isCompleteDialogOpen} onClose={handleCloseCompleteDialog}>
        <DialogTitle>Confirm Complete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure this medication order is completed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteDialog} color="primary">
            Cancel
          </Button>
          <MDButton
            onClick={handleConfirmComplete}
            color="primary"
            variant="contained"
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MedicationOrderModal;
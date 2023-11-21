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
import DataTable from "examples/Tables/DataTable";

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

const doctorActionMap = {
  DELETE: ["FUTURE", false],
  NOT_COMPLETED: ["CURRENT", false],
  COMPLETED: ["CURRENT", "PAST", true],
  OVERDUE: ["PAST", false],
};

const nurseActionMap = {
  NOT_COMPLETED: ["FUTURE", false],
  COMPLETE: ["CURRENT", false],
  COMPLETED: ["CURRENT", "PAST", true],
  OVERDUE: ["PAST", false],
};

const otherStaffActionMap = {
  NOT_COMPLETED: ["CURRENT", "FUTURE", false],
  COMPLETED: ["CURRENT", "PAST", true],
  OVERDUE: ["PAST", false],
};

const buttonColorMap = {
  DELETE: "#f44336",
  NOT_COMPLETED: "#8c8c8c",
  COMPLETE: "orange",
  COMPLETED: "green",
  OVERDUE: "#ff0000",
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
  const [medicationOrders, setMedicationOrders] = useState(
    existingMedicationOrders
  );

  //For Cart
  const [medications, setMedications] = useState([]);
  const [medicationsAllergy, setMedicationsAllergy] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedMedicationQuantity, setSelectedMedicationQuantity] =
    useState(1);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  //Delete medication order
  const [orderStatus, setOrderStatus] = useState("FUTURE");
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setIsCompleted(true);
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
      const medicationsResponse =
        await inventoryApi.getAllInpatientMedicationsByAllergy(
          selectedAdmission.patientId
        );
      setMedicationsAllergy(medicationsResponse.data);
      console.log("allergy " + medicationsResponse.data);

      const medicationsResponse2 =
        await inventoryApi.getAllInpatientMedication();
      setMedications(medicationsResponse2.data);
      console.log("no allergy " + medicationsResponse2.data);
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
  };

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

  const fetchPatientCart = async () => {
    try {
      const response = await transactionItemApi.getCartItems(
        selectedAdmission.patientId
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchPatientCart();
    fetchMedications();
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    if (moment().isBefore(startMoment)) {
      setOrderStatus("FUTURE");
    } else if (moment().isBefore(endMoment)) {
      setOrderStatus("CURRENT");
    } else {
      setOrderStatus("PAST");
    }

    const startDateString = startMoment.format("YYYY-MM-DD HH:mm:ss");
    const endDateString = endMoment.format("YYYY-MM-DD HH:mm:ss");
    setStartDateString(startDateString);
    setEndDateString(endDateString);
    //console.log(medicationOrders);
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
        title: "Medication Order",
        quantity: selectedMedicationQuantity,
        comments: comments,
        startDate: startDateString,
        endDate: endDateString,
        isCompleted: false,
        createdBy: `Dr. ${loggedInStaff.firstname} ${loggedInStaff.lastname}`,
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
      // console.log(requestBody);
      // console.log(medication.inventoryItemId);

      const containsMedication = medicationOrders.some(
        (item) => item.medication.inventoryItemId === medication.inventoryItemId
      );

      if (containsMedication) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error",
            content: "Medication already added to order.",
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
      await medicationOrderApi.deleteMedicationOrder(
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
      const updatedMedicationOrders = medicationOrders.filter(
        (item) => item.medicationOrderId !== selectedItemId
      );
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
      await medicationOrderApi.updateComplete(
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
        item.medicationOrderId === selectedItemId
          ? { ...item, isCompleted: true }
          : item
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

  const renderActionButton = (medicationOrder) => {
    //console.log(medicationOrder);
    let entries;
    if (loggedInStaff.staffRoleEnum === "DOCTOR") {
      entries = Object.entries(doctorActionMap);
    } else if (loggedInStaff.staffRoleEnum === "NURSE") {
      entries = Object.entries(nurseActionMap);
    } else {
      entries = Object.entries(otherStaffActionMap);
    }

    for (const [action, conditions] of entries) {
      // console.log(orderStatus);
      // console.log(medicationOrder.isCompleted);
      if (
        conditions.includes(orderStatus) &&
        conditions.includes(medicationOrder.isCompleted)
      ) {
        return action;
      }
    }

    return "Not found";
  };

  const renderButtonOnClick = (medicationOrder) => {
    if (renderActionButton(medicationOrder) === "DELETE") {
      return () => handleOpenDeleteDialog(medicationOrder.medicationOrderId);
    } else if (renderActionButton(medicationOrder) === "COMPLETE") {
      console.log(selectedAdmission.listOfStaffsId);
      if (selectedAdmission.listOfStaffsId.includes(loggedInStaff.staffId)) {
        return () =>
          handleOpenCompleteDialog(medicationOrder.medicationOrderId);
      } else {
        return () => displayErrorMessageForUnassignedNurse();
      }
    }
  };

  const displayErrorMessageForUnassignedNurse = () => {
    reduxDispatch(
      displayMessage({
        color: "error",
        icon: "notification",
        title: "Error Encountered",
        content:
          "You are not be able to complete an order you are unassigned to",
      })
    );
    return;
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
            {loggedInStaff.staffRoleEnum === "DOCTOR" && (
              <>
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
              </>
            )}
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

          {loggedInStaff.staffRoleEnum === "DOCTOR" &&
            orderStatus === "FUTURE" && (
              <List>
                <ListItem sx={{ marginTop: "30px" }}>
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
            )}
          <br />

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
                <table className="medication-order-table">
                  <tr>
                    <th>Medication</th>
                    <th>Quantity</th>
                    <th>Comments</th>
                    <th>Prescribed by</th>
                    <th align="center">Action</th>
                  </tr>
                  {medicationOrders.map((item) => (
                    <tr>
                      <td>{item.medication.inventoryItemName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.comments}</td>
                      <td>{item.createdBy}</td>
                      <td align="center">
                        <Button
                          variant="contained"
                          style={{
                            width: "80%",
                            backgroundColor:
                              buttonColorMap[renderActionButton(item)],
                            color: "white",
                          }}
                          onClick={renderButtonOnClick(item)}
                        >
                          {renderActionButton(item)}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </table>
                {/* <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Comments</TableCell>
                      <TableCell>Prescribed by</TableCell>
                      <TableCell>Action</TableCell>
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
                          <TableCell sx={{ minWidth: 150 }}>
                            {item.medication.inventoryItemName}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.comments}</TableCell>
                          <TableCell>{item.createdBy}</TableCell>

                          <TableCell>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor:
                                  buttonColorMap[renderActionButton(item)],
                                color: "white",
                              }}
                              onClick={renderButtonOnClick(item)}
                            >
                              {renderActionButton(item)}
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table> */}
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

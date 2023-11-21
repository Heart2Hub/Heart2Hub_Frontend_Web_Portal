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
import { inpatientTreatmentApi } from "api/Api";
import MDInput from "components/MDInput";

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

const treatmentStaffActionMap = {
  DELETE: ["FUTURE", false],
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
  COMPLETE: "#f44336",
  COMPLETED: "green",
  OVERDUE: "#ff0000",
};

function TreatmentModal({
  openModal,
  handleCloseModal,
  selectedAdmission,
  startDate,
  endDate,
  existingTreatment,
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [comments, setComments] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [arrived, setArrived] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  //Delete medication order
  const [orderStatus, setOrderStatus] = useState("FUTURE");
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  //logged in staff
  const loggedInStaff = useSelector(selectStaff);

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenCompleteDialog = () => {
    setCompleteDialogOpen(true);
  };

  const handleCloseCompleteDialog = () => {
    setCompleteDialogOpen(false);
  };

  //get the facility location
  const getFacilityLocationByStaffIdThroughShift = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      loggedInStaff.unit.name
    );
    const listOfWorkingStaff = response.data;

    let facility = listOfWorkingStaff.filter(
      (staff) => staff.staffId === loggedInStaff.staffId
    )[0];

    //console.log(facility);

    if (facility) {
      setFacilityLocation(facility.name + " (" + facility.location + ")");
    } else {
      setFacilityLocation(null);
    }
  };

  // Fetch lists of all medications and service items from the API
  const fetchServices = async () => {
    try {
      const servicesResponse = await inventoryApi.getAllServiceItemByUnit(
        loggedInStaff.unit.unitId
      );
      const inpatientTreatments = servicesResponse.data.filter(
        (item) => item.itemTypeEnum === "INPATIENT"
      );
      setServices(inpatientTreatments);
      // console.log(servicesResponse.data)
      // console.log(selectedAppointment)
    } catch (error) {
      console.error("Error fetching medications and services:", error);
    }
  };

  useEffect(() => {
    getFacilityLocationByStaffIdThroughShift();
    fetchServices();
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

    if (existingTreatment) {
      console.log(existingTreatment);
      setArrived(existingTreatment.arrived);
      setComments(existingTreatment.comments);
      setSelectedService(existingTreatment.serviceItem.inventoryItemName);
    }
  }, []);

  // useEffect(() => {
  //   if (selectedService) {
  //     console.log(selectedService);
  //   }
  // }, [selectedService]);

  const handleCreateInpatientTreatment = async () => {
    try {
      const admissionId = selectedAdmission.admissionId; // Replace with the actual patient ID
      const requestBody = {
        location: facilityLocation,
        comments: comments,
        startDate: startDateString,
        endDate: endDateString,
        arrived: false,
        isCompleted: false,
        createdBy: `${loggedInStaff.firstname} ${loggedInStaff.lastname} (${loggedInStaff.staffRoleEnum})`,
      };

      const response = await inpatientTreatmentApi.createInpatientTreatment(
        selectedService,
        admissionId,
        loggedInStaff.staffId,
        requestBody
      );

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Successfully Added Treatment!",
        })
      );

      handleCloseModal();
    } catch (error) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: error.response.data,
        })
      );
    }
  };

  const handleUpdateArrival = async () => {
    await inpatientTreatmentApi.updateArrival(
      existingTreatment.inpatientTreatmentId,
      !arrived
    );
    setArrived(!arrived);

    reduxDispatch(
      displayMessage({
        color: "success",
        icon: "notification",
        title: "Update Success",
        content: "Patient's Arrival Status is updated",
      })
    );
  };

  const handleConfirmDelete = async () => {
    await inpatientTreatmentApi.deleteInpatientTreatment(
      existingTreatment.inpatientTreatmentId,
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

    handleCloseDeleteDialog();
    handleCloseModal();
  };

  const handleConfirmComplete = async () => {
    await inpatientTreatmentApi.updateComplete(
      existingTreatment.inpatientTreatmentId,
      selectedAdmission.admissionId
    );
    reduxDispatch(
      displayMessage({
        color: "success",
        icon: "notification",
        title: "Success",
        content: "Treatment has been completed",
      })
    );

    handleCloseCompleteDialog();
    handleCloseModal();
  };

  const renderServicesDropdown = () => {
    return (
      <Box style={{ width: "100%" }}>
        <InputLabel id="medication-label"> Select Services</InputLabel>

        <Select
          onChange={(e) => setSelectedService(e.target.value)}
          style={{ width: "50%" }}
          sx={{ lineHeight: "3em" }}
          value={selectedService}
          readOnly={existingTreatment}
        >
          {services.map((service) => (
            <MenuItem
              key={service.inventoryItemId}
              value={service.inventoryItemId}
            >
              {service.inventoryItemName}
            </MenuItem>
          ))}
        </Select>
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <MDButton
            onClick={() => handleAddServiceToPatient(selectedService)}
            variant="gradient"
            color="primary"
          >
            Add Service
          </MDButton>
        </Box> */}
      </Box>
    );
  };

  const renderActionButton = () => {
    //console.log(medicationOrder);
    let entries;
    if (
      loggedInStaff.staffRoleEnum === "DOCTOR" ||
      loggedInStaff.staffRoleEnum === "NURSE" ||
      loggedInStaff.staffRoleEnum === "ADMIN"
    ) {
      entries = Object.entries(otherStaffActionMap);
    } else {
      entries = Object.entries(treatmentStaffActionMap);
    }

    for (const [action, conditions] of entries) {
      // console.log(orderStatus);
      // console.log(medicationOrder.isCompleted);
      if (
        conditions.includes(orderStatus) &&
        conditions.includes(existingTreatment.isCompleted)
      ) {
        return action;
      }
    }

    return "Not found";
  };

  const renderButtonOnClick = () => {
    if (renderActionButton() === "DELETE") {
      return () => handleOpenDeleteDialog();
    } else if (renderActionButton() === "COMPLETE") {
      return () => handleOpenCompleteDialog();
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
              Inpatient Treatment for {selectedAdmission.firstName}{" "}
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
                Treatment Staff :
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h6" gutterBottom color="black">
                {existingTreatment
                  ? existingTreatment.createdBy
                  : `${loggedInStaff.firstname} ${loggedInStaff.lastname} (${loggedInStaff.staffRoleEnum})`}
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                Location :
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h6" gutterBottom color="black">
                {existingTreatment
                  ? existingTreatment.location
                  : facilityLocation}
              </MDTypography>
            </ListItem>
            <ListItem sx={{ marginTop: "10px" }}>
              <MDTypography variant="h5" gutterBottom>
                Comments:
              </MDTypography>
            </ListItem>
            <ListItem>
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
                disabled={existingTreatment}
              />
            </ListItem>

            <List>
              <ListItem sx={{ marginTop: "10px" }}>
                <MDTypography variant="h5" gutterBottom>
                  Services:
                </MDTypography>
              </ListItem>
              <ListItem>
                {existingTreatment ? (
                  <MDInput value={selectedService} style={{ width: "50%" }} />
                ) : (
                  renderServicesDropdown()
                )}
              </ListItem>
            </List>

            {existingTreatment && (
              <>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Arrival Status:
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom>
                    <Chip
                      color={arrived ? "success" : "default"}
                      label={arrived ? "Yes" : "No"}
                    />
                  </MDTypography>

                  {orderStatus === "CURRENT" &&
                    !(
                      loggedInStaff.staffRoleEnum === "ADMIN" ||
                      loggedInStaff.staffRoleEnum === "NURSE" ||
                      loggedInStaff.staffRoleEnum === "DOCTOR"
                    ) && (
                      <ArrivalButton
                        arrived={arrived}
                        selectedAdmission={existingTreatment}
                        handleUpdateAppointmentArrival={handleUpdateArrival}
                        disableButton={loading}
                      />
                    )}
                </ListItem>
              </>
            )}

            <ListItem
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              {existingTreatment ? (
                <MDButton
                  size="large"
                  variant="gradient"
                  style={{
                    backgroundColor: buttonColorMap[renderActionButton()],
                    color: "white",
                    width: "300px",
                  }}
                  onClick={renderButtonOnClick()}
                  disabled={renderActionButton() === "COMPLETE" && !arrived}
                >
                  {renderActionButton()}
                </MDButton>
              ) : (
                <MDButton
                  size="large"
                  variant="gradient"
                  color="primary"
                  sx={{ width: "300px" }}
                  onClick={handleCreateInpatientTreatment}
                >
                  Create Inpatient Treatment
                </MDButton>
              )}
            </ListItem>
          </List>
        </Box>
      </Modal>
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this inpatient treatment?
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
            Are you sure this inpatient treatment is completed?
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

export default TreatmentModal;

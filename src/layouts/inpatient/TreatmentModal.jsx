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

  //logged in staff
  const loggedInStaff = useSelector(selectStaff);

  //get the facility location
  const getFacilityLocationByStaffIdThroughShift = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      loggedInStaff.unit.name
    );
    const listOfWorkingStaff = response.data;

    let facility = listOfWorkingStaff.filter(
      (staff) => staff.staffId === loggedInStaff.staffId
    )[0];

    console.log(facility);

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
      setServices(servicesResponse.data);
      // console.log(servicesResponse.data)
      // console.log(selectedAppointment)
    } catch (error) {
      console.error("Error fetching medications and services:", error);
    }
  };

  useEffect(() => {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const startDateString = startMoment.format("YYYY-MM-DD HH:mm:ss");
    const endDateString = endMoment.format("YYYY-MM-DD HH:mm:ss");
    setStartDateString(startDateString);
    setEndDateString(endDateString);
    getFacilityLocationByStaffIdThroughShift();
    fetchServices();

    if (existingTreatment) {
      setComments(existingTreatment.comments);
      setSelectedService(existingTreatment.serviceItem.inventoryItemId);
    }
  }, []);

  useEffect(() => {
    if (selectedService) {
      console.log(selectedService);
    }
  }, [selectedService]);

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

  const handleAddServiceToPatient = (service) => {
    try {
      const patientId = selectedAdmission.patientId; // Replace with the actual patient ID
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
          //fetchPatientCart();
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

  const handleUpdateInpatientTreatment = () => {};

  const renderServicesDropdown = () => {
    return (
      <Box style={{ width: "100%" }}>
        <InputLabel id="medication-label"> Select Services</InputLabel>

        <Select
          onChange={(e) => setSelectedService(e.target.value)}
          style={{ width: "50%" }}
          sx={{ lineHeight: "3em" }}
          value={selectedService}
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
                {`${loggedInStaff.firstname} ${loggedInStaff.lastname} (${loggedInStaff.staffRoleEnum})`}
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                Location :
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h6" gutterBottom color="black">
                {facilityLocation !== null
                  ? facilityLocation
                  : "No Location Yet"}
              </MDTypography>
            </ListItem>
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

            <List>
              <ListItem>
                <MDTypography variant="h5" gutterBottom>
                  Services:
                </MDTypography>
              </ListItem>
              <ListItem>{renderServicesDropdown()}</ListItem>
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
                      color={existingTreatment.arrived ? "success" : "default"}
                      label={existingTreatment.arrived ? "Yes" : "No"}
                    />
                  </MDTypography>

                  {/* <ArrivalButton
                    arrived={existingTreatment.arrived}
                    selectedAdmission={existingTreatment}
                    handleUpdateAppointmentArrival={
                      handleUpdateInpatientTreatment
                    }
                    disableButton={loading}
                  /> */}
                </ListItem>
              </>
            )}

            {existingTreatment === null && (
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                <MDButton
                  size="large"
                  variant="gradient"
                  color="primary"
                  sx={{ width: "300px" }}
                  onClick={handleCreateInpatientTreatment}
                >
                  Create Inpatient Treatment
                </MDButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Modal>
    </>
  );
}

export default TreatmentModal;

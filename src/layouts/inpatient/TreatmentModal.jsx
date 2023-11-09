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

function TreatmentModal({
  openModal,
  handleCloseModal,
  selectedAdmission,
  startDate,
  endDate,
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [comments, setComments] = useState(null);
  const [location, setLocation] = useState("Ward B20");

  //logged in staff
  const loggedInStaff = useSelector(selectStaff);

  useEffect(() => {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const startDateString = startMoment.format("YYYY-MM-DD HH:mm:ss");
    const endDateString = endMoment.format("YYYY-MM-DD HH:mm:ss");
    setStartDateString(startDateString);
    setEndDateString(endDateString);
  }, []);

  const handleCreateInpatientTreatment = async () => {
    try {
      const admissionId = selectedAdmission.admissionId; // Replace with the actual patient ID
      const requestBody = {
        title: "Inpatient Treatment",
        quantity: 1,
        location: location,
        comments: comments,
        startDate: startDateString,
        endDate: endDateString,
        isCompleted: false,
        createdBy: `${loggedInStaff.firstname} ${loggedInStaff.lastname} (${loggedInStaff.staffRoleEnum})`,
      };

      const response = await medicationOrderApi.createInpatientTreatment(
        admissionId,
        requestBody
      );
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

  //   const handleConfirmDelete = async () => {
  //     try {
  //       await medicationOrderApi.deleteMedicationOrder(
  //         selectedItemId,
  //         selectedAdmission.admissionId
  //       );
  //       reduxDispatch(
  //         displayMessage({
  //           color: "success",
  //           icon: "notification",
  //           title: "Success",
  //           content: "Item has been deleted from the cart!",
  //         })
  //       );
  //       // fetchPatientCart();
  //       console.log("Before: " + medicationOrders);
  //       const updatedMedicationOrders = medicationOrders.filter(
  //         (item) => item.medicationOrderId !== selectedItemId
  //       );
  //       setMedicationOrders(updatedMedicationOrders);
  //       // fetchAdmission(selectedAdmission.admissionId);
  //       // getMedicationOrders(selectedAdmission.listOfMedicationOrderIds);
  //       console.log(selectedAdmission.listOfMedicationOrderIds);
  //     } catch (error) {
  //       reduxDispatch(
  //         displayMessage({
  //           color: "error",
  //           icon: "notification",
  //           title: "Error",
  //           content: error.response.data,
  //         })
  //       );
  //     }
  //     handleCloseDeleteDialog();
  //   };

  //   const handleConfirmComplete = async () => {
  //     try {
  //       await medicationOrderApi.updateComplete(
  //         selectedItemId,
  //         selectedAdmission.admissionId,
  //         isCompleted
  //       );
  //       reduxDispatch(
  //         displayMessage({
  //           color: "success",
  //           icon: "notification",
  //           title: "Success",
  //           content: "Medication order has been completed!",
  //         })
  //       );
  //       const updatedMedicationOrders = medicationOrders.map((item) =>
  //         item.medicationOrderId === selectedItemId
  //           ? { ...item, isCompleted: true }
  //           : item
  //       );
  //       setMedicationOrders(updatedMedicationOrders);
  //       // fetchPatientCart();
  //       // fetchAdmission(selectedAdmission.admissionId);
  //     } catch (error) {
  //       reduxDispatch(
  //         displayMessage({
  //           color: "error",
  //           icon: "notification",
  //           title: "Error",
  //           content: error.response.data,
  //         })
  //       );
  //     }
  //     handleCloseCompleteDialog();
  //   };

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
                Xiao Hu
              </MDTypography>
            </ListItem>
            <ListItem>
              <MDTypography variant="h5" gutterBottom>
                Location :
              </MDTypography>
            </ListItem>
            <ListItem>
              <Select
                sx={{ width: "500px", height: "40px" }}
                labelId="select-ward-class"
                value={0}
              >
                <MenuItem value={0}>Not Assigned</MenuItem>
                <MenuItem value={"B1"}>B1</MenuItem>
                <MenuItem value={"B2"}>B2</MenuItem>
                <MenuItem value={"C"}>C</MenuItem>
              </Select>
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
              >
                Create Inpatient Treatment
              </MDButton>
            </ListItem>
          </List>
        </Box>
      </Modal>
    </>
  );
}

export default TreatmentModal;

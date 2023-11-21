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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { calculateAge, parseDateArrUsingMoment } from "utility/Utility";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import {
  staffApi,
  inventoryApi,
  transactionItemApi,
  imageServerApi,
  appointmentApi,
  ehrApi,
  admissionApi,
} from "api/Api";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEHRRecord } from "store/slices/ehrSlice";
import ArrivalButton from "./ArrivalButton";
import { displayMessage } from "store/slices/snackbarSlice";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDBox from "components/MDBox";
import AddAttachmentButton from "./AddAttachmentButton";
import ViewAttachmentsButton from "./ViewAttachmentsButton";
import AdmissionDialog from "./AdmissionDialog";
import AssignAdmissionDialog from "./AssignAdmissionDialog";
import { useRef } from "react";
import moment from "moment";
import dayjs from "dayjs";
import DoctorAssignAdmissionDialog from "./DoctorAssignAdmissionDialog";
import ExtendAdmissionDialog from "./ExtendAdmissionDialog";

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

function AdmissionTicketModal({
  openModal,
  handleCloseModal,
  selectedAdmission,
  listOfWorkingStaff,
  handleUpdateAdmission,
  handleCancelAdmission,
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  //logged in staff
  const loggedInStaff = useSelector(selectStaff);

  const [listOfAssignedStaff, setListOfAssignedStaff] = useState([]);
  const [editableComments, setEditableComments] = useState("");
  const [commentsTouched, setCommentsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrived, setArrived] = useState(selectedAdmission.arrived);
  const [admissionDate, setAdmissionDate] = useState(null);
  const [dischargeDate, setDischargeDate] = useState(null);

  //dialog when click assign button
  const [assignDialog, setAssignDialog] = useState(false);

  //dialog when click cancel admission button
  const [cancelDialog, setCancelDialog] = useState(false);

  //dialog when click extend button
  const [extendDialog, setExtendDialog] = useState(false);

  //for fetching image
  const [profileImage, setProfileImage] = useState(null);

  //for inpatient cart
  const [cartItems, setCartItems] = useState([]);

  const handleGetProfileImage = async () => {
    if (selectedAdmission.patientProfilePicture !== null) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        selectedAdmission.patientProfilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      setProfileImage(imageURL);
    }
  };

  const getAssignedStaff = async () => {
    const staffPromises = selectedAdmission.listOfStaffsId.map((id) =>
      staffApi.getStaffByStaffId(id)
    );
    const staffResponse = await Promise.all(staffPromises);

    const listOfStaff = staffResponse.map((response) => response.data);
    //console.log(listOfStaff);
    setListOfAssignedStaff(listOfStaff);
  };

  const fetchPatientCart = async () => {
    try {
      const response = await transactionItemApi.getCartItems(
        selectedAdmission.patientId
      );

      console.log(response.data);

      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    console.log(selectedAdmission);
    handleGetProfileImage();
    getAssignedStaff();
    fetchPatientCart();
    let admissionDateTime = selectedAdmission.admissionDateTime;
    if (admissionDateTime.length > 6) {
      admissionDateTime.pop();
    }
    const admissionMoment = moment(admissionDateTime);
    admissionMoment.subtract(1, "months");
    setAdmissionDate(admissionMoment.format("YYYY-MM-DD HH:mm:ss"));
    const dischargeMoment = moment(selectedAdmission.dischargeDateTime);
    dischargeMoment.subtract(1, "months");
    setDischargeDate(dischargeMoment.format("YYYY-MM-DD HH:mm:ss"));
  }, [selectedAdmission]);

  const handleOpenCancelDialog = () => {
    setCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialog(false);
  };

  const cancelAdmission = async () => {
    await admissionApi.cancelAdmission(
      selectedAdmission.admissionId,
      loggedInStaff.unit.unitId
    );

    reduxDispatch(
      displayMessage({
        color: "success",
        icon: "notification",
        title: "Success",
        content: "Admission has been cancelled successfully!!",
      })
    );
    setCancelDialog(false);
    handleCancelAdmission(selectedAdmission.admissionId);
  };

  const handleOpenExtendDialog = () => {
    setExtendDialog(true);
  };

  const handleCloseExtendDialog = () => {
    setExtendDialog(false);
  };

  const handleConfirmExtendDialog = async (dischargeDate) => {
    const dischargeDateString = dayjs(dischargeDate).format(
      "YYYY-MM-DDT12:00:00"
    );
    const wardChargesTransactionItem = cartItems.filter(
      (item) => item.transactionItemDescription === "Ward Charges"
    )[0];

    const response = await admissionApi.updateDischargeDate(
      selectedAdmission.admissionId,
      dischargeDateString,
      wardChargesTransactionItem.transactionItemId
    );
    const updatedAdmission = { ...response.data };
    handleUpdateAdmission(updatedAdmission);

    reduxDispatch(
      displayMessage({
        color: "success",
        icon: "notification",
        title: "Update Success",
        content: "Patient's Admission has been extended",
      })
    );

    setExtendDialog(false);
  };

  const handleOpenAssignDialog = () => {
    if (!selectedAdmission.arrived && loggedInStaff.staffRoleEnum === "NURSE") {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Cannot assign a nurse to a patient who has not arrived",
        })
      );
      return;
    }

    setAssignDialog(true);
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
    setAssignDialog(false);
  };

  const handleConfirmAssignDialog = async (selectedStaffId, step) => {
    try {
      const response = await admissionApi.assignAdmissionToStaff(
        selectedAdmission.admissionId,
        selectedStaffId
      );

      //console.log(response.data);
      const updatedAdmission = { ...response.data };

      if (step === "2") {
        handleCancelAdmission(updatedAdmission.admissionId);
      } else {
        handleUpdateAdmission(updatedAdmission);
      }

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: "Admission has been updated successfully!!",
        })
      );
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

    setAssignDialog(false);
  };

  const handleUpdateAppointmentArrival = async () => {
    try {
      if (!selectedAdmission.listOfStaffsId.includes(loggedInStaff.staffId)) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Update Failed!",
            content: "Admission is not assigned to you",
          })
        );
        return;
      }

      const response = await admissionApi.updateAdmissionArrival(
        selectedAdmission.admissionId,
        !selectedAdmission.arrived,
        loggedInStaff.staffId
      );

      const updatedAdmission = { ...response.data };
      handleUpdateAdmission(updatedAdmission);

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Update Success",
          content: "Patient's Arrival Status is updated",
        })
      );
      //setArrived(!arrived);
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
  };

  const handleCommentsTouched = () => {
    setCommentsTouched(true);
  };

  const handleCommentsChange = (event) => {
    setEditableComments(event.target.value);
    if (!commentsTouched) {
      handleCommentsTouched();
    }
  };

  const handleUpdateComments = async () => {
    try {
      if (!selectedAdmission.listOfStaffsId.includes(loggedInStaff.staffId)) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Update Failed!",
            content: "Admission is not assigned to you",
          })
        );
        setEditableComments("");
        setCommentsTouched(false);
        return;
      }
      const response = await admissionApi.updateAdmissionComments(
        selectedAdmission.admissionId,
        editableComments,
        loggedInStaff.staffId
      );

      const updatedAdmission = { ...response.data };
      handleUpdateAdmission(updatedAdmission);

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
  };

  const handleClickToEhr = () => {
    // Can refactor to util
    console.log(selectedAdmission);
    const dateComponents = selectedAdmission.dateOfBirth;
    const [year, month, day, hours, minutes] = dateComponents;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateOfBirthFormatted = `${year}-${formattedMonth}-${formattedDay}T${String(
      hours
    ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    ehrApi
      .getElectronicHealthRecordByIdAndDateOfBirth(
        selectedAdmission.electronicHealthRecordId,
        dateOfBirthFormatted
      )
      .then((response) => {
        console.log(response);
        // ROUTE HERE
        response.data = {
          ...response.data,
          username: selectedAdmission.username,
          profilePicture: selectedAdmission.patientProfilePicture,
        };
        reduxDispatch(setEHRRecord(response.data));
        navigate("/ehr/ehrRecord");
      });
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
          {selectedAdmission && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <MDTypography
                    id="modal-modal-title"
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{ marginRight: "20px" }}
                  >
                    HH-{selectedAdmission.admissionId}:{" "}
                    {selectedAdmission.firstName} {selectedAdmission.lastName} (
                    {calculateAge(selectedAdmission?.dateOfBirth)}
                    {selectedAdmission.sex === "Male" ? "M" : "F"})
                  </MDTypography>
                  {!selectedAdmission.arrived &&
                    selectedAdmission.listOfStaffsId.includes(
                      loggedInStaff.staffId
                    ) && (
                      <MDButton
                        variant="gradient"
                        color="primary"
                        onClick={handleOpenCancelDialog}
                      >
                        Cancel Admission
                      </MDButton>
                    )}
                </Box>
                {selectedAdmission.patientProfilePicture !== null && (
                  <MDAvatar
                    src={profileImage}
                    alt="profile-image"
                    size="xxl"
                    shadow="xxl"
                    style={{ height: "150px", width: "150px" }}
                  />
                )}
                {selectedAdmission.patientProfilePicture === null && (
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
                    {`Ward ${selectedAdmission.ward}, Room ${selectedAdmission.room}, Bed ${selectedAdmission.bed}`}
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Admission Date :
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom color="black">
                    {admissionDate}
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Discharge Date :
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom color="black">
                    {dischargeDate}
                  </MDTypography>
                </ListItem>
                {loggedInStaff.staffRoleEnum === "DOCTOR" && (
                  <ListItem>
                    <MDTypography variant="h6" gutterBottom>
                      <MDButton
                        onClick={handleOpenExtendDialog}
                        color="primary"
                      >
                        Change Discharge Date
                      </MDButton>
                    </MDTypography>
                  </ListItem>
                )}
                <ListItem
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  <MDTypography variant="h5" gutterBottom>
                    Link to Electronic Health Record:
                  </MDTypography>
                  <MDBox>
                    <Stack direction="row" spacing={2}>
                      <AddAttachmentButton
                        selectedAdmission={selectedAdmission}
                      />
                      <ViewAttachmentsButton
                        selectedAdmission={selectedAdmission}
                      />
                    </Stack>
                  </MDBox>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom>
                    <MDButton
                      onClick={handleClickToEhr}
                      color="primary"
                      disabled={
                        !selectedAdmission.arrived ||
                        !selectedAdmission.listOfStaffsId.includes(
                          loggedInStaff.staffId
                        )
                      }
                    >
                      EHR
                    </MDButton>
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h5" gutterBottom>
                    Assigned Staff :
                  </MDTypography>
                  <MDButton
                    disabled={loading}
                    onClick={handleOpenAssignDialog}
                    variant="gradient"
                    color="primary"
                  >
                    {loggedInStaff.staffRoleEnum === "DOCTOR"
                      ? "Assign"
                      : selectedAdmission.listOfStaffsId.includes(
                          loggedInStaff.staffId
                        )
                      ? "Reassign"
                      : "Assign"}
                  </MDButton>
                </ListItem>
                {listOfAssignedStaff.map((staff) => (
                  <ListItem>
                    <MDTypography variant="h6" gutterBottom color="black">
                      {`${staff.firstname} ${staff.lastname} (${staff.staffRoleEnum})`}
                    </MDTypography>
                  </ListItem>
                ))}

                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Arrival Status:
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom>
                    <Chip
                      color={selectedAdmission.arrived ? "success" : "default"}
                      label={selectedAdmission.arrived ? "Yes" : "No"}
                    />
                  </MDTypography>
                  {loggedInStaff.staffRoleEnum === "ADMIN" && (
                    <ArrivalButton
                      arrived={selectedAdmission.arrived}
                      selectedAdmission={selectedAdmission}
                      handleUpdateAppointmentArrival={
                        handleUpdateAppointmentArrival
                      }
                      disableButton={loading}
                    />
                  )}
                </ListItem>

                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Reason:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <textarea
                    readOnly
                    value={selectedAdmission.reason}
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
                    value={selectedAdmission.comments}
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
                {selectedAdmission.listOfStaffsId.includes(
                  loggedInStaff.staffId
                ) && (
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
                )}
                {selectedAdmission.listOfStaffsId.includes(
                  loggedInStaff.staffId
                ) && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <MDButton
                      disabled={
                        !commentsTouched ||
                        loading ||
                        !selectedAdmission.arrived
                      }
                      onClick={handleUpdateComments}
                      variant="gradient"
                      color="primary"
                    >
                      Save Comments
                    </MDButton>
                  </Box>
                )}
              </List>
              <List>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Patient's Items:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  {" "}
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
                              {" "}
                              Quantity: {item.transactionItemQuantity}
                            </TableCell>
                            {/* <TableCell align="right">
                              <Button
                                variant="contained"
                                style={{
                                  backgroundColor: "#f44336",
                                  color: "white",
                                }}
                                onClick={() =>
                                  handleDeleteCartItem(item.transactionItemId)
                                }
                              >
                                Delete
                              </Button>
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </>
          )}
          <Dialog
            open={cancelDialog}
            onClose={handleCloseCancelDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to cancel this admission?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action is irreversible. The patient will have to get
                another appointment in order to be admitted again.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCancelDialog}>Disagree</Button>
              <Button onClick={cancelAdmission}>Agree</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Modal>
      {loggedInStaff.staffRoleEnum === "DOCTOR" ? (
        <DoctorAssignAdmissionDialog
          open={assignDialog}
          onConfirm={handleConfirmAssignDialog}
          onClose={handleCloseAssignDialog}
          listOfWorkingStaff={listOfWorkingStaff}
          listOfAssignedStaff={listOfAssignedStaff}
        />
      ) : (
        <AssignAdmissionDialog
          open={assignDialog}
          onConfirm={handleConfirmAssignDialog}
          onClose={handleCloseAssignDialog}
          listOfWorkingStaff={listOfWorkingStaff}
          listOfAssignedStaff={listOfAssignedStaff}
        />
      )}
      <ExtendAdmissionDialog
        open={extendDialog}
        onConfirm={handleConfirmExtendDialog}
        onClose={handleCloseExtendDialog}
        originalDischargeDate={selectedAdmission.dischargeDateTime}
      />
    </>
  );
}

export default AdmissionTicketModal;

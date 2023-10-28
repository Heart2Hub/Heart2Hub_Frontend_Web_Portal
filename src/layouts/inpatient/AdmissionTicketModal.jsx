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
import { calculateAge } from "utility/Utility";
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
  selectedAppointment,
  listOfWorkingStaff,
  forceRefresh,
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [assignedStaff, setAssignedStaff] = useState(null);
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [assignedNurse, setAssignedNurse] = useState(null);
  const [assignedAdmin, setAssignedAdmin] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [editableComments, setEditableComments] = useState("");
  const [commentsTouched, setCommentsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrived, setArrived] = useState(selectedAppointment.arrived);

  //for assigning appointment to staff in the AppointmentTicketModal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleToAssign, setRoleToAssign] = useState();

  //for cancelling admission
  const [cancelDialog, setCancelDialog] = useState(false);

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

  const handleCommentsChange = (event) => {
    setEditableComments(event.target.value);
    if (!commentsTouched) {
      handleCommentsTouched();
    }
  };

  const getAssignedDoctorName = async (doctorId) => {
    const response = await staffApi.getStaffByStaffId(doctorId);
    console.log(response.data);
    setAssignedDoctor(response.data);
  };

  const getAssignedNurseName = async (nurseId) => {
    const response = await staffApi.getStaffByStaffId(nurseId);
    setAssignedNurse(response.data);
  };

  const getAssignedAdminName = async (adminId) => {
    const response = await staffApi.getStaffByStaffId(adminId);
    setAssignedAdmin(response.data);
  };

  const handleUpdateAppointmentArrival = async () => {
    setLoading(true);

    try {
      const response = await admissionApi.updateAdmissionArrival(
        selectedAppointment.admissionId,
        !selectedAppointment.arrived,
        loggedInStaff.staffId
      );
      let updatedAppointment = response.data;

      //update the old appt
      //   replaceItemByIdWithUpdated(
      //     updatedAppointment.appointmentId,
      //     columnName,
      //     updatedAppointment
      //   );

      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Update Success",
          content: "Patient's Arrival Status is updated",
        })
      );
      setArrived(!arrived);
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
      //   replaceItemByIdWithUpdated(
      //     updatedAppointment.appointmentId,
      //     columnName,
      //     updatedAppointment
      //   );

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

  const handleOpenAssignNurseDialog = () => {
    if (!arrived) {
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
    setIsDialogOpen(true);
    setRoleToAssign("NURSE");
  };

  const handleOpenAssignAdminDialog = () => {
    setIsDialogOpen(true);
    setRoleToAssign("ADMIN");
  };

  //has its own set of logic for assignAppointmentDialog to not clash with the drag and drop version
  const handleConfirmAssignDialog = async (selectedStaffId, roleToAssign) => {
    // if (selectedStaffId === 0) {
    //   reduxDispatch(
    //     displayMessage({
    //       color: "warning",
    //       icon: "notification",
    //       title: "Error",
    //       content: "Please select a staff to assign!",
    //     })
    //   );
    //   return;
    // }

    try {
      //send to BE to assign staff

      if (roleToAssign === "NURSE") {
        await admissionApi.assignAdmissionToNurse(
          selectedAppointment.admissionId,
          selectedStaffId,
          loggedInStaff.staffId
        );
      } else {
        await admissionApi.assignAdmissionToAdmin(
          selectedAppointment.admissionId,
          selectedStaffId,
          loggedInStaff.staffId
        );
      }

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
    if (selectedAppointment.assignedDoctorId) {
      getAssignedDoctorName(selectedAppointment.assignedDoctorId);
    }
    if (selectedAppointment.assignedNurseId) {
      getAssignedNurseName(selectedAppointment.assignedNurseId);
    }
    if (selectedAppointment.assignedAdminId) {
      getAssignedAdminName(selectedAppointment.assignedAdminId);
    }

    handleGetProfileImage();
    console.log(selectedAppointment);
  }, [selectedAppointment, listOfWorkingStaff]);

  const handleOpenCancelDialog = () => {
    setCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialog(false);
  };

  const handleCancelAdmission = async () => {
    await admissionApi.cancelAdmission(
      selectedAppointment.admissionId,
      loggedInStaff.unit.unitId
    );
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
    setCancelDialog(false);
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
                <Box sx={{ display: "flex" }}>
                  <MDTypography
                    id="modal-modal-title"
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{ marginRight: "20px" }}
                  >
                    HH-{selectedAppointment.admissionId}:{" "}
                    {selectedAppointment.firstName}{" "}
                    {selectedAppointment.lastName} (
                    {calculateAge(selectedAppointment?.dateOfBirth)}
                    {selectedAppointment.sex === "Male" ? "M" : "F"})
                  </MDTypography>
                  {arrived ? null : (
                    <MDButton
                      variant="gradient"
                      color="primary"
                      onClick={handleOpenCancelDialog}
                    >
                      Cancel Admission
                    </MDButton>
                  )}
                </Box>
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
                    {assignedAdmin
                      ? `Ward ${assignedAdmin.unit.name}, Room ${selectedAppointment.room}, Bed ${selectedAppointment.bed}`
                      : "No Location Yet"}
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h5" gutterBottom>
                    Link to Electronic Health Record:
                  </MDTypography>
                  {/* <MDBox>
                    <Stack direction="row" spacing={2}>
                      <AddAttachmentButton
                        selectedAppointment={selectedAppointment}
                      />
                      <ViewAttachmentsButton
                        selectedAppointment={selectedAppointment}
                      />
                    </Stack>
                  </MDBox> */}
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom>
                    <MDButton
                      onClick={handleClickToEhr}
                      color="primary"
                      //TODO
                      disabled
                    >
                      EHR
                    </MDButton>
                  </MDTypography>
                </ListItem>
                {/* <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Attending Doctor :
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom color="black">
                    {assignedDoctor
                      ? `Dr. ${assignedDoctor.firstname} ${assignedDoctor.lastname}`
                      : "No Attending Doctor"}
                  </MDTypography>
                  <MDButton
                    disabled={loading}
                    onClick={handleOpenAssignDialog}
                    variant="gradient"
                    color="primary"
                  >
                    Assign Doctor
                  </MDButton>
                </ListItem> */}
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Attending Nurse :
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom color="black">
                    {assignedNurse
                      ? `${assignedNurse.firstname} ${assignedNurse.lastname}`
                      : "No Attending Nurse"}
                  </MDTypography>
                  <MDButton
                    disabled={loading}
                    onClick={handleOpenAssignNurseDialog}
                    variant="gradient"
                    color="primary"
                  >
                    Assign Nurse
                  </MDButton>
                </ListItem>
                <ListItem>
                  <MDTypography variant="h5" gutterBottom>
                    Attending Admin :
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" gutterBottom color="black">
                    {assignedAdmin
                      ? `${assignedAdmin.firstname} ${assignedAdmin.lastname}`
                      : "No Attending Admin"}
                  </MDTypography>
                  <MDButton
                    disabled={loading}
                    onClick={handleOpenAssignAdminDialog}
                    variant="gradient"
                    color="primary"
                  >
                    Assign Admin
                  </MDButton>
                </ListItem>
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
                      color={arrived ? "success" : "default"}
                      label={arrived ? "Yes" : "No"}
                    />
                  </MDTypography>
                  <ArrivalButton
                    arrived={arrived}
                    selectedAppointment={selectedAppointment}
                    handleUpdateAppointmentArrival={
                      handleUpdateAppointmentArrival
                    }
                    disableButton={loading}
                  />
                </ListItem>

                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Reason:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <textarea
                    readOnly
                    value={selectedAppointment.reason}
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
              <Button onClick={handleCancelAdmission}>Agree</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Modal>
      <AssignAdmissionDialog
        open={isDialogOpen}
        onConfirm={handleConfirmAssignDialog}
        onClose={handleCloseAssignDialog}
        listOfWorkingStaff={listOfWorkingStaff}
        selectedAppointmentToAssign={selectedAppointment}
        roleToAssign={roleToAssign}
      />
    </>
  );
}

export default AdmissionTicketModal;

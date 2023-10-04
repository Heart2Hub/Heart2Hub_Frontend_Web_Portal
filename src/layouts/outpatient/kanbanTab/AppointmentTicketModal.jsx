import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton,
  Stack,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { calculateAge } from "utility/Utility";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import { staffApi } from "api/Api";

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
import { IMAGE_SERVER } from "constants/RestEndPoint";
import MDBox from "components/MDBox";
import AddAttachmentButton from "./AddAttachmentButton";
import ViewAttachmentsButton from "./ViewAttachmentsButton";

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

  //for assigning appointment to staff in the AppointmentTicketModal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [assigningToSwimlane, setAssigningToSwimlane] = useState("");

  //logged in staff
  const loggedInStaff = useSelector(selectStaff);

  const handleCommentsTouched = () => {
    setCommentsTouched(true);
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
        selectedStaffId
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
          profilePicture: selectedAppointment.profilePicture,
        };
        reduxDispatch(setEHRRecord(response));
        navigate("/ehr/ehrRecord");
      });
  };

  useEffect(() => {
    if (selectedAppointment.currentAssignedStaffId !== null) {
      getAssignedStaffName(selectedAppointment.currentAssignedStaffId);
      setFacilityLocation(
        getFacilityLocationByStaffIdThroughShift(
          selectedAppointment.currentAssignedStaffId
        )
      );
    }
    // setAssigningToSwimlane(columnName);
  }, [selectedAppointment, listOfWorkingStaff]);

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
                    src={
                      IMAGE_SERVER +
                      "/images/id/" +
                      selectedAppointment.patientProfilePicture
                    }
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
                  <ListItemText primary="Location:" secondary={""} />
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom>
                    {facilityLocation !== null
                      ? facilityLocation
                      : "No Location Yet"}
                  </MDTypography>
                </ListItem>
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ListItemText
                    primary="Link to Electronic Health Record:"
                    secondary={""}
                  />
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
                    <MDButton onClick={handleClickToEhr} color="primary">
                      EHR
                    </MDButton>
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Assigned To:" secondary={""} />
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
                <ListItem>
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
                </ListItem>
                <ListItem>
                  <ListItemText primary="Arrival Status:" secondary="" />
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
              </List>
            </>
          )}
        </Box>
      </Modal>
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

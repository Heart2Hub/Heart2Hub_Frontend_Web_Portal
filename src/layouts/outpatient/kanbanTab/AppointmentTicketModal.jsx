import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
  Chip,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { calculateAge } from "utility/Utility";
import MDAvatar from "components/MDAvatar";
import { staffApi } from "api/Api";
import ArrivalButton from "./ArrivalButton";
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { appointmentApi } from "../../../api/Api";
import MDButton from "components/MDButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
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
}) {
  const [assignedStaff, setAssignedStaff] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [editableComments, setEditableComments] = useState(
    selectedAppointment.comments
  );
  const [commentsTouched, setCommentsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const reduxDispatch = useDispatch();

  // console.log(selectedAppointment);

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
    //set loading true
    setLoading(true);

    try {
      const response = await appointmentApi.updateAppointmentArrival(
        selectedAppointment.appointmentId,
        !selectedAppointment.arrived
      );
      let updatedAppointment = response.data;
      console.log(updatedAppointment);

      //update the old appt
      replaceItemByIdWithUpdated(
        updatedAppointment.appointmentId,
        "Registration",
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
    } catch (ex) {
      //handle error message and success message display
      console.log(ex);
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Update Failed!",
          content: ex,
        })
      );
    }
    setLoading(false);
  };

  const handleUpdateComments = async () => {
    //set loading true
    setLoading(true);

    try {
      const response = await appointmentApi.updateAppointmentComments(
        selectedAppointment.appointmentId,
        editableComments
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
    } catch (ex) {
      //handle error message and success message display
      console.log(ex);
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Update Failed!",
          content: ex,
        })
      );
    }
    setLoading(false);
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
    setEditableComments(selectedAppointment.comments);
  }, [selectedAppointment.comments, listOfWorkingStaff]);

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
                  alignItems: "center", // To align items vertically center
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
                  ({calculateAge(selectedAppointment.dateOfBirth)}
                  {selectedAppointment.sex === "Male" ? "M" : "F"})
                </MDTypography>
                <MDAvatar
                  src={
                    ""
                    // IMAGE_SERVER + "/images/id/" + staff.profilePicture?.imageLink
                  }
                  alt="profile-image"
                  size="xxl"
                  shadow="xxl"
                  style={{ height: "150px", width: "150px" }}
                />
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
                <ListItem>
                  <ListItemText
                    primary="Link to Electronic Health Record:"
                    secondary={""}
                  />
                </ListItem>
                <ListItem>
                  <MDTypography variant="h6" gutterBottom>
                    xxx
                  </MDTypography>
                </ListItem>

                <ListItem>
                  <ListItemText primary="Assigned To:" secondary={""} />
                </ListItem>
                <ListItem>
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
                {/* <ListItem style={{ width: "40%" }}> */}
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
                  {columnName === "Registration" && (
                    <ArrivalButton
                      selectedAppointment={selectedAppointment}
                      handleUpdateAppointmentArrival={
                        handleUpdateAppointmentArrival
                      }
                      disableButton={loading}
                    />
                  )}
                </ListItem>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Description:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <TextareaAutosize
                    readOnly
                    rowsmin={3}
                    value={selectedAppointment.description}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      borderColor: "gainsboro",
                      borderRadius: "6px",
                      fontFamily: "Arial",
                      padding: "10px",
                      fontSize: "15px",
                    }}
                  />
                </ListItem>
                <ListItem sx={{ marginTop: "10px" }}>
                  <MDTypography variant="h5" gutterBottom>
                    Comments:
                  </MDTypography>
                </ListItem>
                <ListItem>
                  <TextareaAutosize
                    rowsmin={3}
                    value={editableComments}
                    onChange={handleCommentsChange}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      borderColor: "gainsboro",
                      borderRadius: "6px",
                      fontFamily: "Arial",
                      padding: "10px",
                      fontSize: "15px",
                    }}
                  />
                </ListItem>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <MDButton
                    disabled={!commentsTouched || loading}
                    onClick={handleUpdateComments}
                  >
                    Save Comments
                  </MDButton>
                </Box>
              </List>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default AppointmentTicketModal;
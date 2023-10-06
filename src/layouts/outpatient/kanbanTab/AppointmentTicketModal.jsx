import React, { useEffect, useState, useRef } from "react";
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
import MDButton from "components/MDButton";
import { staffApi } from "api/Api";

import { ehrApi } from "api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEHRRecord } from "../../../store/slices/ehrSlice";

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
}) {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [assignedStaff, setAssignedStaff] = useState(null);
  console.log(selectedAppointment);

  const getAssignedStaffName = async (staffId) => {
    let today = new Date();
    // need plus 1 since month starts with 0
    const response = await staffApi.getStaffByStaffId(staffId);
    setAssignedStaff(setAssignedStaff(response.data));
    // console.log(response);
    // setAppointments(response.data);
    // setRegistration(response.data);
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
      getAssignedStaffName();
    }
  }, []);

  return (
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
                {selectedAppointment.firstName} {selectedAppointment.lastName} (
                {calculateAge(selectedAppointment.dateOfBirth)}
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
                  xxx
                </MDTypography>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Link to Electronic Health Record:"
                  secondary={""}
                />
              </ListItem>
              <ListItem>
                <MDButton onClick={handleClickToEhr} color="primary">
                  EHR
                </MDButton>
              </ListItem>

              <ListItem>
                <ListItemText primary="Assigned To:" secondary={""} />
              </ListItem>
              <ListItem>
                <MDTypography variant="h6" gutterBottom>
                  {assignedStaff === null
                    ? "No Staff Assigned"
                    : assignedStaff.firstName +
                      " " +
                      assignedStaff.lastName +
                      " (" +
                      assignedStaff.staffRoleEnum +
                      ")"}{" "}
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
              <ListItem>
                <ListItemText primary="Arrival Status:" secondary="" />
              </ListItem>
              <ListItem>
                <MDTypography variant="h6" gutterBottom>
                  {selectedAppointment.arrived ? "Yes" : "No"}
                </MDTypography>
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
                  readOnly
                  rowsmin={3}
                  value={selectedAppointment.comments}
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
            </List>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default AppointmentTicketModal;

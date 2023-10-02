import React from "react";
import {
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { maskNric } from "utility/Utility";
import { parseDateFromLocalDateTime } from "utility/Utility";
import { calculateAge } from "utility/Utility";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

function ViewAppointmentModal({
  openModal,
  handleCloseModal,
  selectedAppointment,
}) {
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
            <MDTypography id="modal-modal-title" variant="h3" gutterBottom>
              Appointment Ticket {"HH-" + selectedAppointment.appointmentId}
            </MDTypography>

            <List>
              <ListItem>
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="First Name"
                  secondary={selectedAppointment.firstName}
                />
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Last Name"
                  secondary={selectedAppointment.lastName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="NRIC"
                  secondary={maskNric(selectedAppointment.nric)}
                />
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Sex"
                  secondary={selectedAppointment.sex}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Place of Birth"
                  secondary={selectedAppointment.placeOfBirth}
                />
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Date Of Birth"
                  secondary={
                    parseDateFromLocalDateTime(
                      selectedAppointment.dateOfBirth
                    ).toLocaleDateString() +
                    " (" +
                    calculateAge(selectedAppointment.dateOfBirth) +
                    " Years Old)"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Contact Number"
                  secondary={selectedAppointment.contactNumber}
                />
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Nationality"
                  secondary={selectedAppointment.nationality}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Appointment Date"
                  secondary={parseDateFromLocalDateTime(
                    selectedAppointment.actualDateTime
                  ).toLocaleDateString()}
                />
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Appointment Time"
                  secondary={parseDateFromLocalDateTime(
                    selectedAppointment.actualDateTime
                  ).toLocaleTimeString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Appointment Booked Date"
                  secondary={parseDateFromLocalDateTime(
                    selectedAppointment.bookedDateTime
                  ).toLocaleDateString()}
                />
                <ListItemText
                  sx={{ width: "50%" }}
                  primary="Appointment Booked Time"
                  secondary={parseDateFromLocalDateTime(
                    selectedAppointment.bookedDateTime
                  ).toLocaleTimeString()}
                />
              </ListItem>

              <ListItem>
                <MDTypography id="modal-modal-title" variant="h5" gutterBottom>
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
                    minHeight: "150px",
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

export default ViewAppointmentModal;

import React from "react";
import { Modal, Box, List, ListItem, ListItemText } from "@mui/material";
import MDTypography from "components/MDTypography";
import { maskNric } from "utility/Utility";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
            <MDTypography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Appointment Details
            </MDTypography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Appointment ID"
                  secondary={selectedAppointment.appointmentId}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Description"
                  secondary={selectedAppointment.description}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Comments"
                  secondary={selectedAppointment.comments}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Actual Date & Time"
                  secondary={selectedAppointment.actualDateTime}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Booked Date & Time"
                  secondary={selectedAppointment.bookedDateTime}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Estimated Duration"
                  secondary={selectedAppointment.estimatedDuration}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Priority"
                  secondary={selectedAppointment.priorityEnum}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="First Name"
                  secondary={selectedAppointment.firstName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Name"
                  secondary={selectedAppointment.lastName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="NRIC"
                  secondary={maskNric(selectedAppointment.nric)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Place of Birth"
                  secondary={selectedAppointment.placeOfBirth}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Sex"
                  secondary={selectedAppointment.sex}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact Number"
                  secondary={selectedAppointment.contactNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Nationality"
                  secondary={selectedAppointment.nationality}
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

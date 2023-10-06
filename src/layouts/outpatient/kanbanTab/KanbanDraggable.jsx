import {
  Avatar,
  Typography,
  Card,
  CardContent,
  Button,
  ButtonBase,
} from "@mui/material";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./kanbanStyles.css";
import MDTypography from "components/MDTypography";
import AppointmentTicketModal from "./AppointmentTicketModal";
import { useState } from "react";
import MDAvatar from "components/MDAvatar";

function KanbanDraggable({
  appointment,
  index,
  replaceItemByIdWithUpdated,
  columnName,
  listOfWorkingStaff,
  forceRefresh,
}) {
  const [openModal, setOpenModal] = useState(false);
  // const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Draggable
        draggableId={`${appointment.appointmentId}`}
        key={appointment.appointmentId}
        index={index}
      >
        {(provided, snapshot) => (
          <ButtonBase
            key={appointment.appointmentId}
            style={{ width: "100%", marginBottom: "10px" }}
            onClick={() => setOpenModal(true)}
          >
            <Card
              className={`draggable-container ${
                snapshot.isDragging ? "dragging" : ""
              }`}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              elevation={3}
              raised={true}
            >
              <CardContent>
                <div className="draggable-icons">
                  <MDTypography variant="h5" className="draggable-id">
                    HH-{appointment.appointmentId}
                  </MDTypography>
                  {/* <Button onClick={() => setOpenModal(true)}>View</Button> */}
                </div>

                <Typography variant="body2" className="draggable-description">
                  {appointment.birthday}
                </Typography>
                <div className="draggable-icons">
                  <Typography variant="subtitle2" className="avatar-left">
                    {appointment.firstName +
                      " " +
                      appointment.lastName +
                      " (" +
                      appointment.sex +
                      ")"}
                  </Typography>
                  <MDAvatar
                    size="xl"
                    className="avatar-right"
                    src={
                      "https://joesch.moe/api/v1/random?key=" +
                      appointment.appointmentId
                    }
                  />
                </div>
              </CardContent>
              {provided.placeholder}
            </Card>
          </ButtonBase>
        )}
      </Draggable>
      <AppointmentTicketModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedAppointment={appointment}
        replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
        columnName={columnName}
        listOfWorkingStaff={listOfWorkingStaff}
        forceRefresh={forceRefresh}
      />
    </>
  );
}

export default KanbanDraggable;

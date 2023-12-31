import {
  Typography,
  Card,
  CardContent,
  ButtonBase,
  Skeleton,
} from "@mui/material";
import React, { useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./inpatient.css";
import MDTypography from "components/MDTypography";
import AppointmentTicketModal from "./AppointmentTicketModal";
import { useState } from "react";
import MDAvatar from "components/MDAvatar";
import { truncateText } from "utility/Utility";
import { imageServerApi } from "api/Api";
import ScheduleAdmissionModal from "./ScheduleAdmissionModal";

function KanbanDraggable({
  appointment,
  index,
  replaceItemByIdWithUpdated,
  columnName,
  listOfWorkingStaff,
  forceRefresh,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleGetProfileImage = async () => {
    if (appointment.patientProfilePicture !== null) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        appointment.patientProfilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      setProfileImage(imageURL);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  useEffect(() => {
    handleGetProfileImage();
  }, [appointment]);

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
            onClick={() => handleOpenModal(appointment)}
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
                </div>

                <Typography variant="body2" className="draggable-description">
                  {appointment.birthday}
                </Typography>
                <div className="draggable-icons">
                  <Typography
                    variant="subtitle2"
                    className="avatar-left"
                    sx={{ textAlign: "left" }}
                  >
                    {truncateText(
                      appointment.firstName + " " + appointment.lastName,
                      14
                    )}
                    <br />
                    {"(" + appointment.sex + ")"}
                  </Typography>
                  {appointment.patientProfilePicture === null && (
                    <Skeleton
                      className="avatar-right"
                      variant="circular"
                      style={{ height: "50px", width: "50px" }}
                    />
                  )}
                  {appointment.patientProfilePicture !== null && (
                    <MDAvatar
                      size="xl"
                      className="avatar-right"
                      src={profileImage}
                      alt={"Loading"}
                    />
                  )}
                </div>
              </CardContent>
              {provided.placeholder}
            </Card>
          </ButtonBase>
        )}
      </Draggable>
      {selectedAppointment && columnName !== "Registration" && (
        <AppointmentTicketModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedAppointment={appointment}
          replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
          columnName={columnName}
          listOfWorkingStaff={listOfWorkingStaff}
          forceRefresh={forceRefresh}
        />
      )}
      {selectedAppointment && columnName === "Registration" && (
        <ScheduleAdmissionModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedAppointment={appointment}
          replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
          columnName={columnName}
          listOfWorkingStaff={listOfWorkingStaff}
          forceRefresh={forceRefresh}
        />
      )}
    </>
  );
}

export default KanbanDraggable;

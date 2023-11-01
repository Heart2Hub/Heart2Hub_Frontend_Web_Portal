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
import AdmissionTicketModal from "./AdmissionTicketModal";

function AdmissionCard({
  appointment,
  listOfWorkingStaff,
  forceRefresh,
  handleSelectAdmission,
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
      <ButtonBase
        key={appointment.admissionId}
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => handleSelectAdmission(appointment)}
      >
        <Card
          // className={`draggable-container ${
          //   snapshot.isDragging ? "dragging" : ""
          // }`}
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
          // ref={provided.innerRef}
          elevation={3}
          raised={true}
        >
          <CardContent>
            <div className="draggable-icons">
              <MDTypography variant="h5" className="draggable-id">
                Bed {appointment.bed}
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
                {appointment.duration
                  ? truncateText(
                      appointment.firstName + " " + appointment.lastName,
                      14
                    )
                  : "Vacant"}
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
        </Card>
      </ButtonBase>

      {/* {selectedAppointment && (
        <AdmissionTicketModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedAppointment={appointment}
          listOfWorkingStaff={listOfWorkingStaff}
          forceRefresh={forceRefresh}
        />
      )} */}
    </>
  );
}

export default AdmissionCard;

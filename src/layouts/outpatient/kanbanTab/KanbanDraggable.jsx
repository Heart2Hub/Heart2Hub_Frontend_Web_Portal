import {
  Typography,
  Card,
  CardContent,
  ButtonBase,
  Skeleton,
} from "@mui/material";
import React, { useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./kanbanStyles.css";
import MDTypography from "components/MDTypography";
import AppointmentTicketModal from "./AppointmentTicketModal";
import { useState } from "react";
import MDAvatar from "components/MDAvatar";
import { truncateText } from "utility/Utility";
import { imageServerApi } from "../../../api/Api";
import ScheduleAdmissionModal from "./ScheduleAdmissionModal";
import { parseDateFromLocalDateTime } from "utility/Utility";

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

  // async function getTimeDifferenceFromAPI(appointmentId) {
  //   try {
  //     const response = await appointmentApi.findAppointmentTimeDiff(
  //       appointmentId
  //     );

  //     console.log(response.data);
  //     return response.data; // Assuming the API returns the time difference in minutes
  //   } catch (error) {
  //     console.error("Error fetching time difference from API:", error);
  //     return 0; // Default to 0 in case of an error
  //   }
  // }

  // //const timeDifference = getTimeDifferenceFromAPI(appointment.appointmentId);
  // console.log(appointment.appointmentId + " :" + timeDifference)

  const getPriorityColor = (appointment) => {
    if (appointment.actualDateTime === null || appointment.arrived) return "green"
    if (!appointment.arrived) {
      const apptDate = parseDateFromLocalDateTime(appointment.actualDateTime);
      let timeDiff = (new Date().getHours()*60 + new Date().getMinutes()) - (apptDate.getHours()*60 + apptDate.getMinutes())

      if (timeDiff >= 40) {
        return "red"
      } else if (timeDiff >= 20) {
        return "orange"
      } else {
        return "green"
      }
    }
  };

  //let priorityColor = getPriorityColor(appointment, timeDifference);
  // console.log(appointment.appointmentId)

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  useEffect(() => {
    // async function fetchTimeDifference() {
    //   const difference = await getTimeDifferenceFromAPI(
    //     appointment.appointmentId
    //   );
    //   setTimeDifference(difference);
    //   const priorityColor2 = getPriorityColor(appointment, difference);
    //   priorityColor.current = priorityColor2;
    // }
    // fetchTimeDifference();
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
              // style={{ borderLeft: `6px solid red` }}
            >
              <CardContent>
                <div className="draggable-icons">
                  <MDTypography variant="h5" className="draggable-id">
                    HH-{appointment.appointmentId}&nbsp;
                    <span 
                    style={{ height: "12px", 
                      width: "12px", 
                      backgroundColor: getPriorityColor(appointment), 
                      borderRadius: "50%", 
                      display: "inline-block"}}></span>
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
      {selectedAppointment && columnName !== "Admission" && (
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
      {selectedAppointment && columnName === "Admission" && (
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

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

function NoAdmissionCard({ admission }) {
  return (
    <Card
      // className={`draggable-container ${
      //   snapshot.isDragging ? "dragging" : ""
      // }`}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // ref={provided.innerRef}
      elevation={3}
      raised={true}
      sx={{ height: "100%" }}
    >
      <CardContent>
        <div className="draggable-icons">
          <MDTypography variant="h5" className="draggable-id">
            Bed {admission.bed}
          </MDTypography>
        </div>

        <div className="draggable-icons">
          <Typography
            variant="subtitle2"
            className="avatar-left"
            sx={{ textAlign: "left" }}
          >
            Vacant
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default NoAdmissionCard;

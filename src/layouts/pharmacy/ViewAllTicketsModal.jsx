import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  CardContent,
  Card,
  CardActions,
  Skeleton,
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import { calculateAge } from "utility/Utility";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import {
  staffApi,
  inventoryApi,
  transactionItemApi,
  imageServerApi,
} from "api/Api";

import { ehrApi } from "api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEHRRecord } from "store/slices/ehrSlice";
import ArrivalButton from "../outpatient/kanbanTab/ArrivalButton";
import { displayMessage } from "store/slices/snackbarSlice";
import { appointmentApi } from "api/Api";
import AssignAppointmentDialog from "../outpatient/kanbanTab/AssignAppointmentDialog";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDBox from "components/MDBox";
import AddAttachmentButton from "../outpatient/kanbanTab/AddAttachmentButton";
import ViewAttachmentsButton from "../outpatient/kanbanTab/ViewAttachmentsButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "#bfbfbf",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

function ViewAllTicketsModal({
  openModal,
  handleOpenModal,
  handleCloseModal,
  appointmentList
}) {

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, maxHeight: "80vh", overflow: "auto" }}>
          {appointmentList.map((ticket,index) => 
          <>
            {index === 0 ? 
            <>
              <Typography>
                <b>Next in Queue:</b>
              </Typography><br/>
            </> : null}
            <Card sx={{
              width: "325px",
          }}>
              <CardContent>
                  <Typography variant="h5" component="div">
                  HH-{ticket.appointmentId}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {ticket.firstName + " " + ticket.lastName}
                  </Typography>
                  <Typography variant="body2">
                  From {ticket.departmentName}
                  </Typography>
              </CardContent>
              <CardActions sx={{ display: 'flex'}}>
                  <Button 
                      size="small"
                      onClick={() => handleOpenModal(ticket)}>
                      View
                  </Button>
              </CardActions>
          </Card><br/>
          </>)}
        </Box>
      </Modal>
    </>
  );
}

export default ViewAllTicketsModal;

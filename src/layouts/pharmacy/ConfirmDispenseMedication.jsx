import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
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
  TableRow,
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
  appointmentApi,
} from "api/Api";
import { useDispatch } from "react-redux";
import { displayMessage } from "store/slices/snackbarSlice";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

function ConfirmDispenseMedicationModal({
  openModal,
  handleCloseModal,
  appointment,
  cart,
  forceRefresh
}) {

  const reduxDispatch = useDispatch();
  const staff = useSelector(selectStaff);

  const handleConfirm = async () => {
    try {
        const response = await appointmentApi.updateAppointmentDispensaryStatus(appointment.appointmentId, "DISPENSED");
        const responseSwimlane = await appointmentApi.updateAppointmentSwimlaneStatus(
          appointment.appointmentId,
          "Discharge"
      )
        //send to BE to assign staff
        const responseAssign = await appointmentApi.assignAppointmentToStaff(
            appointment.appointmentId,
            -1,
            staff.staffId
        );
        forceRefresh();
        reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Success",
              content: `Medication for HH-${appointment.appointmentId} has been dispensed.`,
            })
          );
          handleCloseModal();
      } catch (error) {
        console.log(error)
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error",
            content: error.response,
          })
        );
      }
}
  
  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, maxHeight: "80vh", overflow: "auto" }}>
          <MDTypography variant="h5">Are you sure you want to dispense these items?</MDTypography><br/>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead sx={{ display: "table-header-group" }}>
                <TableRow>
                  <TableCell>Medication</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  item.inventoryItem && item.inventoryItem.itemTypeEnum === "MEDICINE" &&
                  <TableRow
                    key={item.transactionItemId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {" * " + item.inventoryItem.inventoryItemName}
                    </TableCell>
                    <TableCell align="right">{item.transactionItemQuantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
             <br/>
           <div style={{display: 'flex', justifyContent:'flex-end'}}>
           <MDButton
              onClick={handleCloseModal}
              color="secondary"
            >
              Cancel
            </MDButton>&nbsp;&nbsp;
           <MDButton
              onClick={handleConfirm}
              color="success"
            >
              Confirm
            </MDButton>
            </div>
        </Box>
      </Modal>
    </>
  );
}

export default ConfirmDispenseMedicationModal;

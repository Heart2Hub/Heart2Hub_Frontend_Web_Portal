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

function ConfirmReadyCollectionModal({
  openModal,
  handleCloseModal,
  appointment,
  cart,
  forceRefresh
}) {

  const reduxDispatch = useDispatch();

  const handleConfirm = async () => {
    try {
      const response = await appointmentApi.updateAppointmentDispensaryStatus(appointment.appointmentId, "READY_TO_COLLECT");
      forceRefresh();
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: `HH-${appointment.appointmentId} is now ready for collection! Patient should be arriving any time now.`,
        })
      );
      handleCloseModal();
    } catch (error) {
      console.log(error)
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
          <MDTypography variant="h5">Are you sure these items are ready for collection?</MDTypography>
             <List
             sx={{
               width: '100%',
               maxWidth: 360,
               bgcolor: 'background.paper',
               position: 'relative',
               overflow: 'auto',
               maxHeight: 300,
               '& ul': { padding: 0 },
             }}
             subheader={<li />}
           >
            {cart.map(item => 
            item.inventoryItem && item.inventoryItem.itemTypeEnum === "MEDICINE" &&
             <ListItem sx={{display: "flex", justifyContent: "space-evenly"}}>
                <ListItemText primary={" * " + item.inventoryItem.inventoryItemName} />
                <ListItemText primary={"x" + item.transactionItemQuantity} />
              </ListItem>)}
           </List><br/>
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

export default ConfirmReadyCollectionModal;

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { leaveApi } from 'api/Api';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React, { useEffect, useState } from 'react'
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { staffApi, departmentApi, imageServerApi } from "api/Api";
import moment from "moment";
import { IMAGE_SERVER } from "constants/RestEndPoint";
import { inventoryApi } from 'api/Api';



function UpdateDialogComponent({ rowData }) {
  const [open, setOpen] = React.useState(false);
  const { inventoryItemId, name, description, quantity, price } = rowData;
  const [leaveBalance, setleaveBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState(null);
  const reduxDispatch = useDispatch();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // const handleViewImage = (leave) => {
  //   console.log('leave image: ' + leave.imageDocuments);
  //   if (leave.imageDocuments?.imageLink) {
  //     console.log("View Image button clicked.");
  //     setSelectedImage(`${IMAGE_SERVER}/images/id/${leave.imageDocuments.imageLink}`);
  //     setOpenImageDialog(true);
  //   }
  // };

  // const handleCloseImageDialog = () => {
  //   setOpenImageDialog(false);
  //   setSelectedImage('');
  // };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    inventoryItemId: null,
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

  const handleOpenUpdateModal = () => {
    console.log("Inventory " + inventoryItemId);
    // Populate update form data with the facility's current data

    // const consumableEquipmentToUpdate = dataRef.current.rows[0].find(
    //     (consumableEpuipment) => consumableEpuipment.inventoryItemId === inventoryItemId
    // );
    // console.log("Update " + consumableEquipmentToUpdate.inventoryItemId);
    setUpdateFormData({
      inventoryItemId: inventoryItemId,
      name: name,
      description: description,
      quantity: quantity,
      price: price,
    });

    setIsUpdateModalOpen(true);
  }



  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateConsumableEquipment = () => {
    try {
      const { inventoryItemId, ...requestBody } = updateFormData;
      console.log("Request Body:", requestBody);
      console.log(requestBody.name)
      if (requestBody.name == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Name cannot be null",
          })
        );
        return
      }
      console.log(requestBody.description)
      if (requestBody.description == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Location cannot be null",
          })
        );
        return
      }
      if (requestBody.quantity < 0) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Capacity cannot be less than 0",
          })
        );
        return
      }
      if (requestBody.price < 0) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Capacity cannot be less than 0",
          })
        );
        return
      }
      console.log("check Update: " + requestBody);
      inventoryApi
        .updateConsumableEquipment(inventoryItemId, requestBody)
        .then(() => {
          setUpdateFormData({
            inventoryItemId: null,
            name: "",
            description: "",
            quantity: "",
            price: "",
          });
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Updated Facility!",
              content: requestBody.name + " updated",
            })
          );
          handleCloseUpdateModal();
        })
        .catch((err) => {
          reduxDispatch(
            displayMessage({
              color: "error",
              icon: "notification",
              title: "Error Encountered",
              content: err.response.data,
            })
          );
          console.log(err)
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <MDButton
        variant="gradient"
        color="primary"
        onClick={handleOpenUpdateModal}>
        View Details
      </MDButton>
      <Dialog open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        <DialogTitle>Update Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={updateFormData.name}
            onChange={handleUpdateChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={updateFormData.description}
            onChange={handleUpdateChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Quantity in Stock"
            name="quantity"
            type="number"
            value={updateFormData.quantity}
            onChange={handleUpdateChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Price per Quantity"
            name="price"
            type="number"
            value={updateFormData.price}
            onChange={handleUpdateChange}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseUpdateModal} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleUpdateConsumableEquipment} color="primary">
            Update
          </MDButton>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default UpdateDialogComponent;
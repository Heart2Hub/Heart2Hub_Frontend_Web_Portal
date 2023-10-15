import React, { useEffect, useState } from "react";
import { facilityApi, departmentApi, allocatedInventoryApi } from "api/Api";
import { Box, Button, Dialog, DialogContent, DialogTitle, Icon, IconButton } from "@mui/material";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function ViewFacilityInventoryButton({ selectedFacility }) {
  const reduxDispatch = useDispatch();
  const [openFacilityInventoryDialog, setOpenFacilityInventoryDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFacilityInventory, setSelectedFacilityInventory] = useState([]);
  const [allocatedInventoryIdForUpdate, setAllocatedInventoryIdForUpdate] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0); // Add minQuantity state


  const handleOpenFacilityInventoryDialog = () => {
    setOpenFacilityInventoryDialog(true);
  };

  const handleCloseFacilityInventoryDialog = () => {
    setOpenFacilityInventoryDialog(false);
  };

  const handleGetInventory = async (selectedFacility) => {
    setIsLoading(true);
    try {
      const response = await allocatedInventoryApi.findAllAllocatedInventoryOfFacility(selectedFacility.facilityId);
      console.log(selectedFacility.facilityId);
      const items = response.data;
      console.log(items);
      setSelectedFacilityInventory(items);
    } catch (error) {
      console.log(error.response.data);
    }

    setIsLoading(false);
  };

  const handleDecreaseQuantity = (inventoryItem) => {
    console.log("Decrease" + inventoryItem.allocatedInventoryCurrentQuantity);
    const updatedQuantity = inventoryItem.allocatedInventoryCurrentQuantity - 1;
    setNewQuantity(updatedQuantity);
    try {
      const requestBody = {
        allocatedInventoryIdForUpdate: inventoryItem.allocatedInventoryId,
        newQuantity: updatedQuantity,
      }
      console.log("New quantity " + updatedQuantity)

      console.log("Request body " + requestBody.newQuantity);

      allocatedInventoryApi
        .useAllocatedInventory(requestBody)
        .then(() => {
          const updatedInventory = selectedFacilityInventory.map((item) => {
            console.log("update " + item.allocatedInventoryId);
            console.log("update 2 " + inventoryItem.allocatedInventoryId);

            if (item.allocatedInventoryId === inventoryItem.allocatedInventoryId) {
              // Update the quantity with the new value
              return { ...item, allocatedInventoryCurrentQuantity: updatedQuantity };
            }
            return item;
          });

          setSelectedFacilityInventory(updatedInventory);
          // handleGetInventory();
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Updated Inventory Item! ",
              content: "Inventory Item with Id " + requestBody.allocatedInventoryIdForUpdate + " updated",
            })
          );
        }).catch((err) => {
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
  }

  const handleIncreaseQuantity = (inventoryItem) => {
    console.log("Increase" + inventoryItem.allocatedInventoryCurrentQuantity);
    const updatedQuantity = inventoryItem.allocatedInventoryCurrentQuantity + 1;
    setNewQuantity(updatedQuantity);
    try {
      const requestBody = {
        allocatedInventoryIdForUpdate: inventoryItem.allocatedInventoryId,
        newQuantity: updatedQuantity,
        minQuantity: inventoryItem.minimumQuantityBeforeRestock
      }
      console.log("New quantity " + updatedQuantity)

      console.log("Request body " + requestBody.newQuantity);

      allocatedInventoryApi
        .useAllocatedInventory(requestBody)
        .then(() => {
          const updatedInventory = selectedFacilityInventory.map((item) => {
            console.log("update " + item.allocatedInventoryId);
            console.log("update 2 " + inventoryItem.allocatedInventoryId);

            if (item.allocatedInventoryId === inventoryItem.allocatedInventoryId) {
              // Update the quantity with the new value
              return { ...item, allocatedInventoryCurrentQuantity: updatedQuantity };
            }
            return item;
          });

          setSelectedFacilityInventory(updatedInventory);
          // handleGetInventory();
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Updated Inventory Item! ",
              content: "Inventory Item with Id " + requestBody.allocatedInventoryIdForUpdate + " updated",
            })
          );
        }).catch((err) => {
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
  }

  const inventoryColumns = [
    { Header: "Name", accessor: "consumableEquipment.inventoryItemName" },
    { Header: "Minimum Quantity", accessor: "minimumQuantityBeforeRestock" },
    { Header: "Current Quantity", accessor: "allocatedInventoryCurrentQuantity" },
    {
      Header: "Use Item", accessor: "allocatedInventoryId",
      Cell: ({ row }) => (

        <div>
          <IconButton
            variant="contained"
            color="secondary"
            onClick={() => handleDecreaseQuantity(row.original)}
          >
            <RemoveCircleIcon />
          </IconButton>
          <IconButton
            variant="contained"
            color="secondary"
            onClick={() => handleIncreaseQuantity(row.original)}
          >
            <AddCircleIcon />
          </IconButton>
        </div>

      )
    },
    {
      Header: 'Restock Status',
      accessor: "restockStatus",
      Cell: ({ row }) => {
        const isNeedRestock = row.original.allocatedInventoryCurrentQuantity < row.original.minimumQuantityBeforeRestock;
        const symbolColor = isNeedRestock ? 'red' : 'green';

        return (
          <div>
            <div
              style={{
                backgroundColor: symbolColor,
                width: '20px',
                height: '20px',
                display: 'inline-block',
                marginRight: '5px',
                borderRadius: '50%',
              }}
            ></div>
            {isNeedRestock ? 'Restock Needed' : 'No Restock Needed'}
          </div>
        )
      }
    },
  ]

  const rows = selectedFacilityInventory?.map((inventoryItem) => ({
    allocatedInventoryId: inventoryItem.allocatedInventoryId,
    inventoryItemName: inventoryItem.inventoryItemName,
    allocatedInventoryCurrentQuantity: inventoryItem.allocatedInventoryCurrentQuantity
  }));



  useEffect(() => {
    handleGetInventory(selectedFacility);
  }, [selectedFacility]);

  // {
  //   Header: 'Restock Status',
  //   accessor: "restockStatus",
  //   Cell: ({ row }) => {
  //     const isNeedRestock = row.original.allocatedInventoryCurrentQuantity < row.original.minimumQuantityBeforeRestock;
  //     const symbolColor = isNeedRestock ? 'red' : 'green';

  //     return (
  //       <div>
  //         <div
  //           style={{
  //             backgroundColor: symbolColor,
  //             width: '20px',
  //             height: '20px',
  //             display: 'inline-block',
  //             marginRight: '5px',
  //             borderRadius: '50%',
  //           }}
  //         ></div>
  //         {isNeedRestock ? 'Restock Needed' : 'No Restock Needed'}
  //       </div>
  //     )
  //   }
  // },

  // if (isAdmin || isNurse) {
  //   inventoryColumns.push({
  //     Header: "Actions",
  //     accessor: "inventoryItemId",
  //     Cell: ({ row }) => {
  //       const isAllowedToUpdate = isAdmin || isNurse;
  //       const isAllowedToDelete = isAdmin || isNurse;

  //       return (
  //         <div>
  //           {isAllowedToUpdate && (
  //             <IconButton
  //               variant="contained"
  //               color="secondary"
  //               onClick={() => handleUpdateInventory(row.original)}
  //             >
  //               <Icon>create</Icon>
  //             </IconButton>
  //           )}
  //           {isAllowedToDelete && (
  //             <IconButton
  //               variant="contained"
  //               color="secondary"
  //               onClick={() => handleDeleteInventory(row.original.allocatedInventoryId)}
  //             >
  //               <Icon>delete</Icon>
  //             </IconButton>
  //           )}
  //           <ConfirmationDialogComponent
  //             open={isConfirmationDialogOpen}
  //             onClose={() => setIsConfirmationDialogOpen(false)}
  //             onConfirm={confirmDeletion}
  //           />
  //         </div>
  //       );
  //     },
  //   });
  // }
  return (
    <>
      <MDButton
        variant="outlined"
        color="info"
        onClick={handleOpenFacilityInventoryDialog}
        size="small"
      >
        View Inventory
      </MDButton>
      <Dialog
        open={openFacilityInventoryDialog}
        onClose={handleCloseFacilityInventoryDialog}
        maxWidth="lg"
        fullWidth={true} // This will make the dialog take up full width
      >
        <DialogTitle>Facility Inventory</DialogTitle>
        <DialogContent>
          {selectedFacilityInventory && selectedFacilityInventory.length > 0 ? (
            <DataTable table={{ columns: inventoryColumns, rows: selectedFacilityInventory }} />
          ) : (
            <MDTypography variant="body2" color="textSecondary">
              No inventory items found for this facility.
            </MDTypography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
export default ViewFacilityInventoryButton;


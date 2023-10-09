import React, { useEffect, useState } from "react";
import { facilityApi, departmentApi, allocatedInventoryApi } from "api/Api";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";



function ViewFacilityInventoryButton({ selectedFacility }) {
  const [openFacilityInventoryDialog, setOpenFacilityInventoryDialog] = useState(false);
  const [listOfAttachments, setListOfAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFacilityInventory, setSelectedFacilityInventory] = useState([]);

  const handleOpenFacilityInventoryDialog = () => {
    setOpenFacilityInventoryDialog(true);
  };

  const handleCloseFacilityInventoryDialog = () => {
    setSelectedAttachment(null);
    setOpenFacilityInventoryDialog(false);
  };

  const handleGetInventory = async (selectedFacility) => {
    setIsLoading(true);

    try {
      const response = await allocatedInventoryApi.findAllAllocatedInventoryOfFacility(selectedFacility.facilityId);
      const items = response.data;
      setSelectedFacilityInventory(items);
    } catch (error) {
      console.log(error.response.data);
    }

    setIsLoading(false);
  };

  const inventoryColumns = [
    { Header: "Item ID", accessor: "allocatedInventoryId" },
    { Header: "Name", accessor: "consumableEquipment.inventoryItemName" },
    { Header: "Description", accessor: "consumableEquipment.inventoryItemDescription" },
    { Header: "Quantity Before Restock", accessor: "minimumQuantityBeforeRestock" },
    { Header: "Current Quantity", accessor: "allocatedInventoryCurrentQuantity" },
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

  ];


  useEffect(() => {
    handleGetInventory(selectedFacility);
  }, [selectedFacilityInventory]);

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


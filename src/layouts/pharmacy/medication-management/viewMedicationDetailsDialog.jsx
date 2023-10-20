import React, { useEffect, useState } from "react";
import { facilityApi, departmentApi, allocatedInventoryApi } from "api/Api";
import { Box, Button, Dialog, DialogContent, DialogTitle, Icon, IconButton, ListItem, ListItemText } from "@mui/material";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { useDispatch } from "react-redux";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { inventoryApi } from "api/Api";
import VisibilityIcon from '@mui/icons-material/Visibility';





function ViewMedicationDetailsDialog({ inventoryItemId }) {

  function priceFormat(num) {
    return `${num.toFixed(2)}`;
  }
  const reduxDispatch = useDispatch();
  const [openMedicationDialog, setOpenMedicationDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState(null);



  const handleOpenMedicationDialog = () => {
    setOpenMedicationDialog(true);
    console.log(inventoryItemId);
    handleGetMedication(inventoryItemId);
  };

  const handleCloseMedicationDialog = () => {
    setOpenMedicationDialog(false);
  };

  const handleGetMedication = async (inventoryItemId) => {
    setIsLoading(true);
    try {
      const response = await inventoryApi.findMedicationByInventoryItemId(inventoryItemId);
      console.log(inventoryItemId);
      const medication = response.data;
      console.log(medication);
      setSelectedMedication(medication);
    } catch (error) {
      console.log(error.response.data);
    }

    setIsLoading(false);
  };

  return (
    <>
      <IconButton
        color="secondary"
        onClick={handleOpenMedicationDialog}
        title="View Medication Details"
      >
        <VisibilityIcon />
      </IconButton>
      <Dialog
        open={openMedicationDialog}
        onClose={handleCloseMedicationDialog}
        maxWidth="md"
        fullWidth={true} // This will make the dialog take up full width
      >
        <DialogTitle style={{ padding: '24px' }}>Medication Details</DialogTitle>
        <DialogContent>
          {selectedMedication && (
            <>
              <ListItem>
                <ListItemText primary="Medication Name:" secondary={""} style={{ padding: '8px' }} />
                <MDTypography variant="h5" gutterBottom style={{ padding: '8px' }}>
                  {selectedMedication.inventoryItemName}
                </MDTypography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Description:" secondary={""} style={{ padding: '8px' }} />
                <MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
                  {selectedMedication.inventoryItemDescription}
                </MDTypography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Quantity in Stock:" secondary={""} style={{ padding: '8px' }} />
                <MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
                  {selectedMedication.quantityInStock}
                </MDTypography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Restock Price per Quantity:" secondary={""} style={{ padding: '8px' }} />
                <MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
                  ${priceFormat(selectedMedication.restockPricePerQuantity)}
                </MDTypography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Retail Price per Quantity:" secondary={""} style={{ padding: '8px' }} />
                <MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
                  ${priceFormat(selectedMedication.retailPricePerQuantity)}
                </MDTypography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Allergens:" secondary={""} style={{ padding: '8px' }} />
                <MDTypography variant="h6" gutterBottom style={{ padding: '8px' }}>
                  {selectedMedication.allergenEnumList.join(", ")}
                </MDTypography>
              </ListItem>
            </>
          )}
        </DialogContent>
        <Button onClick={handleCloseMedicationDialog} color="primary">
          Close
        </Button>
      </Dialog>
    </>
  );
}
export default ViewMedicationDetailsDialog;


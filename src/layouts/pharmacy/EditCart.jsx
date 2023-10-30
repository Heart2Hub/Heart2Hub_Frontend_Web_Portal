import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  TextField
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { staffApi } from "api/Api";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function EditCart({
  open,
  onClose,
  cart,
  updateCartQuantity
}) {

  const [currCart, setCurrCart] = useState(cart);

  const handleCartChange = (event) => {
    const { name, value } = event.target;
    setCurrCart((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setCurrCart(cart);
  },[cart])

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle >Update Cart Quantity</DialogTitle>
        <DialogContent>
          <List>
             <ListItem>
                <MDTypography variant="subtitle2">
                  {currCart?.transactionItemName}
                </MDTypography>
                <TextField
                  label="Quantity"
                  type="number"
                  name="transactionItemQuantity"
                  value={currCart?.transactionItemQuantity}
                  onChange={handleCartChange}
                  style={{ width: "20%", marginLeft: 20,  }}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </ListItem>
             </List>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={onClose} color="error">
            Cancel
          </MDButton>
          <MDButton onClick={() => updateCartQuantity(currCart)} color="success">
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditCart;

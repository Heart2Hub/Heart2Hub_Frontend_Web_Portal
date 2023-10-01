import { Popover } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import React from "react";
import { useState } from "react";

function ArrivalButton({
  selectedAppointment,
  handleUpdateAppointmentArrival,
  disableButton,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <MDButton
        variant="gradient"
        color="primary"
        onClick={handleUpdateAppointmentArrival}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        disabled={disableButton}
      >
        Arrived
      </MDButton>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <MDTypography sx={{ p: 1 }} color="warning">
          Click to update patient arrival status
        </MDTypography>
      </Popover>
    </>
  );
}

export default ArrivalButton;

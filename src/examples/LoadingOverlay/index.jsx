import { Modal, CircularProgress } from "@mui/material";
import MDTypography from "components/MDTypography";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  closeLoadingOverlay,
  selectLoadingOverlayState,
} from "../../store/slices/loadingOverlaySlice";
import MDBox from "components/MDBox";
import { ThreeCircles } from "react-loader-spinner";

function LoadingOverlay() {
  const loadingOverlayState = useSelector(selectLoadingOverlayState);
  const reduxDispatch = useDispatch();

  const handleCloseLoadingOverlay = () => {
    reduxDispatch(closeLoadingOverlay());
  };

  return (
    <>
      <Modal open={loadingOverlayState} onClose={handleCloseLoadingOverlay}>
        <MDBox
          height="100vh"
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          top="0"
          left="0"
        >
          <ThreeCircles
            height="80"
            width="80"
            color="lightBlue"
            visible={loadingOverlayState}
          />
          <MDTypography variant="h1" component="h2" sx={{ color: "lightBlue" }}>
            &nbsp; Loading...
          </MDTypography>
        </MDBox>
      </Modal>
    </>
  );
}

export default LoadingOverlay;

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { appointmentApi } from "../../../api/Api";
import { IMAGE_SERVER } from "constants/RestEndPoint";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

function ViewAttachmentsButton({ selectedAppointment }) {
  const [openViewAttachmentsDialog, setOpenViewAttachmentsDialog] =
    useState(false);
  const [listOfAttachments, setListOfAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenViewAttachmentsDialog = () => {
    setOpenViewAttachmentsDialog(true);
  };

  const handleCloseViewAttachmentsDialog = () => {
    setSelectedAttachment(null);
    setOpenViewAttachmentsDialog(false);
  };

  const handleSelectAttachment = (attachment) => {
    setSelectedAttachment(attachment);
  };

  const handleGetAppointmentAttachments = async () => {
    setIsLoading(true);

    try {
      const response = await appointmentApi.viewAppointmentAttachments(
        selectedAppointment.appointmentId
      );
      setListOfAttachments(response.data);
    } catch (error) {
      console.log(error.response.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleGetAppointmentAttachments();
  }, [openViewAttachmentsDialog]);

  return (
    <>
      <MDButton
        variant="outlined"
        color="info"
        onClick={handleOpenViewAttachmentsDialog}
        size="small"
      >
        View Attachment
      </MDButton>
      <Dialog
        open={openViewAttachmentsDialog}
        onClose={handleCloseViewAttachmentsDialog}
        maxWidth="lg"
        fullWidth={true} // This will make the dialog take up full width
      >
        <DialogTitle>View Attachment:</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select an attachment:</DialogContentText>
          <Box display="flex">
            <Box
              flex="0.66"
              pr={2}
              style={{ minWidth: "400px", height: "400px" }}
            >
              {selectedAttachment ? (
                <Card>
                  <CardMedia
                    component="img"
                    width="100%"
                    height="100%"
                    image={
                      IMAGE_SERVER +
                      "/images/general/" +
                      selectedAttachment.imageLink
                    }
                    alt="Selected Preview"
                  />
                </Card>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  border="1px dashed gray"
                >
                  <MDTypography variant="h6">No image selected</MDTypography>
                </Box>
              )}
            </Box>
            <Box flex="0.33" style={{ overflowY: "auto", maxHeight: "400px" }}>
              {listOfAttachments.map((image, index) => (
                <Card
                  key={index}
                  onClick={() => handleSelectAttachment(image)}
                  sx={{
                    marginBottom: 1,
                    cursor: "pointer",
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={IMAGE_SERVER + "/images/general/" + image.imageLink}
                    alt={`Image ${index}`}
                  />
                  <CardContent>
                    <MDTypography variant="subtitle1">{`Image ${
                      index + 1
                    }`}</MDTypography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={handleCloseViewAttachmentsDialog}
            color="secondary"
          >
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewAttachmentsButton;

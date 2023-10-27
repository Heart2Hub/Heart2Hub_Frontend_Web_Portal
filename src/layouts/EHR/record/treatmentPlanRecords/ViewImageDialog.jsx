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
import { treatmentPlanRecordApi, imageServerApi } from "api/Api";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
function ViewImageDialog({
  openViewImageDialog,
  handleCloseViewImageDialog,
  selectedRecordToViewImages,
}) {
  const [listOfAttachments, setListOfAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectAttachment = (attachment) => {
    setSelectedAttachment(attachment);
  };

  const handleGetAttachments = async () => {
    setIsLoading(true);

    try {
      const response =
        await treatmentPlanRecordApi.viewTreatmentPlanRecordImages(
          selectedRecordToViewImages.treatmentPlanRecordId
        );

      const fetchedAttachments = response.data;
      const imageURLs = [];

      for (const image of fetchedAttachments) {
        if (image.imageLink) {
          const imageResponse = await imageServerApi.getImageFromImageServer(
            "general",
            image.imageLink
          );
          imageURLs.push(URL.createObjectURL(imageResponse.data));
        }
      }

      setListOfAttachments(imageURLs);
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedRecordToViewImages) {
      handleGetAttachments();
    }
  }, [openViewImageDialog]);
  return (
    <>
      <Dialog
        open={openViewImageDialog}
        onClose={handleCloseViewImageDialog}
        maxWidth="lg"
        fullWidth={true}
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
                    image={selectedAttachment}
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
              {listOfAttachments.length > 0 ? (
                listOfAttachments.map((image, index) => (
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
                      image={image}
                      alt={`Image ${index}`}
                    />
                    <CardContent>
                      <MDTypography variant="subtitle1">{`Image ${
                        index + 1
                      }`}</MDTypography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  width="100%"
                >
                  No Images attached to this plan yet
                </MDBox>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseViewImageDialog} color="secondary">
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewImageDialog;

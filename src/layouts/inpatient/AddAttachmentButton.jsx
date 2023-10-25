import {
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
} from "@mui/material";
import { appointmentApi, imageServerApi } from "api/Api";
import MDButton from "components/MDButton";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import moment from "moment";
import MDBox from "components/MDBox";
import { displayMessage } from "store/slices/snackbarSlice";

function AddAttachmentButton({ selectedAppointment }) {
  const [addAttachmentDialogOpen, setAddAttachmentDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);
  const reduxDispatch = useDispatch();
  const loggedInStaff = useSelector(selectStaff);

  const handleOpenAddAttachmentDialog = () => {
    setAddAttachmentDialogOpen(true);
  };

  const handleCloseAddAttachmentDialog = () => {
    setImagePreview(null);
    setImageToUpload(null);
    setAddAttachmentDialogOpen(false);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const formData = new FormData();
      formData.append(
        "image",
        event.target.files[0],
        event.target.files[0].name
      );
      setImageToUpload(formData);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      //no file

      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "No Image was uploaded",
        })
      );
    }
  };

  const handlePhotoSubmit = async () => {
    if (imageToUpload) {
      try {
        const imageServerResponse = await imageServerApi.uploadProfilePhoto(
          "general",
          imageToUpload
        );

        let imageLink = imageServerResponse.data.filename;
        let createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

        //send to BE to update
        const response = await appointmentApi.addImageAttachmentToAppointment(
          selectedAppointment.appointmentId,
          imageLink,
          createdDate,
          loggedInStaff.staffId
        );

        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Upload Success",
            content: "Image document is uploaded",
          })
        );
      } catch (error) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Upload Failed",
            content: error.response.data,
          })
        );
      }
      handleCloseAddAttachmentDialog();
    }
  };

  return (
    <>
      <MDButton
        variant="outlined"
        color="secondary"
        onClick={handleOpenAddAttachmentDialog}
        size="small"
      >
        Add Attachment
      </MDButton>
      <Dialog
        open={addAttachmentDialogOpen}
        onClose={handleCloseAddAttachmentDialog}
        maxWidth="md"
      >
        <DialogTitle>Upload Image Attachment:</DialogTitle>
        <DialogContent>
          <DialogContentText>Please upload an image:</DialogContentText>

          {imagePreview && (
            <MDBox sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Card sx={{ mt: 3, maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  width="200px"
                  height="200px"
                  image={imagePreview}
                  alt="Preview"
                />
              </Card>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          </FormControl>
          <MDButton onClick={handleCloseAddAttachmentDialog} color="secondary">
            Cancel
          </MDButton>
          <MDButton
            onClick={handlePhotoSubmit}
            color="primary"
            disabled={imagePreview === null}
          >
            Submit
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default AddAttachmentButton;

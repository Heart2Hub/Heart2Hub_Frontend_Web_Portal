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
import { treatmentPlanRecordApi, imageServerApi } from "api/Api";
import MDButton from "components/MDButton";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import moment from "moment";
import MDBox from "components/MDBox";
import { displayMessage } from "store/slices/snackbarSlice";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { updateEHRRecord } from "store/slices/ehrSlice";

function UploadImageDialog({
  selectedRecordToUploadImage,
  openUploadImageDialog,
  handleCloseUploadImageDialog,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);
  const reduxDispatch = useDispatch();
  const loggedInStaff = useSelector(selectStaff);
  const ehrRecord = useSelector(selectEHRRecord);

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

  const handleCloseDialog = () => {
    setImagePreview(null);
    setImageToUpload(null);
    handleCloseUploadImageDialog();
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
        const response =
          await treatmentPlanRecordApi.addImageAttachmentToTreatmentPlan(
            selectedRecordToUploadImage.treatmentPlanRecordId,
            imageLink,
            createdDate,
            loggedInStaff.staffId
          );

        // Create a deep copy of the treatment plan records array
        const updatedTreatmentPlanRecords = [
          ...ehrRecord.listOfTreatmentPlanRecords,
        ];

        // Identify the index of the existing Treatment Plan in the list
        const existingRecordIndex = updatedTreatmentPlanRecords.findIndex(
          (record) =>
            record.treatmentPlanRecordId ===
            selectedRecordToUploadImage.treatmentPlanRecordId
        );

        // If found, replace the existing record with the updated one in the copy
        if (existingRecordIndex !== -1) {
          updatedTreatmentPlanRecords.splice(
            existingRecordIndex,
            1,
            response.data
          );
        }

        const updatedEhrRecord = {
          ...ehrRecord,
          listOfTreatmentPlanRecords: updatedTreatmentPlanRecords,
        };
        reduxDispatch(updateEHRRecord(updatedEhrRecord));

        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Upload Success",
            content: "Image document is uploaded",
          })
        );
      } catch (error) {
        console.log(error);
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Upload Failed",
            content: "Something went wrong with image upload",
          })
        );
      }

      handleCloseDialog();
    }
  };
  return (
    <>
      <Dialog
        open={openUploadImageDialog}
        onClose={handleCloseDialog}
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
          <MDButton onClick={handleCloseDialog} color="secondary">
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

export default UploadImageDialog;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { departmentApi } from "api/Api";
import { useEffect } from "react";
import { treatmentPlanRecordApi } from "api/Api";
import { staffApi } from "api/Api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";
import { updateEHRRecord } from "store/slices/ehrSlice";
import { displayMessage } from "store/slices/snackbarSlice";
function ViewInvitationDialog({
  openInvitationDialog,
  handleCloseInvitationDialog,
  selectedTreatmentPlanRecord,
}) {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [listOfInvitedStaff, setListOfInvitedStaff] = useState([]);
  const [listOfDepartments, setListOfDepartments] = useState([]);
  const [listOfStaffs, setListOfStaffs] = useState([]);
  const [listOfStaffToDisplay, setListOfStaffToDisplay] = useState([]);

  //THROWING ERROR BUT BE NOT THROWING
  // ERROR RESPONSE IS THE JSON OF THE TREATMENT PLAN
  const handleAddStaff = async (staffToInvite) => {
    //perform creating invitation in BE
    console.log("BEFORE");
    try {
      const response =
        await treatmentPlanRecordApi.addInvitationToTreatmentPlanRecord(
          selectedTreatmentPlanRecord.treatmentPlanRecordId,
          loggedInStaff.staffId,
          staffToInvite.staffId
        );

      console.log("OUTSIDE");
      // // Create a deep copy of the treatment plan records array
      // console.log(response.data);
      // const updatedTreatmentPlanRecords = [
      //   ...ehrRecord.listOfTreatmentPlanRecords,
      // ];

      // // Identify the index of the existing Treatment Plan in the list
      // const existingRecordIndex = updatedTreatmentPlanRecords.findIndex(
      //   (record) =>
      //     record.treatmentPlanRecordId ===
      //     selectedTreatmentPlanRecord.treatmentPlanRecordId
      // );

      // // If found, replace the existing record with the updated one in the copy
      // if (existingRecordIndex !== -1) {
      //   updatedTreatmentPlanRecords.splice(
      //     existingRecordIndex,
      //     1,
      //     response.data
      //   );
      // }

      // const updatedEhrRecord = {
      //   ...ehrRecord,
      //   listOfTreatmentPlanRecords: updatedTreatmentPlanRecords,
      // };
      // reduxDispatch(updateEHRRecord(updatedEhrRecord));

      if (selectedStaff && !listOfInvitedStaff.includes(selectedStaff)) {
        setListOfInvitedStaff((prevItems) => [...prevItems, selectedStaff]);
      }
    } catch (error) {
      console.log(error);
      // console.log(error.response.data);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: error.response.data,
        })
      );
      return;
    }
  };

  const handleDeleteStaff = async (staffToDelete) => {
    //perform deleting invitation on BE
    const response =
      await treatmentPlanRecordApi.deleteInvitationToTreatmentPlanRecord(
        selectedTreatmentPlanRecord.treatmentPlanRecordId,
        loggedInStaff.staffId,
        staffToDelete.staffId
      );

    console.log("OUTSIDE");

    // Create a deep copy of the treatment plan records array
    console.log(response.data);
    // const updatedTreatmentPlanRecords = [
    //   ...ehrRecord.listOfTreatmentPlanRecords,
    // ];

    // Identify the index of the existing Treatment Plan in the list
    // const existingRecordIndex = updatedTreatmentPlanRecords.findIndex(
    //   (record) =>
    //     record.treatmentPlanRecordId ===
    //     selectedTreatmentPlanRecord.treatmentPlanRecordId
    // );

    // // If found, replace the existing record with the updated one in the copy
    // if (existingRecordIndex !== -1) {
    //   updatedTreatmentPlanRecords.splice(existingRecordIndex, 1, response.data);
    // }

    // const updatedEhrRecord = {
    //   ...ehrRecord,
    //   listOfTreatmentPlanRecords: updatedTreatmentPlanRecords,
    // };
    // reduxDispatch(updateEHRRecord(updatedEhrRecord));
    setListOfInvitedStaff((prevItems) =>
      prevItems.filter((i) => i !== staffToDelete)
    );
  };

  const handleSelectedDepartment = (department) => {
    setSelectedDepartment(department);
    // console.log("selected department: " + department);
    // console.log(
    //   listOfStaffs.filter((staff) => {
    //     return staff.unit.name === department;
    //   })
    // );
    setListOfStaffToDisplay(
      listOfStaffs.filter((staff) => {
        return staff.unit.name === department;
      })
    );
  };

  const handleSelectedStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const handleFetchDepartments = async () => {
    const response = await departmentApi.getAllDepartments();
    setListOfDepartments(response.data);
    // console.log(response.data);
  };

  const handleFetchAllStaff = async () => {
    const response = await staffApi.getAllStaff();
    const listOfStaffWithoutAdmin = response.data.filter((staff) => {
      return staff.staffRoleEnum !== "ADMIN";
    });
    setListOfStaffs(listOfStaffWithoutAdmin);
    // console.log(response.data);
  };

  const handleFetchInvitedStaff = async () => {
    const response =
      await treatmentPlanRecordApi.getListOfInvitationsInTreatmentPlanRecord(
        selectedTreatmentPlanRecord.treatmentPlanRecordId
      );
    setListOfInvitedStaff(response.data);
    // console.log(response.data);
  };

  useEffect(() => {
    handleFetchDepartments();
    handleFetchInvitedStaff();
    handleFetchAllStaff();
  }, [openInvitationDialog, selectedTreatmentPlanRecord]);

  return (
    <>
      <Dialog
        open={openInvitationDialog}
        onClose={handleCloseInvitationDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invitation List</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => handleSelectedDepartment(e.target.value)}
              sx={{ lineHeight: "3em" }}
            >
              {listOfDepartments.map((dept) => {
                return (
                  <MenuItem key={dept.unitId} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {selectedDepartment && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Staff To Invite</InputLabel>
              <Select
                value={selectedStaff}
                onChange={(e) => handleSelectedStaff(e.target.value)}
                sx={{ lineHeight: "3em" }}
              >
                {listOfStaffToDisplay.map((staff) => {
                  // console.log(staff);
                  return (
                    <MenuItem key={staff.staffId} value={staff}>
                      {staff.firstname}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          <Button onClick={() => handleAddStaff(selectedStaff)}>
            Add to List
          </Button>

          {listOfInvitedStaff.length === 0 && <>No staff invited yet</>}
          <List>
            {listOfInvitedStaff.map((invitation) => (
              <ListItem key={invitation.staffId}>
                <ListItemText
                  primary={
                    invitation.firstname +
                    " " +
                    invitation.lastname +
                    " (" +
                    invitation.staffRoleEnum +
                    ")"
                  }
                />
                <ListItemSecondaryAction>
                  {!invitation.isPrimary && (
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteStaff(invitation)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvitationDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewInvitationDialog;

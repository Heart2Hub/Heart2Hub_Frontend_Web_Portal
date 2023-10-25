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
  Typography,
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
import MDTypography from "components/MDTypography";
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
    if (
      listOfInvitedStaff.filter((staff) => {
        return staff.staffId === staffToInvite.staffId;
      }).length > 0
    ) {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Invitation not sent",
          content:
            "Staff " +
            staffToInvite.firstname +
            " " +
            staffToInvite.lastname +
            " has already been invited",
        })
      );
      return;
    }
    //perform creating invitation in BE
    console.log("BEFORE");
    try {
      const response =
        await treatmentPlanRecordApi.addInvitationToTreatmentPlanRecord(
          selectedTreatmentPlanRecord.treatmentPlanRecordId,
          loggedInStaff.staffId,
          staffToInvite.staffId
        );

      //it will never get outside due to the error
      console.log("OUTSIDE");

      if (selectedStaff && !listOfInvitedStaff.includes(selectedStaff)) {
        setListOfInvitedStaff((prevItems) => [...prevItems, selectedStaff]);
      }
    } catch (error) {
      //for some reason, not matter what an error is caught, so we shall assume the method will go through
      //get list of invitations
      handleFetchInvitedStaff();
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: "Invitation has been sent",
        })
      );
      return;
    }
  };

  const handleDeleteStaff = async (staffToDelete) => {
    try {
      //perform deleting invitation on BE
      const response =
        await treatmentPlanRecordApi.deleteInvitationToTreatmentPlanRecord(
          selectedTreatmentPlanRecord.treatmentPlanRecordId,
          loggedInStaff.staffId,
          staffToDelete.invitationId
        );

      console.log("OUTSIDE");

      setListOfInvitedStaff((prevItems) =>
        prevItems.filter((i) => i !== staffToDelete)
      );
    } catch {
      handleFetchInvitedStaff();
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Success",
          content: "Invitation has been removed",
        })
      );
      return;
    }
  };

  const handleSelectedDepartment = (department) => {
    setSelectedDepartment(department);
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
  };

  const handleFetchAllStaff = async () => {
    const response = await staffApi.getAllStaff();
    const listOfStaffWithoutAdmin = response.data.filter((staff) => {
      return staff.staffRoleEnum !== "ADMIN";
    });
    setListOfStaffs(listOfStaffWithoutAdmin);
  };

  const handleFetchInvitedStaff = async () => {
    const response =
      await treatmentPlanRecordApi.getListOfInvitationsInTreatmentPlanRecord(
        selectedTreatmentPlanRecord.treatmentPlanRecordId
      );
    setListOfInvitedStaff(response.data);
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
        <DialogTitle
          style={{ backgroundColor: "#e1e1e1", textAlign: "center" }}
        >
          Invitation List
        </DialogTitle>
        <DialogContent style={{ padding: "20px" }}>
          <FormControl
            fullWidth
            margin="normal"
            style={{ marginBottom: "15px" }}
          >
            <InputLabel style={{ marginBottom: "10px" }}>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => handleSelectedDepartment(e.target.value)}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                padding: "10px 5px",
              }}
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
            <FormControl
              fullWidth
              margin="normal"
              style={{ marginBottom: "15px" }}
            >
              <InputLabel style={{ marginBottom: "10px" }}>
                Staff To Invite
              </InputLabel>
              <Select
                value={selectedStaff}
                onChange={(e) => handleSelectedStaff(e.target.value)}
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "5px",
                  padding: "10px 5px",
                }}
              >
                {listOfStaffToDisplay.map((staff) => {
                  return (
                    <MenuItem key={staff.staffId} value={staff}>
                      {staff.firstname}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          <Button
            onClick={() => handleAddStaff(selectedStaff)}
            style={{
              backgroundColor: "#007BFF",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 15px",
              marginTop: "10px",
              float: "right",
            }}
          >
            Add to List
          </Button>

          {listOfInvitedStaff.length === 0 && (
            <p style={{ color: "#888888", marginTop: "20px" }}>
              No staff invited yet
            </p>
          )}
          <List style={{ marginTop: "20px" }}>
            {listOfInvitedStaff.map((invitation) => (
              <ListItem
                key={invitation.staffId}
                style={{ borderBottom: "1px solid #e1e1e1", padding: "10px 0" }}
              >
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
                <ListItemSecondaryAction
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: invitation.isPrimary
                      ? "center"
                      : "flex-end", // Conditional justifyContent
                    width: "20%", // A width value to ensure space, adjust as required
                  }}
                >
                  {!invitation.isPrimary && (
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteStaff(invitation)}
                      style={{ color: "#DD3333" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  {invitation.isPrimary && (
                    <MDTypography
                      style={{
                        textAlign: "center",
                      }}
                    >
                      OWNER
                    </MDTypography>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions
          style={{ padding: "15px 20px", backgroundColor: "#f5f5f5" }}
        >
          <Button
            onClick={handleCloseInvitationDialog}
            color="primary"
            style={{ fontWeight: "bold" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewInvitationDialog;

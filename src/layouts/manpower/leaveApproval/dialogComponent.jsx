import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { leaveApi } from 'api/Api';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React, { useEffect, useState } from 'react'
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { staffApi, departmentApi, imageServerApi } from "api/Api";
import moment from "moment";
import { IMAGE_SERVER } from "constants/RestEndPoint";



function DialogComponent({ rowData, onApproval, onRejection }) {
  const [open, setOpen] = React.useState(false);
  const { leaveId, name, staffId, startDate, endDate, leaveType, approvalStatus, comments, imageDocuments } = rowData;
  const [leaveBalance, setleaveBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState(null);
  const reduxDispatch = useDispatch();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleViewImage = (leave) => {
    console.log('leave image: ' + leave.imageDocuments);
    if (leave.imageDocuments?.imageLink) {
      console.log("View Image button clicked.");
      setSelectedImage(`${IMAGE_SERVER}/images/id/${leave.imageDocuments.imageLink}`);
      setOpenImageDialog(true);
    }
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImage('');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ApprovalStatusEnum = {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    PENDING: 'PENDING',
  };

  const handleApproval = async (event) => {
    event.preventDefault();
    try {
      console.log("leave" + leaveId)
      const response = leaveApi.approveLeaveDate(leaveId);
      console.log(response);
      setIsLoading(false);
      setAction("approved"); // Set the action to 'approved'
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Leave Approval",
          content: "Leave has been APPROVED!",
        })
      );
      await onApproval(rowData);
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Handle errors and mark loading as complete
    }
  };

  const handleRejection = async (event) => {
    event.preventDefault();
    try {
      const response = leaveApi.rejectLeaveDate(leaveId);
      console.log(response);
      setIsLoading(false);
      setAction("rejected"); // Set the action to 'rejected'
      reduxDispatch(
        displayMessage({
          color: "success",
          icon: "notification",
          title: "Leave Approval",
          content: "Leave has been REJECTED!",
        })
      );
      await onRejection(rowData);
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Handle errors and mark loading as complete
    }
  };

  useEffect(() => {
    const getResponse = async () => {
      try {
        const response = await leaveApi.getLeaveBalance(staffId);
        console.log('leave? ' + response);
        setleaveBalance(response.data);
        setIsLoading(false);
        console.log("Approval:" + approvalStatus);
        console.log(rowData);

      } catch (error) {
        console.error(error);
        setIsLoading(false); // Handle errors and mark loading as complete
      }
    };
    getResponse();
  }, []);

  return (
    <div>
      <MDButton
        variant="gradient"
        color="primary"
        onClick={handleClickOpen}>
        View Details
      </MDButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ size: '100px' }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">
          {"Leave Details"}
        </DialogTitle>
        <DialogContent>
          <>
            <Typography variant="subtitle2">
              <b>Staff Name:</b> {name}
            </Typography>
            <Typography variant="subtitle2">
              <b>Start Date:</b> {startDate}
            </Typography>
            <Typography variant="subtitle2">
              <b>End Date:</b> {endDate}
            </Typography>
            <Typography variant="subtitle2">
              <b>Leave Type:</b> {leaveType}
            </Typography>
            <Typography variant="subtitle2">
            <b>Approval Status:</b> <b style={{ color: approvalStatus === "APPROVED" ? "green" : approvalStatus === "REJECTED" ? "red" : "grey"}}>{approvalStatus}</b>
            </Typography>
            <Typography variant="subtitle2">
            <b>Comments:</b> {comments ? comments : "-"}
            </Typography>
            <br />
            <Typography variant="h6">
              Leave Balance:
            </Typography>
            <Typography variant="subtitle2">
            <b>Annual leave:</b> {leaveBalance.annualLeave}
            </Typography>
            <Typography variant="subtitle2">
            <b>Sick leave:</b> {leaveBalance.sickLeave}
            </Typography>
            <Typography variant="subtitle2">
            <b>Parental leave:</b> {leaveBalance.parentalLeave}
            </Typography>
            {imageDocuments && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleViewImage(rowData)}
                style={{ backgroundColor: 'orange', color: 'white' }}
              >
                View Image
              </Button>
            )}
            <DialogActions>
              <Button
                onClick={handleApproval}
                disabled={approvalStatus !== ApprovalStatusEnum.PENDING}
              >Approve</Button>
              <Button onClick={handleRejection}
                disabled={approvalStatus !== ApprovalStatusEnum.PENDING}
              >
                Reject
              </Button>
            </DialogActions>
          </>


        </DialogContent>
      </Dialog>
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog} style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <DialogContent style={{ width: '100vw' }}>
          <img src={selectedImage} alt="Leave Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </DialogContent>
        <Button onClick={handleCloseImageDialog} color="primary">
          Close
        </Button>
      </Dialog>
    </div >
  );
}

export default DialogComponent;
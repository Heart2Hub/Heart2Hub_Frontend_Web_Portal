import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { leaveApi } from 'api/Api';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React, { useEffect, useState } from 'react'

function DialogComponent({ rowData, onApproval, onRejection }) {
  const [open, setOpen] = React.useState(false);
  const { leaveId, name, staffId, startDate, endDate, leaveType, approvalStatus } = rowData;
  const [leaveBalance, setleaveBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState(null);

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
      console.log("Annual leave", leaveBalance.annualLeave); // Add this line
      setAction("approved"); // Set the action to 'approved'
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
      console.log("Annual leave", leaveBalance.annualLeave); // Add this line
      setAction("rejected"); // Set the action to 'rejected'
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
      >
        <DialogTitle id="alert-dialog-title">
          {"Leave Details"}
        </DialogTitle>
        <DialogContent>
          <>
            <Typography variant="subtitle1">
              Staff Name: {name}
            </Typography>
            <Typography variant="subtitle1">
              End Date: {endDate}
            </Typography>
            <Typography variant="subtitle1">
              Leave Type: {leaveType}
            </Typography>
            <Typography variant="subtitle1">
              Approval Status: {approvalStatus}
            </Typography>
            <br />
            <Typography variant="h6">
              Leave Balance:
            </Typography>
            <Typography variant="subtitle1">
              Annual leave: {leaveBalance.annualLeave}
            </Typography>
            <Typography variant="subtitle1">
              Sick leave: {leaveBalance.sickLeave}
            </Typography>
            <Typography variant="subtitle1">
              Parental leave: {leaveBalance.parentalLeave}
            </Typography>
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
    </div >
  );
}

export default DialogComponent;
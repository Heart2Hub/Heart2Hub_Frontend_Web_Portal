import { Backdrop, Fade, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { leaveApi } from "api/Api";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const ViewLeave = ({ isOpen, onRequestClose, rowData, onApproval, onRejection }) => {

    const { leaveId, name, startDate, endDate, leaveType, approvalStatus } = rowData;
    const [leaveBalance, setleaveBalance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [action, setAction] = useState(null); // State to track the action (approve/reject)

    const handleCloseModal = () => {
        setAction(null); // Reset action state
        onRequestClose(); // Close the modal
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
        if (isOpen) {
            const getResponse = async () => {
                try {
                    const response = await leaveApi.getLeaveBalance(1);
                    console.log(response);
                    setleaveBalance(response.data);
                    setIsLoading(false);
                    console.log("Approval:" + approvalStatus);

                } catch (error) {
                    console.error(error);
                    setIsLoading(false); // Handle errors and mark loading as complete
                }
            };
            getResponse();
        }
    }, [isOpen]);



    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}>
            <Fade in={isOpen}>
                <MDBox
                    component="form"
                    role="form"
                    // onSubmit={onSubmitHandler}
                    sx={style}
                >
                    <div style={{ textAlign: "right" }}>
                        <IconButton
                            color="primary"
                            onClick={onRequestClose} // Close the modal when X button is clicked
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                    </div>
                    <h2>Leave Details</h2>

                    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                        {action === null ? (
                            <>
                                <p>Staff Name: {name}</p>
                                <p>Start Date: {startDate}</p>
                                <p>End Date: {endDate}</p>
                                <p>Leave Type: {leaveType}</p>
                                <p>Approval Status: {approvalStatus}</p>
                            </>
                        ) : action === "approved" ? (
                            <p>Leave Approved!</p>
                        ) : action === "rejected" ? (
                            <p>Leave Rejected!</p>
                        ) : null}
                    </Typography>
                    &nbsp;
                    <MDTypography
                        id="transition-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Leave Balance:
                    </MDTypography>
                    <p>Annual leave: {leaveBalance.annualLeave}</p>
                    <p>Sick leave: {leaveBalance.sickLeave}</p>
                    <p>Parental leave: {leaveBalance.parentalLeave}</p>
                    {action === null ? (
                        <>
                            <MDButton
                                variant="gradient"
                                color="primary"
                                type="submit"
                                halfWidth
                                sx={{ marginTop: "10px" }}
                                onClick={handleApproval}
                                disabled={approvalStatus === ApprovalStatusEnum.APPROVED || approvalStatus === ApprovalStatusEnum.REJECTED}
                            >
                                <MDTypography variant="h4" fontWeight="medium" color="white">
                                    Approve
                                </MDTypography>
                            </MDButton>
                            <MDButton
                                variant="gradient"
                                color="primary"
                                type="submit"
                                halfWidth
                                sx={{ marginTop: "10px" }}
                                onClick={handleRejection}
                                disabled={approvalStatus === ApprovalStatusEnum.APPROVED || approvalStatus === ApprovalStatusEnum.REJECTED}
                            >
                                <MDTypography variant="h4" fontWeight="medium" color="white">
                                    Reject
                                </MDTypography>
                            </MDButton>
                        </>
                    ) : (
                        <MDButton
                            variant="gradient"
                            color="primary"
                            type="button"
                            halfWidth
                            sx={{ marginTop: "10px" }}
                            onClick={handleCloseModal}
                        >
                            <MDTypography variant="h4" fontWeight="medium" color="white">
                                Close
                            </MDTypography>
                        </MDButton>
                    )}
                </MDBox>
            </Fade>

        </Modal>
    );
};

export default ViewLeave;
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect } from "react";
import { Box, Button, Card, CardActions, CardContent, Icon, Tab, Typography } from "@mui/material";
import MDButton from "components/MDButton";

import { useDispatch, useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";
import MDTypography from "components/MDTypography";
import { appointmentApi, staffApi } from "api/Api";

import { useState } from "react";
import { parseDateFromLocalDateTimeWithSecs, parseDateFromLocalDateTime } from "utility/Utility";
import AppointmentTicketModal from "./AppointmentTicketModal";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import ConfirmReadyCollectionModal from "./ConfirmReadyCollectionModal";
import { displayMessage } from "store/slices/snackbarSlice";
import ViewAllTicketsModal from "./ViewAllTicketsModal";
import CreateNewTicket from "./CreateNewTicket";
import ConfirmDispenseMedicationModal from "./ConfirmDispenseMedication";


function LiveQueue() {
  const staff = useSelector(selectStaff);
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openConfirmReady, setOpenConfirmReady] = useState(false);
  const [openDispenseModal, setOpenDispenseModal] = useState(false);
  const [hasViewedMedication, setHasViewedMedication] = useState(false);
  const [cart, setCart] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listOfAdminStaff, setListOfAdminStaff] = useState([]);
  const [isViewTicketsModalOpen, setIsViewTicketsModalOpen] = useState(false);
  const reduxDispatch = useDispatch();

  const getPharmacyTickets = async () => {
    try {
        const response = await appointmentApi.viewPharmacyTickets();
        if (response.status === 200) {
            const unassigned = response.data.filter(ticket => ticket.currentAssignedStaffId === null)
            const assigned = response.data.filter(ticket => ticket.currentAssignedStaffId === staff.staffId)
            assigned.sort((a,b) => a.dispensaryStatusEnum === "PREPARING" ? -1 : 1)
            assigned.sort((a,b) => a.dispensaryStatusEnum === "READY_TO_COLLECT" ? -1 : 1)
            const sortedArr = unassigned.sort((a,b) => parseDateFromLocalDateTimeWithSecs(a.actualDateTime) - parseDateFromLocalDateTimeWithSecs(b.actualDateTime))
            setUnassignedTickets(sortedArr);
            setAssignedTickets(assigned);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const handleAssign = async (id) => {
    try {
        //send to BE to assign staff
        const response = await appointmentApi.assignAppointmentToStaff(
            id,
            staff.staffId,
            0
          );

        getPharmacyTickets();
      } catch (error) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error",
            content: error.response.data,
          })
        );
      }
    }   

    const getStaffCurrentlyWorking = async () => {
        const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
          "Pharmacy"
        );
        setListOfWorkingStaff(response.data);
      };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    
    const handleOpenModal = (appointment) => {
        setHasViewedMedication(true);
        setAppointment(appointment);
        setOpenModal(true);
    };

    const handleOpenConfirmReadyModal = (appointment) => {
        setAppointment(appointment)
        setOpenConfirmReady(true);
    };

    const handleCloseConfirmReadyModal = () => {
        setOpenConfirmReady(false);
    };

    const handleOpenDispenseModal = (appointment) => {
        setAppointment(appointment)
        setOpenDispenseModal(true);
    };

    const handleCloseDispenseModal = () => {
        setOpenDispenseModal(false);
    };

    const forceRefresh = () => {
        setLoading(true);
        getPharmacyTickets();
        getStaffCurrentlyWorking();
        setHasViewedMedication(false);
        setLoading(false);
    };

    const checkPreparingTickets = () => {
        if (assignedTickets.length === 0) return false;
        for (let i=0; i<assignedTickets.length; i++) {
            if (assignedTickets[i].dispensaryStatusEnum === "PREPARING") {
                return true;
            }
        }
        return false;
    }

    function replaceItemByIdWithUpdated(id, newItem) {
        let newColumnList = [];
        let selectedColumnList = JSON.parse(JSON.stringify(assignedTickets));
        selectedColumnList.map((item) => {
            if (item.appointmentId === Number(id)) {
                newColumnList.push(newItem);
                setAppointment(newItem);
            } else {
                newColumnList.push(item);
            }
        });

        setAssignedTickets(newColumnList);
    }

    const handlePatientArrived = async (selectedAppointment) => {
        setLoading(true);

        try {
            const response = await appointmentApi.updateAppointmentArrival(
                selectedAppointment.appointmentId,
                !selectedAppointment.arrived,
                staff.staffId
            );
            let updatedAppointment = response.data;

            //update the old appt
            replaceItemByIdWithUpdated(
                updatedAppointment.appointmentId,
                updatedAppointment
            );

            reduxDispatch(
                displayMessage({
                color: "success",
                icon: "notification",
                title: "Update Success",
                content: "Patient's Arrival Status is updated",
                })
            );
        } catch (error) {
        reduxDispatch(
            displayMessage({
            color: "error",
            icon: "notification",
            title: "Update Failed!",
            content: error.response.data,
            })
        );
        }
        setLoading(false);
    }

    const getPriorityColor = (appointment) => {
        if (appointment.actualDateTime === null || appointment.arrived) return "green"
        if (!appointment.arrived) {
          const apptDate = parseDateFromLocalDateTime(appointment.actualDateTime);
          let timeDiff = (new Date().getHours()*60 + new Date().getMinutes()) - (apptDate.getHours()*60 + apptDate.getMinutes())
    
          if (timeDiff >= 40) {
            return "red"
          } else if (timeDiff >= 20) {
            return "orange"
          } else {
            return "green"
          }
        }
      };

    const handleCloseTicketsModal = () => {
        setIsViewTicketsModalOpen(false);
    }

    useEffect(() => {
        if (assignedTickets.length === 0 || unassignedTickets.length === 0) getPharmacyTickets();
        getStaffCurrentlyWorking();
    },[appointment, listOfAdminStaff])

  return (
    <>
        <Typography>Queue</Typography>
        <Box sx={{ 
            width: "100%", 
            height: "275px",
            typography: "body1",
            backgroundColor: "#292D32",
            display: "flex",
            alignItems: "center",
            borderRadius: "10px"
        }}>
            {unassignedTickets.length === 0 && <Typography sx={{margin: "auto"}}color="common.white"><b>There are no tickets in the queue!</b></Typography>}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {unassignedTickets.map((ticket, index) => 
                    index === 0 ?
                    <div style={{ marginLeft: "40px", width: "380px", display: "flex", flexDirection: "column" }}>
                        {/* First card with heavy outline and "next in line" */}
                        <div style={{ border: "4px solid red", padding: "25px", paddingTop: "0px", backgroundColor: "#35C1CA" }}>
                            <Typography sx={{ textAlign: "center"}}><b>Next in Queue</b></Typography>
                            <Card sx={{ width: "325px" }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        HH-{ticket.appointmentId}&nbsp;&nbsp;
                                        <span 
                                            style={{ height: "12px", 
                                            width: "12px", 
                                            backgroundColor: getPriorityColor(ticket), 
                                            borderRadius: "50%", 
                                            display: "inline-block"}}></span>
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {ticket.firstName + " " + ticket.lastName}
                                    </Typography>
                                    <Typography variant="body2">
                                        From {ticket.departmentName}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                    <Button 
                                        size="small"
                                        onClick={() => handleOpenModal(ticket)}>
                                        View
                                    </Button>
                                    <MDButton 
                                        size="small"
                                        color="dark"
                                        onClick={() => handleAssign(ticket.appointmentId)}
                                        disabled={checkPreparingTickets()}>
                                        Assign to me
                                    </MDButton>
                                </CardActions>
                            </Card>
                        </div>
                    </div> : 
                    index < 3 ? 
                        <Card sx={{
                            width: "325px",
                            marginLeft: "20px",
                        }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                HH-{ticket.appointmentId}&nbsp;&nbsp;
                                <span 
                                    style={{ height: "12px", 
                                    width: "12px", 
                                    backgroundColor: getPriorityColor(ticket), 
                                    borderRadius: "50%", 
                                    display: "inline-block"}}></span>
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {ticket.firstName + " " + ticket.lastName}
                                </Typography>
                                <Typography variant="body2">
                                From {ticket.departmentName}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ display: 'flex'}}>
                                <Button 
                                    size="small"
                                    onClick={() => handleOpenModal(ticket)}>
                                    View
                                </Button>
                            </CardActions>
                        </Card>: null
                    
                )}
                {unassignedTickets.length > 3 ? 
                <MDButton
                    color="primary"
                    sx={{ marginLeft: "50px"}}
                    onClick={() => setIsViewTicketsModalOpen(true)}>
                    View All
                </MDButton> 
                : null}
            </div>
        </Box>
        <Typography sx={{marginTop: "40px"}}>My Assigned Tickets</Typography>
        <Box sx={{ 
            width: "100%", 
            height: "325px",
            typography: "body1",
            backgroundColor: "#dedede",
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            marginTop: "10px" 
        }}>
            {assignedTickets.length === 0 && <Typography sx={{margin: "auto"}}color="common.black"><b>You have no assigned tickets!</b></Typography>}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {assignedTickets.map(ticket => 
                    <div style={{ marginLeft: "40px", width: "380px", display: "flex", flexDirection: "column" }}>
                        {/* First card with heavy outline and "next in line" */}
                        <div 
                        style={{ 
                            border: ticket.dispensaryStatusEnum === "PREPARING" ? "4px solid #ffd45e" :
                                ticket.dispensaryStatusEnum === "READY_TO_COLLECT" ? "4px solid green" : "4px solid grey",
                            padding: "25px", 
                            paddingTop: "0px", 
                            backgroundColor: ticket.dispensaryStatusEnum === "PREPARING" ? "#ffd45e" :
                            ticket.dispensaryStatusEnum === "READY_TO_COLLECT" ? "green" : "grey" }}>
                            <Typography 
                                color={ticket.dispensaryStatusEnum === "PREPARING" ? "#000000" : "#ffffff"}
                                sx={{ textAlign: "center"}}>
                                <b>{ticket.dispensaryStatusEnum === "READY_TO_COLLECT" ? "READY FOR COLLECTION" : ticket.dispensaryStatusEnum}</b>
                            </Typography>
                            <Card sx={{ width: "325px" }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        HH-{ticket.appointmentId}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {ticket.firstName + " " + ticket.lastName}
                                    </Typography>
                                    <Typography variant="body2">
                                    From {ticket.departmentName}
                                    </Typography>
                                </CardContent>
                                {ticket.dispensaryStatusEnum === "READY_TO_COLLECT" ?
                                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <MDButton 
                                        size="small"
                                        color={ticket.arrived ? "secondary" : "success"}
                                        onClick={() => handlePatientArrived(ticket)}>
                                        {ticket.arrived ? "Reset Arrival" : "Patient Arrived"}
                                    </MDButton>
                                </CardActions> : <br/>}
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                    {ticket.dispensaryStatusEnum === "PREPARING" ?
                                    <>
                                        <MDButton 
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenModal(ticket)}>
                                            View / Update Medication
                                        </MDButton>
                                        <MDButton 
                                            size="small"
                                            color="success"
                                            onClick={() => handleOpenConfirmReadyModal(ticket)}
                                            disabled={!hasViewedMedication}>
                                            Ready for Collection
                                        </MDButton>
                                    </> : 
                                    ticket.dispensaryStatusEnum === "READY_TO_COLLECT" ?
                                    <>
                                        <MDButton 
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenModal(ticket)}>
                                            View Medication
                                        </MDButton>
                                        <MDButton 
                                            size="small"
                                            color={"warning"}
                                            disabled={!ticket.arrived}
                                            onClick={() => handleOpenDispenseModal(ticket)}>
                                            Dispense
                                        </MDButton>
                                    </> : 
                                    <>
                                        {/* <Button 
                                            size="small"
                                            onClick={() => handleOpenModal(ticket)}>
                                            View
                                        </Button> */}
                                        {/* {ticket.swimlaneStatusEnum === "PHARMACY" ?
                                        <MDButton 
                                            size="small"
                                            color={"error"}
                                            onClick={() => {setAppointment(ticket); getAdminStaffCurrentlyWorking(ticket.departmentName); setIsDialogOpen(true)}}>
                                            Assign to Staff
                                        </MDButton> : null} */}
                                    </>}
                                </CardActions>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </Box>
        {appointment && <AppointmentTicketModal
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            selectedAppointment={appointment}
            listOfWorkingStaff={listOfWorkingStaff}
            forceRefresh={forceRefresh}
            replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
            setCart={setCart}
            columnName={"Pharmacy"} />}
        {appointment && cart && <ConfirmReadyCollectionModal
            openModal={openConfirmReady}
            handleCloseModal={handleCloseConfirmReadyModal}
            appointment={appointment}
            forceRefresh={forceRefresh}
            cart={cart} />}
        {/* <AssignAppointmentDialog
            open={isDialogOpen}
            onConfirm={handleConfirmAssignDialog}
            onClose={handleCloseAssignDialog}
            listOfWorkingStaff={listOfAdminStaff}
            selectedAppointmentToAssign={appointment}
            assigningToSwimlane={"Discharge"}
        /> */}
        {appointment && cart && <ConfirmDispenseMedicationModal
            openModal={openDispenseModal}
            handleCloseModal={handleCloseDispenseModal}
            appointment={appointment}
            forceRefresh={forceRefresh}
            cart={cart} />}
        <ViewAllTicketsModal 
            openModal={isViewTicketsModalOpen}
            handleCloseModal={handleCloseTicketsModal}
            handleOpenModal={handleOpenModal}
            appointmentList={unassignedTickets}
        />
        <CreateNewTicket 
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onAppointmentCreated={forceRefresh}/>
    </>
  );
}

export default LiveQueue;

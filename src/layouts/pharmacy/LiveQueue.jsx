import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect } from "react";
import { Box, Button, Card, CardActions, CardContent, Tab, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";
import MDTypography from "components/MDTypography";
import { appointmentApi, staffApi } from "api/Api";

import { useState } from "react";
import { parseDateFromLocalDateTimeWithSecs } from "utility/Utility";
import AppointmentTicketModal from "./AppointmentTicketModal";


function LiveQueue() {
  const staff = useSelector(selectStaff);
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPharmacyTickets = async () => {
    try {
        const response = await appointmentApi.viewPharmacyTickets();
        console.log(response)
        if (response.status === 200) {
            const unassigned = response.data.filter(ticket => ticket.currentAssignedStaffId === null)
            const assigned = response.data.filter(ticket => ticket.currentAssignedStaffId === staff.staffId)
            // const sortedArr = response.data.sort((a,b) => parseDateFromLocalDateTimeWithSecs(a.actualDateTime) - parseDateFromLocalDateTimeWithSecs(b.actualDateTime))
            setUnassignedTickets(unassigned);
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
        console.log(error);
        // reduxDispatch(
        //   displayMessage({
        //     color: "warning",
        //     icon: "notification",
        //     title: "Error",
        //     content: error.response.data,
        //   })
        // );
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
        setAppointment(null);
      };
    
    const handleOpenModal = (appointment) => {
        setAppointment(appointment);
        setOpenModal(true);
    };

    const forceRefresh = () => {
        setLoading(true);
        getPharmacyTickets();
        getStaffCurrentlyWorking();
        setLoading(false);
      };

    function replaceItemByIdWithUpdated(id, newItem) {
        let newColumnList = [];
        let selectedColumnList = JSON.parse(JSON.stringify(assignedTickets));
        console.log(selectedColumnList)
        selectedColumnList.map((item) => {
            if (item.appointmentId === Number(id)) {
                newColumnList.push(newItem);
                setAppointment(newItem);
            } else {
                newColumnList.push(item);
            }
        });
        console.log(newColumnList)

        setAssignedTickets(newColumnList);
    }

    useEffect(() => {
        if (assignedTickets.length === 0 || unassignedTickets.length === 0) getPharmacyTickets();
        getStaffCurrentlyWorking();
    },[appointment, assignedTickets, loading])

  return (
    <>
        <Box sx={{ 
            width: "100%", 
            height: "275px",
            typography: "body1",
            backgroundColor: "#292D32",
            display: "flex",
            alignItems: "center",
            borderTopLeftRadius: "50px",
            borderBottomLeftRadius: "50px" 
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {unassignedTickets.map((ticket, index) => 
                    index === 0 ?
                    <div style={{ marginLeft: "40px", width: "380px", display: "flex", flexDirection: "column" }}>
                        {/* First card with heavy outline and "next in line" */}
                        <div style={{ border: "4px solid red", padding: "25px", paddingTop: "0px", backgroundColor: "#35C1CA" }}>
                            <Typography sx={{ textAlign: "center"}}><b>Next in Queue</b></Typography>
                            <Card sx={{ width: "325px" }} onClick={() => handleOpenModal(ticket)}>
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
                                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button 
                                        size="small"
                                        onClick={() => handleAssign(ticket.appointmentId)}>
                                        Assign to me
                                    </Button>
                                </CardActions>
                            </Card>
                        </div>
                    </div> : 
                        <Card sx={{
                            width: "325px",
                            marginLeft: "20px",
                        }}>
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
                            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                <br/>
                            </CardActions>
                        </Card>
                    
                )}
            </div>
        </Box>
        <Typography sx={{marginTop: "40px"}}>My Assigned Tickets</Typography>
        <Box sx={{ 
            width: "100%", 
            height: "250px",
            typography: "body1",
            backgroundColor: "#dedede",
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            marginTop: "10px" 
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {assignedTickets.map(ticket => 
                    <Card sx={{
                        width: "325px",
                        marginLeft: "20px",
                    }}
                    onClick={() => handleOpenModal(ticket)}>
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
                        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                            <Button size="small">View cart</Button>
                        </CardActions>
                        <CardActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
                            <Button size="small">Update Status</Button>
                            <Button size="small">View EHR</Button>
                        </CardActions>
                    </Card>
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
            columnName={"Pharmacy"} />}
    </>
  );
}

export default LiveQueue;

import React, { useEffect, useState} from 'react';
import Card from "@mui/material/Card";
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import axios from 'axios';
import { Button } from '@mui/material';
import { getShiftName, getTime, getColor, getColorLeave } from '../utils/utils';
import ViewShift from './ViewUpdateShift';
import AddShift from './AllocateShift';
import { shiftApi, leaveApi } from 'api/Api';

const buttonStyles = {
    backgroundColor: "white",
    border: "1px dashed grey",
    borderStyle: "dashed",
    color: "grey",
    height: 25,
    minWidth: 100,
    fontSize: "1.3rem"
}

function StaffShift({ username, staff, dateList, weekStartDate, updateAddShift, setUpdateAddShift }) {

    const [listOfDates, setListOfDates] = useState(dateList);
    const [addShiftDate, setAddShiftDate] = useState(weekStartDate);
    const [shifts, setShifts] = useState([]);
    const [leaves, setLeaves] = useState();
    const [currShift, setCurrShift] = useState();
    const [addShiftOpen, setAddShiftOpen] = useState(false);
    const [viewShiftOpen, setViewShiftOpen] = useState(false);
    let i = 0;

    const getAllShiftsForStaff = async () => {
        try {
            const response = await shiftApi.viewWeeklyRoster(username,weekStartDate);
            setShifts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllStaffLeaves = async (s) => {
        try {
            const response = await leaveApi.getAllStaffLeaves(s.staffId);
            const filteredLeaves = response.data.filter(leave => leave.approvalStatusEnum === "APPROVED");
            const object = {};
            for (let i=0; i<filteredLeaves.length; i++) {
                let leave = filteredLeaves[i];
                let start = moment(leave.startDate[0] + '-' + leave.startDate[1] + '-' + leave.startDate[2]);
                let end = moment(leave.endDate[0] + '-' + leave.endDate[1] + '-' + leave.endDate[2]);
                let curr = start.clone()
                while (curr.isSameOrBefore(end)) {
                    object[curr.format('YYYY-MM-DD')] = leave;
                    curr.add(1,'days');
                }
            }
            setLeaves(object);
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpen = (date, shift) => {
        if (shift) {
            setCurrShift(shift);
            setViewShiftOpen(true);
        } else {
            setAddShiftOpen(true);
        }
        setAddShiftDate(date);
    }

    const handleClose = () => {
        setAddShiftOpen(false);
        setViewShiftOpen(false);
    }

    const truncate = (input) => {
      return input?.length > 15 ? `${input.substring(0, 20)}...` : input;
    }

    useEffect(() => {
        setListOfDates(dateList);
        getAllStaffLeaves(staff);
        getAllShiftsForStaff();
    }, [shifts?.length, dateList, viewShiftOpen, addShiftOpen, weekStartDate, staff])

    return (
        <TableRow role="checkbox" tabIndex={-1} key={username} sx={{ display: 'flex'}}>
            <TableCell key={username} sx={{ width: 230, paddingLeft: "30px", marginTop: "10px"  }} align="left">
                {username === localStorage.getItem('staffUsername') ? <b>{truncate(staff.firstname + " " + staff.lastname) + " (You)"}</b> : truncate(staff.firstname + " " + staff.lastname)}
            </TableCell>
            {listOfDates?.map(date => {   
                if (i < shifts?.length && moment(shifts[i]?.startTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") === date.date) {
                    const shift = shifts[i++];
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={shift.id}>
                            <Card sx={{
                                backgroundColor: getColor(shift.startTime, shift.endTime),
                                width: 130,
                                alignContent: "center",
                                marginLeft: 1,
                                padding: 0,
                                borderRadius: 3
                            }} onClick={() => handleOpen(date.date, shift)}>
                                <CardActionArea>    
                                    <CardContent sx={{ padding: "0.5rem 0.3rem" }}>
                                        <Typography variant="body2">
                                            {getShiftName(getTime(shift.startTime), getTime(shift.endTime))}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary">
                                            {getTime(shift.startTime)} - {getTime(shift.endTime)}
                                        </Typography>
                                        <Typography variant="body3" sx={{fontSize: 11}}>
                                            {shift.facilityBooking.facility.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </TableCell>
                    );
                } 
                else if (leaves && leaves[date.date] != null) {
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={date.id}>
                            <Card sx={{
                                backgroundColor: getColorLeave(leaves[date.date].approvalStatusEnum),
                                width: 130,
                                height: 80,
                                alignContent: "center",
                                marginLeft: 1,
                                padding: 0,
                                borderRadius: 3
                            }}> 
                                <CardContent sx={{ padding: "0.5rem 0.5rem" }}>
                                    <Typography variant="body2" color="#ffffff">
                                        <b>{leaves[date.date].leaveTypeEnum + " leave"}</b>
                                    </Typography>
                                    <Typography variant="body3" color="#ffffff">
                                        {leaves[date.date].approvalStatusEnum}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </TableCell>
                    )
                }
                else {
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={date.id}>
                            <Button 
                                variant="contained"
                                style={buttonStyles}
                                onClick={() => handleOpen(date.date)}>
                                    + 
                            </Button>
                        </TableCell>
                    )
                }
                
            })}
            <ViewShift 
                open={viewShiftOpen}
                shift={currShift}
                facilityId={currShift ? currShift.facilityBooking.facility.facilityId : 1}
                handleClose={handleClose}
                username={username}
                staff={staff}
                updateAddShift={updateAddShift}
                setUpdateAddShift={setUpdateAddShift}
                />
            <AddShift 
                username={username}
                staff={staff}
                open={addShiftOpen}
                handleClose={handleClose}
                date={addShiftDate}
                updateAddShift={updateAddShift}
                setUpdateAddShift={setUpdateAddShift}
                />
        </TableRow>
    );
}

export default StaffShift;
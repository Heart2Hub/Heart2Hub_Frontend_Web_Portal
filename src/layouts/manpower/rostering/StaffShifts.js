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
import { getShiftName, getTime, getColor } from '../utils/utils';
import ViewShift from './ViewUpdateShift';
import AddShift from './AllocateShift';

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
    const [currShift, setCurrShift] = useState();
    const [addShiftOpen, setAddShiftOpen] = useState(false);
    const [viewShiftOpen, setViewShiftOpen] = useState(false);
    let i = 0;

    const getAllShiftsForStaff = async () => {
        const response = await axios.get(`http://localhost:8080/shift/viewWeeklyRoster/${username}?date=${weekStartDate}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        setShifts(response.data);
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

    useEffect(() => {
        setListOfDates(dateList);
        getAllShiftsForStaff();
    }, [shifts?.length, dateList, viewShiftOpen, addShiftOpen, weekStartDate])

    return (
        <TableRow role="checkbox" tabIndex={-1} key={username} sx={{ display: 'flex'}}>
            <TableCell key={username} sx={{ minWidth: 176, paddingLeft: "30px", marginTop: "10px"  }} align="left">
                {username === localStorage.getItem('staffUsername') ? <b>{staff.firstname + " " + staff.lastname + " (You)"}</b> : staff.firstname + " " + staff.lastname}
            </TableCell>
            {listOfDates?.map(date => {   
                if (i < shifts?.length && moment(shifts[i]?.startTime).day() === moment(date.date).day()) {
                    const shift = shifts[i];
                    i++;
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
                                    <CardContent sx={{ padding: "0.5rem 0.8rem" }}>
                                        <Typography variant="body2">
                                            {getShiftName(getTime(shift.startTime), getTime(shift.endTime))}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary">
                                            {getTime(shift.startTime)} - {getTime(shift.endTime)}
                                        </Typography>
                                        <Typography variant="body3">
                                            {shift.facilityBooking.facility.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </TableCell>
                    );
                } else {
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
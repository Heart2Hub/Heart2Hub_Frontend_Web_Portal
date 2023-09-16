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
import { getShiftName, getTime } from '../utils/utils';
import ViewShift from './ViewUpdateShift';
import AddShift from './AllocateShift';

const cardStyles = {
    backgroundColor: "#ffdc7a",
    maxWidth: 150,
    alignContent: "center",
    borderRadius: 3
}

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
                {staff.firstname + " " + staff.lastname} 
            </TableCell>
            {listOfDates?.map(date => {   
                if (i < shifts?.length && moment(shifts[i]?.startTime).day() === moment(date.date).day()) {
                    const shift = shifts[i];
                    i++;
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={shift.id}>
                            <Card sx={cardStyles} onClick={() => handleOpen(date.date, shift)}>
                                <CardActionArea>    
                                    <CardContent sx={{ padding: "0.5rem 1.2rem" }}>
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
                            <ViewShift 
                                open={viewShiftOpen}
                                shift={currShift}
                                handleClose={handleClose}
                                username={username}
                                staff={staff}
                                updateAddShift={updateAddShift}
                                setUpdateAddShift={setUpdateAddShift}
                                />
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={i}>
                            <Button 
                                variant="contained"
                                style={buttonStyles}
                                onClick={() => handleOpen(date.date)}>
                                    + 
                            </Button>
                            <AddShift 
                                username={username}
                                staff={staff}
                                open={addShiftOpen}
                                handleClose={handleClose}
                                date={addShiftDate}
                                updateAddShift={updateAddShift}
                                setUpdateAddShift={setUpdateAddShift}
                                />
                        </TableCell>
                    )
                }
                
            })}
        </TableRow>
    );
}

export default StaffShift;
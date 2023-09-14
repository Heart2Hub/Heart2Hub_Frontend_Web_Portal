import React, { useEffect, useState} from 'react';
import Card from "@mui/material/Card";
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import axios from 'axios';
import { Button } from '@mui/material';
import AddShift from './addShift';
import { getShiftName } from '../utils/utils';
import ViewShift from './ViewShift';


const cardStyles = {
    backgroundColor: "#ffdc7a",
    maxWidth: 150, 
    height: 120,
    alignContent: "center",
    borderRadius: 3
}

const buttonStyles = {
    backgroundColor: "white",
    border: "1px dashed grey",
    borderStyle: "dotted",
    color: "grey"
}

function StaffShift({ username, dateList, weekStartDate }) {

    const [staffUsername, setStaffUsername] = useState(username);
    const [listOfDates, setListOfDates] = useState(dateList);
    const [addShiftDate, setAddShiftDate] = useState(weekStartDate);
    const [shifts, setShifts] = useState([]);
    const [addShiftOpen, setAddShiftOpen] = useState(false);
    const [viewShiftOpen, setViewShiftOpen] = useState(false);
    const [currShift, setCurrShift] = useState();
    let i = 0;

    const getAllShiftsForStaff = async () => {
        const response = await axios.get(`http://localhost:8080/shift/viewWeeklyRoster/${staffUsername}?date=${weekStartDate}`, {
            headers: {
                'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0NzA3Mjg5LCJleHAiOjE2OTUzMTIwODl9.QXMJSDpR68FLpjwlm49aU9CZlHemJhpBqsllDIt0Kuo'}`
            }
        });
        setShifts(response.data);
    }

    const getTime = (dateTime) => {
        return moment(dateTime).format('HH:mm');
    }

    const handleOpen = (date, shift) => {
        if (shift) {
            setCurrShift(shift);
            setViewShiftOpen(true);
        } else {
            setAddShiftDate(date);
            setAddShiftOpen(true);
        }
    }

    const handleClose = () => {
        setAddShiftOpen(false);
        setViewShiftOpen(false);
    }

    useEffect(() => {
        setStaffUsername(username);
        setListOfDates(dateList);
        getAllShiftsForStaff();
    }, [shifts?.length, dateList, viewShiftOpen, addShiftOpen, weekStartDate])

    return (
        <TableRow role="checkbox" tabIndex={-1} key={staffUsername} sx={{ display: 'flex'}}>
            <TableCell sx={{ minWidth: 178, paddingLeft: "30px", marginTop: "10px"  }} align="left">
                {staffUsername}
            </TableCell>
            {listOfDates?.map(date => {   
                if (i < shifts?.length && moment(shifts[i]?.startTime).day() === moment(date.date).day()) {
                    const shift = shifts[i];
                    i++;
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={shift.id}>
                            <Card sx={cardStyles} onClick={() => handleOpen(date.date, shift)}>
                                <CardActionArea>    
                                    <CardContent>
                                        <Typography variant="h6">
                                            {getShiftName(getTime(shift.startTime), getTime(shift.endTime))}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary">
                                            Start: {getTime(shift.startTime)}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary">
                                            End: {getTime(shift.endTime)}
                                        </Typography>
                                        <Typography variant="h6">
                                            Facility:
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            <ViewShift 
                                open={viewShiftOpen}
                                shift={currShift}
                                handleClose={handleClose}
                                />
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px" }} align="center" key={date.id}>
                            <Button 
                                variant="contained"
                                style={buttonStyles}
                                onClick={() => handleOpen(date.date)}>
                                    Add shift
                            </Button>
                            <AddShift 
                                username={staffUsername}
                                open={addShiftOpen}
                                handleClose={handleClose}
                                date={addShiftDate}
                                />
                        </TableCell>
                    )
                }
                
            })}
        </TableRow>
    );
}

export default StaffShift;
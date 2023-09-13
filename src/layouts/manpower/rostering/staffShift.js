import React, { useEffect, useState} from 'react';
import Card from "@mui/material/Card";
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableRow';
import Typography from '@mui/material/TableRow';
import moment from 'moment';
import axios from 'axios';
import { Button } from '@mui/material';
import AddShift from './addShift';

function StaffShift({ username, dateToday, dateList }) {

    const [staffUsername, setStaffUsername] = useState(username);
    const [today, setToday] = useState(dateToday);
    const [listOfDates, setListOfDates] = useState(dateList);
    const [addShiftDate, setAddShiftDate] = useState(dateToday);
    const [shifts, setShifts] = useState([]);
    const [open, setOpen] = useState(false);
    let i = 0;

    const getAllShiftsForStaff = async () => {
        const response = await axios.get(`http://localhost:8080/shift/viewWeeklyRoster/${staffUsername}?date=${today}`, {
            headers: {
                'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0MTAyMzQ1LCJleHAiOjE2OTQ3MDcxNDV9.z1WgASSDpdrK9JLoGywGFZlisCLeb-MDugKpO0NYVnw'}`
            }
        });
        setShifts(response.data);
    }

    const getTime = (dateTime) => {
        return moment(dateTime).format('HH:mm');
    }

    const handleOpen = (date) => {
        setAddShiftDate(date);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        setStaffUsername(username);
        setToday(dateToday);
        setListOfDates(dateList);
        getAllShiftsForStaff();
    }, [shifts?.length, dateList, open])

    return (
        <TableRow role="checkbox" tabIndex={-1} key={staffUsername} sx={{ display: 'flex'}}>
            <TableCell sx={{ minWidth: 160, paddingLeft: "30px", marginTop: "10px"  }} align="left">
                {staffUsername}
            </TableCell>
            {listOfDates?.map(date => {   
                if (i < shifts?.length && moment(shifts[i]?.startTime).day() === moment(date.date).day()) {
                    const shift = shifts[i];
                    i++;
                    return (
                        <TableCell sx={{ minWidth: 170, minHeight: 100, marginTop: "10px"  }} align="center" key={shift.id}>
                            <Card sx={{ maxWidth: 150, alignContent: "center"}}>
                                <CardActionArea>    
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            Start: {getTime(shift.startTime)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            End: {getTime(shift.endTime)}
                                        </Typography>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Facility: 
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
                                style={{color: 'white'}}
                                onClick={() => handleOpen(date.date)}>
                                    Add shift
                            </Button>
                            <AddShift 
                                username={staffUsername}
                                open={open}
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
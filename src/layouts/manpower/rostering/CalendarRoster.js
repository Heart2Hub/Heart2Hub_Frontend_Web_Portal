import React, { useEffect, useState} from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ViewShift from './ViewUpdateShift';
import moment from 'moment';

// @mui material components
import Grid from "@mui/material/Grid";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { ExpandMore } from '@mui/icons-material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { getColor, getShiftName, getShiftTime, getTime } from '../utils/utils';
import { Button } from '@mui/material';
import { getShiftId } from '../utils/utils';

function CalendarRoster() {

    const [roster, setRoster] = useState([]);
    const [staffDetails, setStaffDetails] = useState();
    const [shift, setShift] = useState(0);
    const [currPref, setCurrPref] = useState();
    const [loading, setLoading] = useState(false);
    const [viewShiftOpen, setViewShiftOpen] = useState(false);
    const [event, setEvent] = useState();

    moment.locale('ko', {
        week: {
            dow: 1,
            doy: 1,
        },
    });
    const localizer = momentLocalizer(moment);
    const year = moment().format('YYYY');
    const month = moment().format('M');
    const navigate = useNavigate();

    const getMyMonthlyRoster = async () => {
        const response = await axios.get(`http://localhost:8080/shift/viewMonthlyRoster/${localStorage.getItem('staffUsername')}?year=${year}&month=${month}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        let data = [];
        for (let i=0; i<response.data.length; i++) {
            data.push({
                id: response.data[i].shiftId,
                title: getShiftName(getTime(response.data[i].startTime), getTime(response.data[i].endTime)),
                start: moment(response.data[i].startTime).toDate(),
                end: moment(response.data[i].endTime).toDate(),
                data: response.data[i]
            })
        }
        setRoster(data);
    }

    const getShiftPreference = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/shiftPreference/getShiftPreference/${localStorage.getItem('staffUsername')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setCurrPref(response.data);
            if (response.data) {
                setShift(getShiftId(moment(response.data.startTime, 'HH:mm:ss').format('HH:mm'), moment(response.data.endTime, 'HH:mm:ss').format('HH:mm')))
            } else {
                setShift(0);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const newReqBody = {
            startTime: "",
            endTime: ""
        }
        if (shift == 0) {
            if (currPref != null) {
                deleteShiftPreference(currPref.shiftPreferenceId);
            }
        } else {
            newReqBody.startTime = getShiftTime(shift)[0];
            newReqBody.endTime = getShiftTime(shift)[1];
            try {
                const response = await axios.post(`http://localhost:8080/shiftPreference/createShiftPreference`, newReqBody, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
    }

    const deleteShiftPreference = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/shiftPreference/deleteShiftPreference/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const getStaffByUsername = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/staff/getStaffByUsername?username=${localStorage.getItem('staffUsername')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setStaffDetails(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelect = (data) => {
        setEvent(data.data);
        handleOpen();  
    }

    const handleOpen = () => {
        setViewShiftOpen(true);
    }

    const handleClose = () => {
        setViewShiftOpen(false);
    }

    const handleChange = (event) => {
        setShift(event.target.value);
      };

    useEffect(() => {
        getStaffByUsername();
        getShiftPreference();
        getMyMonthlyRoster();
    },[loading])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
        <Grid item xs={12}>
            {staffDetails?.isHead ? 
            <>
            <Button 
                variant="contained"
                sx={{
                    fontSize: "1.2rem",
                    width: "250px",
                    height: "50px",
                    color: '#ffffff'
                }}
                onClick={() => navigate("/manpower/rostering/shifts")}
            >+ Allocate shifts</Button><br/><br/></> : <></>}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Shift Preference</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl>
                        <Typography variant="h6">Your current shift preference: {currPref ? currPref.startTime + " - " + currPref.endTime : "No preference"} </Typography>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            value={shift}
                            onChange={handleChange}
                        >
                            <FormControlLabel value={0} control={<Radio />} label="No preference" />
                            <FormControlLabel value={1} control={<Radio />} label="Shift 1 (00:00 - 08:00)" />
                            <FormControlLabel value={2} control={<Radio />} label="Shift 2 (08:00 - 16:00)" />
                            <FormControlLabel value={3} control={<Radio />} label="Shift 3 (16:00 - 23:59)" />
                        </RadioGroup>
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            style={{color: 'white', width: '100px'}}>
                            Save
                        </Button>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
            <MDBox pt={3}>
            <Calendar
                localizer={localizer}
                events={roster}
                onSelectEvent={handleSelect}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week"]}
                style={{ height: 1200 }}
                eventPropGetter={(event) => {
                    const backgroundColor = getColor(event.start, event.end);
                    const fontSize = '14px';
                    const color = 'black';
                    return { style: { backgroundColor, fontSize, color } }
                  }}
                  
                />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <ViewShift 
        open={viewShiftOpen}
        shift={event}
        handleClose={handleClose}
        />
    </DashboardLayout>
       
    )
}

export default CalendarRoster;
import React, { useEffect, useState} from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import moment from 'moment';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function CalendarRoster() {

    const [roster, setRoster] = useState([]);
    moment.locale('ko', {
        week: {
            dow: 1,
            doy: 1,
        },
    });
    const localizer = momentLocalizer(moment);

    const getMyMonthlyRoster = async () => {
        const response = await axios.get(`http://localhost:8080/shift/viewMonthlyRoster/staff2?year=2023&month=9`, {
            headers: {
                'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0NzA3Mjg5LCJleHAiOjE2OTUzMTIwODl9.QXMJSDpR68FLpjwlm49aU9CZlHemJhpBqsllDIt0Kuo'}`
            }
        });
        let data = [];
        console.log(response.data)
        for (let i=0; i<response.data.length; i++) {
            data.push({
                id: response.data[i].shiftId,
                title: 'Shift',
                start: moment(response.data[i].startTime).toDate(),
                end: moment(response.data[i].endTime).toDate()
            })
        }
        console.log(data)
        setRoster(data);
    }

    useEffect(() => {
        getMyMonthlyRoster();
    },[])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
        <Grid item xs={12}>
            <MDBox pt={3}>
            <Calendar
                localizer={localizer}
                events={roster}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week"]}
                style={{ height: 500 }}
                />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
       
    )
}

export default CalendarRoster;
import React, { useEffect, useState} from 'react'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import moment from 'moment';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import StaffShift from './staffShift';
import CalendarRoster from './CalendarRoster';

const dummyStaffs = [
    {
        staffId: 2,
        username: "staff2"
    },
    {
        staffId: 3,
        username: "staff3"
    }
]

function Rostering() {

    const [staffs, setStaffs] = useState(dummyStaffs);
    const [today, setToday] = useState();
    const [weekDates, setWeekDates] = useState();
    
    // const columns = [
    //     { id: 'username', label: 'Staff', minWidth: 170 },
    //     { id: 'mon', label: 'Monday', minWidth: 170 },
    //     { id: 'tues', label: 'Tuesday', minWidth: 170 },
    //     { id: 'wed', label: 'Wednesday', minWidth: 170 },
    //     { id: 'thurs', label: 'Thursday', minWidth: 170 },
    //     { id: 'fri', label: 'Friday', minWidth: 170 },
    //     { id: 'sat', label: 'Saturday', minWidth: 170 },
    //     { id: 'sun', label: 'Sunday', minWidth: 170 }
    //   ];

    const getWeekDates = (dateString) => {
        const currDate = moment(dateString);
        const currDayOfWeek = currDate.day();
        setToday(currDate.format('YYYY-MM-DD'));

        // Get date of Monday (start of the week)
        const startDate = moment(currDate).subtract(currDayOfWeek, 'days').startOf('day');

        // Get date of Sunday (end of the week)
        const endDate = moment(currDate).add(6 - currDayOfWeek, 'days').endOf('day');

        const dates = [];
        let i = 1;
        while (startDate.isSameOrBefore(endDate)) {
            dates.push({ id: i, date: startDate.format('YYYY-MM-DD') });
            startDate.add(1, 'days');
            i++;
        }
        setWeekDates(dates);
    }

    useEffect(() => {
        // getAllStaff();
        getWeekDates(moment().format('YYYY-MM-DD'));
        // getAllShifts();
    },[])

    return(
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                    Staff Roster
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
              <TableContainer sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key={1000}
                                style={{ minWidth: 170 }}
                            >
                            Staff
                            </TableCell>
                        {weekDates?.map((column) => (
                            <TableCell
                                key={column.id}
                                style={{ minWidth: 170, color: column.date === today ? 'brown' : 'black'}}
                            >
                            {column.date}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffs?.map((staff) => {
                            return (
                            <StaffShift 
                                username={staff.username}
                                dateToday={moment().format('YYYY-MM-DD')}
                                dateList={weekDates}>
                            </StaffShift>)
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
        </DashboardLayout>
    )
}

export default Rostering;
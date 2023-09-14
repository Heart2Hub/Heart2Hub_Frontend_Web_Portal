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
import { getDay } from '../utils/utils';
import { Button } from '@mui/material';

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
    const [weekDates, setWeekDates] = useState([]);
    const [monthDates, setMonthDates] = useState([]);
    const [prevDisable, setPrevDisable] = useState(true);
    const [nextDisable, setNextDisable] = useState(false);

    const today = moment().format('YYYY-MM-DD');

    const getWeekDates = (dateString) => {
        const currDate = moment(dateString);

        // Get date of Monday (start of the week)
        const startDate = currDate.clone().startOf('week').add(1, 'day');

        // Get date of Sunday (end of the week)
        const endDate = currDate.clone().endOf('week').add(1, 'day');

        const dates = [];
        let i = 0;
        while (startDate.isSameOrBefore(endDate)) {
            dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i) });
            startDate.add(1, 'days');
            i++;
        }

        for (let i=0; i<dates.length; i++) {
            if (dates[i].date === today) {
                setPrevDisable(true);
                break;
            }
            if (dates[i].date === monthDates[monthDates.length-1]?.date) {
                setNextDisable(true);
                break;
            }
            setPrevDisable(false);
            setNextDisable(false);
        }
        setWeekDates(dates);
    }

    const getMonthDates = (dateString) => {
        const currDate = moment(dateString);

        // Get date of Monday (start of the week)
        const startDate = currDate.clone().startOf('week').add(1, 'day');

        // Get date of exactly 1 month from Monday
        const endDate = currDate.add(1, 'months');

        const dates = [];
        let i = 0;
        while (startDate.isSameOrBefore(endDate)) {
            dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i) });
            startDate.add(1, 'days');
            i++;
            i = i % 7;
        }
        setMonthDates(dates);
    }

    const handleNext = () => {
        const lastDateOfWeek = moment(weekDates[weekDates.length-1].date);
        lastDateOfWeek.add(1, 'days');
        getWeekDates(lastDateOfWeek);
    }

    const handlePrev = () => {
        const firstDateOfWeek = moment(weekDates[0].date);
        firstDateOfWeek.subtract(2, 'days');
        getWeekDates(firstDateOfWeek);
    }

    useEffect(() => {
        // getAllStaff();
        getMonthDates(today);
        if (weekDates.length === 0) {
            getWeekDates(today);
        }
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
              <Button disabled={prevDisable} onClick={handlePrev}>Prev</Button>
                <Button disabled={nextDisable} onClick={handleNext}>Next</Button>
              <TableContainer sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key={1000}
                                style={{ minWidth: 160 }}
                            >
                            Staff
                            </TableCell>
                        {weekDates?.map((column) => (
                            <TableCell
                                key={column.id}
                                align="center"
                                style={{ minWidth: 170, color: column.date === today ? 'brown' : 'black'}}
                            >
                            {column.day}<br/>{column.date}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffs?.map((staff) => {
                            return (
                            <StaffShift 
                                username={staff.username}
                                dateList={weekDates}
                                weekStartDate={weekDates.length > 0 ? weekDates[0].date : today}>
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
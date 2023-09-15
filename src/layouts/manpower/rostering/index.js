import React, { useEffect, useState} from 'react'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import moment from 'moment';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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
import AddShiftConstraint from './AddShiftConstraint';
import { getTime, getShiftName } from '../utils/utils';
import ViewUpdateShiftConstraint from './ViewUpdateShiftConstraint';

const dummyStaffs = [
    {
        staffId: 1,
        username: "staff1"
    },
    {
        staffId: 2,
        username: "staff2"
    },
    {
        staffId: 3,
        username: "staff3"
    }
]

const cardStyles = {
    backgroundColor: "#ffffff",
    margin: 2,
    maxWidth: 300,
    alignContent: "center",
    borderRadius: 3
}

function Rostering() {

    const [loading, setLoading] = useState(false);
    const [staffs, setStaffs] = useState(dummyStaffs);
    const [weekDates, setWeekDates] = useState([]);
    const [monthDates, setMonthDates] = useState([]);
    const [prevDisable, setPrevDisable] = useState(true);
    const [nextDisable, setNextDisable] = useState(false);
    const [scOpen, setScOpen] = useState(false);
    const [updateScOpen, setUpdateScOpen] = useState(false);
    const [currSc, setCurrSc] = useState();
    const [scList, setScList] = useState([]);

    const today = moment().format('YYYY-MM-DD');

    const isValidWorkDate = async (date, role) => {
        try {
            const response = await axios.get(`http://localhost:8080/shiftConstraints/checkIsValidWorkday?role=${role}&date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0NzA3Mjg5LCJleHAiOjE2OTUzMTIwODl9.QXMJSDpR68FLpjwlm49aU9CZlHemJhpBqsllDIt0Kuo'}`
                }
            }); 
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getShiftConstraints = async (role) => {
        try {
            const response = await axios.get(`http://localhost:8080/shiftConstraints/getAllShiftConstraints/${role}`, {
                headers: {
                    'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0NzA3Mjg5LCJleHAiOjE2OTUzMTIwODl9.QXMJSDpR68FLpjwlm49aU9CZlHemJhpBqsllDIt0Kuo'}`
                }
            }); 
            console.log(response)
            setScList(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getWeekDates = async (dateString) => {
        const currDate = moment(dateString);

        // Get date of Monday (start of the week)
        const startDate = currDate.clone().startOf('week').add(1, 'day');

        // Get date of Sunday (end of the week)
        const endDate = currDate.clone().endOf('week').add(1, 'day');

        const dates = [];
        let i = 0;
        while (startDate.isSameOrBefore(endDate)) {
            if (await isValidWorkDate(startDate.format('YYYY-MM-DD'), "DOCTOR")) {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: "valid" });
            } else {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: "nope" });
            }
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
            if (isValidWorkDate(startDate.format('YYYY-MM-DD'), "DOCTOR")) {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: "valid" });
            } else {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: "nope" });
            }
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

    const handleScOpen = (sc) => {
        if (sc) {
            setCurrSc(sc);
            setUpdateScOpen(true);
        } else {
            setScOpen(true);
        }
    }

    const handleScClose = () => {
        setScOpen(false);
        setUpdateScOpen(false);
        setCurrSc(null);
    }

    useEffect(() => {
        // getAllStaff();
        getMonthDates(today);
        if (weekDates.length === 0) {
            getWeekDates(today);
        } 
        getShiftConstraints("DOCTOR");
    },[scOpen, updateScOpen])

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
              <Grid container>
                {scList.map(sc => {return (
                    <Card sx={cardStyles} onClick={() => handleScOpen(sc)}>
                        <CardContent sx={{ padding: "0.5rem 1.2rem" }}>
                            <Typography variant="h6">
                                {getShiftName(moment(sc.startTime, 'HH:mm:ss').format('HH:mm'), moment(sc.endTime, 'HH:mm:ss').format('HH:mm'))}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {sc.startTime} - {sc.endTime}
                            </Typography>
                            <Typography variant="h6">
                                Min pax: {sc.minPax}
                            </Typography>
                            <Typography variant="h6">
                                Role: {sc.roleEnum}
                            </Typography>
                        </CardContent>
                    </Card>
                )})}
                <ViewUpdateShiftConstraint 
                    open={updateScOpen}
                    shiftConstraint={currSc}
                    handleClose={handleScClose}
                    />
                </Grid>
              <Button disabled={prevDisable} onClick={handlePrev}>Prev</Button>
            <Button disabled={nextDisable} onClick={(handleNext)}>Next</Button>
            <Button onClick={() => handleScOpen()}>Add Shift Constraint</Button>
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
                            {column.day}<br/>{column.date}<br/>{column.valid}
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
                <AddShiftConstraint 
                    open={scOpen}
                    handleClose={handleScClose}
                    />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
        </DashboardLayout>
    )
}

export default Rostering;
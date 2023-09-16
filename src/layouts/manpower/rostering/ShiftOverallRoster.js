import React, { useEffect, useState} from 'react'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from 'react-router-dom';

import moment from 'moment';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

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
import StaffShift from './StaffShifts';
import { getDay } from '../utils/utils';
import { Button, Icon } from '@mui/material';
import AddShiftConstraint from './AddShiftConstraint';
import { getShiftName } from '../utils/utils';
import ViewUpdateShiftConstraint from './ViewUpdateShiftConstraint';

const cardStyles = {
    backgroundColor: "#ffffff",
    margin: 2,
    maxWidth: 300,
    alignContent: "center",
    borderRadius: 3
}

function Rostering() {

    const [staffs, setStaffs] = useState([]);
    const [currStaffDetails, setCurrStaffDetails] = useState();
    const [weekDates, setWeekDates] = useState([]);
    const [monthDates, setMonthDates] = useState([]);
    const [prevDisable, setPrevDisable] = useState(true);
    const [nextDisable, setNextDisable] = useState(false);
    const [scOpen, setScOpen] = useState(false);
    const [updateScOpen, setUpdateScOpen] = useState(false);
    const [updateAddShift, setUpdateAddShift] = useState(0);
    const [currSc, setCurrSc] = useState();
    const [scList, setScList] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    const today = moment().format('YYYY-MM-DD');

    const isValidWorkDate = async (date, role) => {
        try {
            const response = await axios.get(`http://localhost:8080/shiftConstraints/checkIsValidWorkday?role=${role}&date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }); 
            setScList(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getStaffByUsername = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/staff/getStaffByUsername?username=${localStorage.getItem('staffUsername')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setCurrStaffDetails(response.data);
            getStaffListByRole(response.data.roleEnum);
        } catch (error) {
            console.log(error);
        }
    }

    const getStaffListByRole = async (role) => {
        try {
            const response = await axios.get(`http://localhost:8080/staff/getStaffByRole?role=${role}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setStaffs(response.data);
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
            if (await isValidWorkDate(startDate.format('YYYY-MM-DD'), currStaffDetails.roleEnum)) {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: true });
            } else {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: false });
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
            if (isValidWorkDate(startDate.format('YYYY-MM-DD'), currStaffDetails.roleEnum)) {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: true });
            } else {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: false });
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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        // getAllStaffWithSameRole();
        if (!currStaffDetails) {
            getStaffByUsername();
        } else {
            getStaffListByRole(currStaffDetails.roleEnum);
            getShiftConstraints(currStaffDetails.roleEnum);
            getMonthDates(today);
            if (weekDates.length === 0) {
                getWeekDates(today);
            } else {
                getWeekDates(weekDates[0].date);
            }
        }
    },[scOpen, updateScOpen, currStaffDetails, updateAddShift])

    if (currStaffDetails && !currStaffDetails.isHead) {
        navigate("/error")
    }

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
                    Staff Roster (Role: {currStaffDetails?.roleEnum})
                </MDTypography>
              </MDBox>
              <MDBox pt={3}> 
                {scList.length > 0 ? <Typography variant="h6" paddingLeft={2}>Shift constraints for {currStaffDetails?.roleEnum}:</Typography> : <></>}
              <Grid container>
                {scList.map(sc => {return (
                    <Card key={sc.shiftConstraintsId} sx={cardStyles} onClick={() => handleScOpen(sc)}>
                        <CardActionArea>   
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
                            </CardContent>
                        </CardActionArea>  
                    </Card>
                )})}
                <ViewUpdateShiftConstraint 
                    open={updateScOpen}
                    shiftConstraint={currSc}
                    handleClose={handleScClose}
                    />
                </Grid>
                <Grid container spacing={1}>
                    <Grid item md={9}>
                        <Button 
                            onClick={() => handleScOpen()} 
                            variant="contained"
                            sx={{
                                marginLeft: "20px",
                                fontSize: "12px",
                                color: '#ffffff'
                            }}
                        >+ Add Shift Constraint</Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button disabled={prevDisable} onClick={handlePrev} sx={{ fontSize: "14px"}}>Prev</Button>
                        <Button disabled={nextDisable} onClick={(handleNext)} sx={{ fontSize: "14px"}}>Next</Button>
                    </Grid>
                </Grid>
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
                                    {column.day}<br/>{column.date}<br/>
                                    {column.valid ? <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={'success'}>done</Icon> 
                                    : <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={'warning'}>warning</Icon>}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {staffs && staffs
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((staff) => {
                                return (
                                <StaffShift 
                                    key={staff.staffId}
                                    username={staff.username}
                                    staff={staff}
                                    dateList={weekDates}
                                    weekStartDate={weekDates.length > 0 ? weekDates[0].date : today}
                                    updateAddShift={updateAddShift}
                                    setUpdateAddShift={setUpdateAddShift}>
                                </StaffShift>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 15, 25]}
                    component="div"
                    count={staffs?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <AddShiftConstraint 
                    open={scOpen}
                    handleClose={handleScClose}
                    role={currStaffDetails ? currStaffDetails.roleEnum : "temp"}
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
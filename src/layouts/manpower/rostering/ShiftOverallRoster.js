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
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import StaffShift from './StaffShifts';
import { getDay } from '../utils/utils';
import { Button, Icon } from '@mui/material';
import AddShiftConstraint from './AddShiftConstraint';
import { getShiftName, getScColor } from '../utils/utils';
import ViewUpdateShiftConstraint from './ViewUpdateShiftConstraint';

import { staffApi } from 'api/Api';
import { shiftConstraintsApi } from 'api/Api';
import { facilityApi } from 'api/Api';

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
    const [facilities, setFacilities] = useState([]);
    const navigate = useNavigate();

    moment.updateLocale('en', {
        week: {
          dow: 1, // Monday is the first day of the week.
        }
      });

    const today = moment().format('YYYY-MM-DD');

    const isValidWorkDate = async (date, role, department) => {
        try {
            const response = await shiftConstraintsApi.checkIsValidWorkDay(role,date,department);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getAllShiftConstraints = async (role, department) => {
        try {
            const response = await shiftConstraintsApi.getAllShiftConstraints(role, department);
            setScList(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getStaffByUsername = async () => {
        try {
            const response = await staffApi.getStaffByUsername(localStorage.getItem('staffUsername'));
            setCurrStaffDetails(response.data);
            getStaffListByRole(response.data.staffRoleEnum);
        } catch (error) {
            console.log(error);
        }
    }

    const getStaffListByRole = async (role, unit) => {
        try {
            const response = await staffApi.getStaffListByRole(role, unit);
            const usernameSortedArray = response.data.sort((a,b) => a.username.localeCompare(b.username))
            const sortedArray = usernameSortedArray.sort((a,b) => {
                if (a.username === localStorage.getItem('staffUsername')) {
                    return -1;
                } else {
                    return 0;
                }
            })
            setStaffs(sortedArray);
        } catch (error) {
            console.log(error);
        }
    }

    const getWeekDates = async (dateString) => {
        const currDate = moment(dateString);

        // Get date of Monday (start of the week)
        const startDate = currDate.clone().startOf('week');

        // Get date of Sunday (end of the week)
        const endDate = currDate.clone().endOf('week');

        const dates = [];
        let i = 0;
        while (startDate.isSameOrBefore(endDate)) {
            if ((await isValidWorkDate(startDate.format('YYYY-MM-DD'), currStaffDetails.staffRoleEnum, currStaffDetails?.unit.name)).length == 0) {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: true });
            } else {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: false, reason: (await isValidWorkDate(startDate.format('YYYY-MM-DD'), currStaffDetails.staffRoleEnum, currStaffDetails?.unit.name))[0]});
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

    const getMonthDates = async (dateString) => {
        const currDate = moment(dateString);

        // Get date of Monday (start of the week)
        const startDate = currDate.clone().startOf('week')

        // Get date of exactly 1 month from Monday
        const endDate = currDate.add(2, 'months');

        const dates = [];
        let i = 0;
        while (startDate.isSameOrBefore(endDate)) {
            if ((await isValidWorkDate(startDate.format('YYYY-MM-DD'), currStaffDetails.staffRoleEnum, currStaffDetails?.unit.name)).length == 0) {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: true });
            } else {
                dates.push({ id: i, date: startDate.format('YYYY-MM-DD'), day: getDay(i), valid: false, reason: (await isValidWorkDate(startDate.format('YYYY-MM-DD'), currStaffDetails.staffRoleEnum, currStaffDetails?.unit.name))[0]});
            }
            startDate.add(1, 'days');
            i++;
            i = i % 7;
        }
        setMonthDates(dates);
    }

    const getFacilitiesByDepartment = async (unitName) => {
        try {
            const response = await facilityApi.getAllFacilitiesByDepartmentName(unitName);
            setFacilities(response.data);
        } catch (error) {
            console.log(error);
        }
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
        if (!currStaffDetails) {
            getStaffByUsername();
        } else {
            getFacilitiesByDepartment(currStaffDetails.unit?.name)
            getStaffListByRole(currStaffDetails.staffRoleEnum, currStaffDetails.unit?.name);
            getAllShiftConstraints(currStaffDetails.staffRoleEnum, currStaffDetails.unit?.name);
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
                    Staff Roster 
                </MDTypography>
              </MDBox>
              <MDBox pt={3}> 
                <Typography variant="h5" paddingLeft={2}>{currStaffDetails?.staffRoleEnum === "NURSE" && currStaffDetails?.unit.wardClass? "Ward" : "Department"}: {currStaffDetails?.unit.name}</Typography>
                <Typography variant="h5" paddingLeft={2} paddingBottom={1}>Role: {currStaffDetails?.staffRoleEnum}</Typography>
                {scList.length > 0 ? <Typography variant="h6" paddingLeft={2}>Shift constraints:</Typography> : <></>}
              <Grid container>
                {scList.map(sc => {return (
                    <Card 
                        key={sc.shiftConstraintsId} 
                        sx={{
                            backgroundColor: getScColor(getShiftName(moment(sc.startTime, 'HH:mm:ss').format('HH:mm'), moment(sc.endTime, 'HH:mm:ss').format('HH:mm'))),
                            margin: 2,
                            maxWidth: 200,
                            alignContent: "center",
                            borderRadius: 3
                        }}
                        onClick={() => handleScOpen(sc)}>
                        <CardActionArea>   
                            <CardContent sx={{ padding: "0.5rem 1.2rem" }}>
                                <Typography variant="body2">
                                    {getShiftName(moment(sc.startTime, 'HH:mm:ss').format('HH:mm'), moment(sc.endTime, 'HH:mm:ss').format('HH:mm'))}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {sc.startTime} - {sc.endTime}
                                </Typography>
                                <Typography variant="h6">
                                    Min pax: {sc.minPax}
                                </Typography>
                                <Typography variant="subtitle" fontSize="14px">
                                    {currStaffDetails?.staffRoleEnum === "NURSE" && currStaffDetails?.unit.wardClass ? currStaffDetails?.unit.name : sc.facility.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>  
                    </Card>
                )})}
                <ViewUpdateShiftConstraint 
                    open={updateScOpen}
                    shiftConstraint={currSc}
                    handleClose={handleScClose}
                    facilities={facilities}
                    unit={currStaffDetails ? currStaffDetails.unit.name : ""}
                    role={currStaffDetails ? currStaffDetails.staffRoleEnum : ""}
                    staff={currStaffDetails}
                    />
                </Grid>
                <Grid container spacing={1}>
                    <Grid item md={10}>
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
                                    style={{ minWidth: 215 }}
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
                                    {column.valid ? 
                                    <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={'success'}>done</Icon> : 
                                    <Tooltip title={column.reason}>
                                        <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={'warning'}>warning</Icon>
                                    </Tooltip>}
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
                                    setUpdateAddShift={setUpdateAddShift}
                                    facilities={facilities}>
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
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <AddShiftConstraint 
        open={scOpen}
        handleClose={handleScClose}
        role={currStaffDetails ? currStaffDetails.staffRoleEnum : "temp"}
        facilities={facilities ? facilities : []}
        unit={currStaffDetails ? currStaffDetails.unit.name : ""}
        staff={currStaffDetails}
        />
    </DashboardLayout>
    )
}

export default Rostering;
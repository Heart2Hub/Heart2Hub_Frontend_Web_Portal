import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { IconButton, Icon } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import React, { useEffect, useState } from "react";
import { IMAGE_SERVER } from "constants/RestEndPoint";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { problemRecordApi, ehrApi } from "api/Api";
import {
  selectEHRRecord,
  setEHRRecord,
  updateEHRRecord,
} from "../../../store/slices/ehrSlice";
import { selectStaff } from "../../../store/slices/staffSlice";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import {
  parseDateFromLocalDateTime,
  formatDateToYYYYMMDD,
} from "utility/Utility";
import { appointmentApi, staffApi, shiftApi } from "api/Api";
import { LensTwoTone } from "@mui/icons-material";

function EHRRecord() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [nextOfKinEhrs, setNextOfKinEhrs] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openResolveProblemRecordModal, setOpenResolveProblemRecordModal] =
    useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    createdBy: "",
    createdDate: "",
    priorityEnum: "",
    problemTypeEnum: "",
  });
  const [referralFormData, setReferralFormData] = useState({
    prevAppointmentId: "",
    description: "",
    bookedDateTime: "",
    departmentName: "",
    staffUsername: ""
  });
  const [staffList, setStaffList] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTimeslot, setSelectedTimeslot] = useState();
  const [selectedStaff, setSelectedStaff] = useState();
  const [currAppt, setCurrAppt] = useState();
  const today = dayjs();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenReferralModal = (appt) => {
    setCurrAppt(appt);
    setIsReferralModalOpen(true);
  }

  const handleCloseReferralModal = () => {
    setIsReferralModalOpen(false);
  }

  const handleOpenResolveProblemRecordModal = () => {
    setOpenResolveProblemRecordModal(true);
  };

  const handleCloseResolveProblemRecordModal = () => {
    setOpenResolveProblemRecordModal(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReferralChange = (event) => {
    const { name, value } = event.target;
    setReferralFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProblemRecord = () => {
    try {
      if (formData.description.trim() == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Description cannot be null",
          })
        );
        return;
      }
      if (formData.priorityEnum == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Priority cannot be null",
          })
        );
        return;
      }
      if (formData.problemTypeEnum == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Problem type cannot be null",
          })
        );
        return;
      }
      formData.createdBy =
        loggedInStaff.staffRoleEnum +
        " " +
        loggedInStaff.firstname +
        " " +
        loggedInStaff.lastname;
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")} ${currentDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${currentDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${currentDate
                .getSeconds()
                .toString()
                .padStart(2, "0")}`;
      formData.createdDate = formattedDate;
      problemRecordApi
        .createProblemRecord(ehrRecord.electronicHealthRecordId, formData)
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfProblemRecords: [
              ...ehrRecord.listOfProblemRecords,
              response.data,
            ],
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          setFormData({
            description: "",
            createdBy: "",
            createdDate: "",
            priorityEnum: "",
            problemTypeEnum: "",
          });
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Created Facility!",
              content: formData.problemTypeEnum + " created",
            })
          );
          handleCloseModal();
        })
        .catch((err) => {
          console.log(err);
          setFormData({
            description: "",
            createdBy: "",
            createdDate: "",
            priorityEnum: "",
            problemTypeEnum: "",
          });
          // Weird functionality here. If allow err.response.detail when null whle react application breaks cause error is stored in the state. Must clear cache. Something to do with the state.
          if (err.response.data.detail) {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data.detail,
              })
            );
          } else {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data,
              })
            );
          }
          console.log(err.response.data.detail);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleResolveProblemRecord = (problemRecord) => {
    try {
      problemRecordApi
        .resolveProblemRecord(
          ehrRecord.electronicHealthRecordId,
          problemRecord.problemRecordId
        )
        .then((response) => {
          const updatedEhrRecord = {
            ...ehrRecord,
            listOfProblemRecords: ehrRecord.listOfProblemRecords.filter(
              (record) =>
                record.problemRecordId !== problemRecord.problemRecordId
            ),
            listOfMedicalHistoryRecords: [
              ...ehrRecord.listOfMedicalHistoryRecords,
              response.data,
            ],
          };
          reduxDispatch(updateEHRRecord(updatedEhrRecord));
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Resolved Problem Record!",
              content: response.data.problemTypeEnum + " resolved",
            })
          );
        })
        .catch((err) => {
          console.log(err);
          // Weird functionality here. If allow err.response.detail when null whle react application breaks cause error is stored in the state. Must clear cache. Something to do with the state.
          if (err.response.data.detail) {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data.detail,
              })
            );
          } else {
            reduxDispatch(
              displayMessage({
                color: "error",
                icon: "notification",
                title: "Error Encountered",
                content: err.response.data,
              })
            );
          }
          console.log(err.response.data.detail);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  function generateAvailableTimeSlots(staff, selectedDate) {
    const selectedDateObj = new Date(selectedDate);
    const staffShifts = staff.shifts.filter((shift) => {
      const shiftStartTime = new Date(shift.startTime);
      const shiftEndTime = new Date(shift.endTime);

      // Extract the hours from the shift start and end times
      const shiftStartHours = shiftStartTime.getHours();
      const shiftEndHours = shiftEndTime.getHours();

      // Check if the shift falls on the selected date
      const isShiftOnSelectedDate =
        selectedDateObj.getDate() === shiftStartTime.getDate() &&
        selectedDateObj.getMonth() === shiftStartTime.getMonth() &&
        selectedDateObj.getFullYear() === shiftStartTime.getFullYear();

      // Check if the shift is between 8 AM and 4 PM
      const isShiftBetween8AMAnd4PM =
        shiftStartHours >= 8 && shiftEndHours <= 16;

      return isShiftOnSelectedDate && isShiftBetween8AMAnd4PM;
    });

    if (staffShifts.length === 0) {
      return []; // No available time slots if no shifts on the selected date
    }

    // Sort staff shifts by start time to determine the earliest and latest shift
    staffShifts.sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    const earliestShiftStartTime = new Date(staffShifts[0].startTime);
    const latestShiftEndTime = new Date(
      staffShifts[staffShifts.length - 1].endTime
    );

    let availableTimeSlots = [];
    const startTime = new Date(earliestShiftStartTime);
    const endTime = new Date(latestShiftEndTime);

    while (startTime < endTime) {
      let slotEndTime = new Date(startTime);
      slotEndTime.setHours(startTime.getHours() + 1);

      // Check if the time slot falls within any staff shift
      const slotWithinShift = staffShifts.some((shift) => {
        const shiftStartTime = new Date(shift.startTime);
        const shiftEndTime = new Date(shift.endTime);
        return startTime >= shiftStartTime && slotEndTime <= shiftEndTime;
      });

      // Check if staff has any existing appointments during this time
      const slotHasAppointment = upcomingAppointments.some((appointment) => {
        const appointmentStartTime = new Date(
          Number(appointment.bookedDateTime[0]),
          Number(appointment.bookedDateTime[1]) - 1,
          Number(appointment.bookedDateTime[2]),
          Number(appointment.bookedDateTime[3]),
          Number(appointment.bookedDateTime[4])
        );
        const appointmentEndTime = new Date(appointmentStartTime);
        appointmentEndTime.setHours(appointmentEndTime.getHours() + 1);

        return (
          startTime >= appointmentStartTime &&
          slotEndTime <= appointmentEndTime &&
          appointment.listOfStaffsId &&
          appointment.listOfStaffsId.length > 0 &&
          appointment.listOfStaffsId[0] == staff.staffId
          // appointment.currentAssignedStaffId === staff.staffId
        );
      });

      if (
        startTime.getFullYear() == new Date().getFullYear() &&
        startTime.getMonth() == new Date().getMonth() &&
        startTime.getDate() == new Date().getDate()
      ) {
        console.log("same day so skip");
      } else if (slotWithinShift && !slotHasAppointment) {
        availableTimeSlots.push({
          startTime: startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: slotEndTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      startTime.setHours(startTime.getHours() + 1);
    }

    return availableTimeSlots;
  }

  const convertToDate = (dateString, timeString) => {
    let startTime = timeString.startTime;
    const origDateTime = dayjs(dateString, 'DD/MM/YYYY').format("YYYY-MM-DD");
    const newDateStr = `${origDateTime}T${startTime}:00`;
    return newDateStr;
  };

  const handleCreateReferral = async () => {
    const dateString = convertToDate(selectedDate, selectedTimeslot);
    try {
      console.log(currAppt.appointmentId)
      console.log(referralFormData.description)
      console.log(dateString)

      const response = await appointmentApi.createReferral(currAppt.appointmentId, referralFormData.description, dateString, referralFormData.departmentName, selectedStaff.username)
      if (response.status === 200) {
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Successfully Created Referral!",
            content: "Referral for " + ehrRecord.firstName + " " + ehrRecord.lastName + " has been created!",
          })
        );
      }
      setIsReferralModalOpen(false);
      setReferralFormData({
        prevAppointmentId: "",
        description: "",
        bookedDateTime: "",
        departmentName: "",
        staffUsername: ""
      })
      setSelectedDate(null);
      setSelectedTimeslot(null);
      setSelectedStaff(null);
      setCurrAppt(null);
    } catch (error) {
      console.log(error)
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error encountered",
          content: "Error creating referral",
        })
      );
    }
  }

  const handleSelectTime = (staff, slot) => {
    setSelectedTimeslot(slot);
    setSelectedStaff(staff);
  }

  useEffect(() => {
    const fetchDataSequentially = async () => {
      const nextOfKinDataArray = [];
      for (const nextOfKin of ehrRecord.listOfNextOfKinRecords) {
        try {
          const response = await ehrApi.getElectronicHealthRecordByNric(
            nextOfKin.nric
          );
          const data = response.data;
          nextOfKinDataArray.push(data);
        } catch (error) {
          console.error("Error fetching EHR data:", error);
        }
      }
      setNextOfKinEhrs(nextOfKinDataArray);
      try {
        const response = await appointmentApi.viewPatientAppointments(
          ehrRecord.username
        );
        const allAppointments = response.data;
        for (const appointment of allAppointments) {
          if (
            parseDateFromLocalDateTime(appointment.bookedDateTime) > new Date()
          ) {
            if (
              !upcomingAppointments.some(
                (existingAppointment) =>
                  existingAppointment.appointmentId ===
                  appointment.appointmentId
              )
            ) {
              setUpcomingAppointments((prevAppointments) => [
                ...prevAppointments,
                appointment,
              ]);
            }
          } else {
            // ADD PAST APPOINTMENT LOGIC HERE LATER ON
          }
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };
    fetchDataSequentially();
  }, [ehrRecord.listOfNextOfKinRecords, selectedDate]);

  useEffect(() => {
    const getAvailabilities = (dateStr, staffs) => {
      const date = new Date(dateStr);
      const selectedYear = date.getFullYear();
      const selectedMonth = date.getMonth();
      const selectedDay = date.getDate();
      const availableStaff = staffs.filter((staff) => {
        const staffShifts = staff.shifts.filter((shift) => {
          const shiftStartTime = new Date(shift.startTime);
          const shiftEndTime = new Date(shift.endTime);
          const shiftStartYear = shiftStartTime.getFullYear();
          const shiftStartMonth = shiftStartTime.getMonth();
          const shiftStartDay = shiftStartTime.getDate();

          const shiftEndYear = shiftEndTime.getFullYear();
          const shiftEndMonth = shiftEndTime.getMonth();
          const shiftEndDay = shiftEndTime.getDate();

          // Compare the extracted date components
          const isShiftOnSelectedDate =
            selectedYear === shiftStartYear &&
            selectedMonth === shiftStartMonth &&
            selectedDay === shiftStartDay &&
            selectedYear === shiftEndYear &&
            selectedMonth === shiftEndMonth &&
            selectedDay === shiftEndDay;

          const isShiftBetween8AMAnd4PM =
            shiftStartTime.getHours() >= 8 && shiftEndTime.getHours() <= 16;

          return isShiftOnSelectedDate && isShiftBetween8AMAnd4PM;
        });
        // Check if staff has shifts on the selected date
        return staffShifts.length > 0;
      });
      console.log(availableStaff)
      return availableStaff;
    };

    const getStaffListByRole = async (departmentName) => {
      try {
        const response = await staffApi.getStaffListByRole(
          "DOCTOR",
          departmentName
        );
        const staffs = response.data;
        for (let i = 0; i < staffs.length; i++) {
          const rosterResponse = await shiftApi.viewOverallRoster(
            staffs[i].username
          );
          const shifts = rosterResponse.data;
          staffs[i].shifts = shifts;
        }
        setStaffList(getAvailabilities(selectedDate, staffs));
      } catch (error) {
        console.log(error);
      }
    };
    if (referralFormData.departmentName && referralFormData.departmentName.length > 0) {
      getStaffListByRole(referralFormData.departmentName);
    }
  }, [referralFormData.departmentName, selectedDate]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header>
        <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="patient EHR information:"
            info={{
              firstName: ehrRecord.firstName,
              lastName: ehrRecord.lastName,
              birthDate: ehrRecord.dateOfBirth.split(" ")[0],
              address: ehrRecord.address,
              contactNumber: ehrRecord.contactNumber,
            }}
            shadow={false}
          />
        </MDBox>
      </Header>

      <MDBox position="relative" mb={5}>
        <MDBox position="relative" minHeight="5rem" />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            List of Problem Records:
            {ehrRecord.listOfProblemRecords.map((problemRecord, index) => (
              <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ProfileInfoCard
                      key={index}
                      title={`Problem ${index + 1}`}
                      info={{
                        createdBy: problemRecord.createdBy,
                        createdDate: problemRecord.createdDate.split(" ")[0],
                        description: problemRecord.description,
                        priority: problemRecord.priorityEnum,
                        problemType: problemRecord.problemTypeEnum,
                      }}
                      shadow={false}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    {loggedInStaff.staffRoleEnum === "DOCTOR" && (
                      <>
                        <MDButton
                          variant="contained"
                          color="primary"
                          onClick={handleOpenResolveProblemRecordModal}
                        >
                          Resolve Problem Record
                        </MDButton>
                        <Dialog
                          open={openResolveProblemRecordModal}
                          onClose={handleCloseResolveProblemRecordModal}
                        >
                          <DialogTitle>Confirm Resolution</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Are you sure you want to resolve this problem
                              record?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <MDButton
                              onClick={handleCloseResolveProblemRecordModal}
                              color="primary"
                            >
                              Cancel
                            </MDButton>
                            <MDButton
                              onClick={() => {
                                handleCloseResolveProblemRecordModal();
                                handleResolveProblemRecord(problemRecord);
                              }}
                              color="primary"
                            >
                              Confirm
                            </MDButton>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            ))}
            {loggedInStaff.staffRoleEnum === "DOCTOR" && (
              <MDBox mx={2} mt={3} px={2}>
                <MDButton
                  Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create New Problem Record
                  <Icon>add</Icon>
                </MDButton>
              </MDBox>
            )}
          </Typography>
        </Card>
      </MDBox>

      <MDBox position="relative" mb={5}>
        <MDBox position="relative" minHeight="5rem" />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            List of Upcoming Appointments:
            {upcomingAppointments.map((upcomingAppointment, index) => (
              <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ProfileInfoCard
                      key={index}
                      title={`Appointment ${index + 1}`}
                      info={{
                        bookedDateTime: formatDateToYYYYMMDD(
                          parseDateFromLocalDateTime(
                            upcomingAppointment.bookedDateTime
                          )
                        ),
                        departmentName: upcomingAppointment.departmentName,
                        description: upcomingAppointment.description,
                        estimatedDuration:
                          upcomingAppointment.estimatedDuration,
                      }}
                      shadow={false}
                    />
                  </MDBox>
                </Grid>
                {upcomingAppointment.swimlaneStatusEnum === "CONSULTATION" &&
                  upcomingAppointment.currentAssignedStaffId === loggedInStaff.staffId &&
                  parseDateFromLocalDateTime(upcomingAppointment.bookedDateTime).getDate() === new Date().getDate() &&
                  parseDateFromLocalDateTime(upcomingAppointment.bookedDateTime).getMonth() === new Date().getMonth() &&
                  parseDateFromLocalDateTime(upcomingAppointment.bookedDateTime).getFullYear() === new Date().getFullYear() &&
                  <MDButton
                    onClick={() => handleOpenReferralModal(upcomingAppointment)}
                    variant="gradient"
                    color="primary"
                  >
                    Make A Referral
                  </MDButton>}
              </Grid>
            ))}
          </Typography>
        </Card>
      </MDBox>

      {loggedInStaff.staffRoleEnum === "DOCTOR" && (
        <MDBox position="relative" mb={5}>
          <MDBox position="relative" minHeight="5rem" />
          <Card
            sx={{
              position: "relative",
              mt: -8,
              mx: 3,
              py: 2,
              px: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              List of Medical History Records:
            </Typography>
            {ehrRecord.listOfMedicalHistoryRecords.map(
              (medicalRecord, index) => (
                <ProfileInfoCard
                  key={index}
                  title={`Medical History ${index + 1}`}
                  info={{
                    createdBy: medicalRecord.createdBy,
                    createdDate: medicalRecord.createdDate.split(" ")[0],
                    resolvedDate: medicalRecord.resolvedDate.split(" ")[0],
                    description: medicalRecord.description,
                    priority: medicalRecord.priorityEnum,
                    problemType: medicalRecord.problemTypeEnum,
                  }}
                  shadow={false}
                />
              )
            )}
          </Card>
        </MDBox>
      )}

      {loggedInStaff.staffRoleEnum === "DOCTOR" && (
        <MDBox position="relative" mb={5}>
          <MDBox position="relative" minHeight="5rem" />
          <Card
            sx={{
              position: "relative",
              mt: -8,
              mx: 3,
              py: 2,
              px: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              List of Next of Kin Records:
            </Typography>
            {ehrRecord.listOfNextOfKinRecords.map((nextOfKinRecord, index) => {
              // Check if nextOfKinRecord.nric exists in nextOfKinEhrs
              const ehrMatch = nextOfKinEhrs.find(
                (ehr) => ehr.nric === nextOfKinRecord.nric
              );
              return (
                <Accordion key={index}>
                  <AccordionSummary>
                    <Typography variant="h6">
                      {nextOfKinRecord.relationship}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {ehrMatch ? (
                      // Render the EHR data here if a match is found
                      <MDBox>
                        <Typography>NRIC: {ehrMatch.nric}</Typography>
                        <Divider
                          orientation="horizontal"
                          sx={{ ml: -2, mr: 1 }}
                        />
                        {ehrMatch.listOfMedicalHistoryRecords.map(
                          (medicalHistory, medicalHistoryIndex) => (
                            <MDBox key={medicalHistoryIndex}>
                              <MDBox mb={1.5}>
                                <ProfileInfoCard
                                  key={index}
                                  title={`Medical History ${index + 1}`}
                                  info={{
                                    createdBy: medicalHistory.createdBy,
                                    createdDate:
                                      medicalHistory.createdDate.split(" ")[0],
                                    resolvedDate:
                                      medicalHistory.resolvedDate.split(" ")[0],
                                    description: medicalHistory.description,
                                    priority: medicalHistory.priorityEnum,
                                    problemType: medicalHistory.problemTypeEnum,
                                  }}
                                  shadow={false}
                                />
                              </MDBox>
                            </MDBox>
                          )
                        )}
                        <Divider
                          orientation="horizontal"
                          sx={{ ml: -2, mr: 1 }}
                        />
                        {ehrMatch.listOfProblemRecords.map(
                          (problem, problemIndex) => (
                            <MDBox key={problemIndex}>
                              <ProfileInfoCard
                                key={index}
                                title={`Problem ${index + 1}`}
                                info={{
                                  createdBy: problem.createdBy,
                                  createdDate:
                                    problem.createdDate.split(" ")[0],
                                  description: problem.description,
                                  priority: problem.priorityEnum,
                                  problemType: problem.problemTypeEnum,
                                }}
                                shadow={false}
                              />
                            </MDBox>
                          )
                        )}
                      </MDBox>
                    ) : (
                      <MDBox>
                        <Typography variant="h6">
                          {nextOfKinRecord.nric}
                        </Typography>
                        <Divider
                          orientation="horizontal"
                          sx={{ ml: -2, mr: 1 }}
                        />
                        <Typography>
                          No EHR data found for this next of kin.
                        </Typography>
                      </MDBox>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Card>
        </MDBox>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Create New Problem Record</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priorityEnum"
              value={formData.priorityEnum}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="problemTypeEnum"
              value={formData.problemTypeEnum}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="ALLERGIES_AND_IMMUNOLOGIC">
                Allergies and Immunologic
              </MenuItem>
              <MenuItem value="CARDIOVASCULAR">Cardiovascular</MenuItem>
              <MenuItem value="DENTAL_AND_ORAL">Dental and Oral</MenuItem>
              <MenuItem value="DERMATOLOGIC">Dermatologic</MenuItem>
              <MenuItem value="GASTROINTESTINAL">Gastrointestinal</MenuItem>
              <MenuItem value="ENDOCRINE_AND_METABOLIC">
                Endocrine and Metabolic
              </MenuItem>
              <MenuItem value="ENVIRONMENTAL_AND_SOCIAL">
                Environmental and Social
              </MenuItem>
              <MenuItem value="EYE_AND_EAR">Eye and Ear</MenuItem>
              <MenuItem value="GENITOURINARY_SYSTEM">
                Genitourinary System
              </MenuItem>
              <MenuItem value="GYNECOLOGIC">Gynecologic</MenuItem>
              <MenuItem value="HEMATOLOGIC">Hematologic</MenuItem>
              <MenuItem value="HEPATIC_AND_PANCREATIC">
                Hepatic and Pancreatic
              </MenuItem>
              <MenuItem value="INFECTIOUS_DISEASES">
                Infectious Diseases
              </MenuItem>
              <MenuItem value="INJURIES_AND_ACCIDENTS">
                Injuries and Accidents
              </MenuItem>
              <MenuItem value="INTEGUMENTARY_SYSTEM">
                Integumentary System
              </MenuItem>
              <MenuItem value="NEOPLASMS">Neoplasms</MenuItem>
              <MenuItem value="NERVOUS_SYSTEM">Nervous System</MenuItem>
              <MenuItem value="NUTRITIONAL">Nutritional</MenuItem>
              <MenuItem value="OBSTETRIC">Obstetric</MenuItem>
              <MenuItem value="OPTHALMOLOGIC">Ophthalmologic</MenuItem>
              <MenuItem value="OTOLOGIC_AND_LARYNGOLOGIC">
                Otologic and Laryngologic
              </MenuItem>
              <MenuItem value="OTHERS">Others</MenuItem>
              <MenuItem value="PEDIATRIC_AND_DEVELOPMENTAL">
                Pediatric and Developmental
              </MenuItem>
              <MenuItem value="POISONING">Poisoning</MenuItem>
              <MenuItem value="PSYCHIATRIC_MENTAL_HEALTH">
                Psychiatric Mental Health
              </MenuItem>
              <MenuItem value="REPRODUCTIVE">Reproductive</MenuItem>
              <MenuItem value="RESPIRATORY">Respiratory</MenuItem>
              <MenuItem value="SURGICAL_AND_POSTOPERATIVE">
                Surgical and Postoperative
              </MenuItem>
              <MenuItem value="TRAUMA_AND_ORTHOPEDIC">
                Trauma and Orthopedic
              </MenuItem>
              <MenuItem value="UROLOGIC">Urologic</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleCreateProblemRecord} color="primary">
            Create
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog open={isReferralModalOpen} onClose={handleCloseReferralModal} fullWidth
        maxWidth="md">
        <DialogTitle>Make a Referral</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select
              name="departmentName"
              value={referralFormData.departmentName}
              onChange={handleReferralChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="Cardiology">Cardiology</MenuItem>
              <MenuItem value="Orthopedics">Orthopedics</MenuItem>
              <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              <MenuItem value="Neurology">Neurology</MenuItem>
              <MenuItem value="Emergency Medicine">Emergency Medicine</MenuItem>
              <MenuItem value="Surgery">Surgery</MenuItem>
              <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
              <MenuItem value="Radiology">Radiology</MenuItem>
            </Select>

            {referralFormData.departmentName &&
              referralFormData.departmentName.length > 0 &&
              <>
                <br /><hr /><br />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={referralFormData.description}
                  onChange={handleReferralChange}
                  margin="dense"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Select Appointment Date"
                      format="DD/MM/YYYY"
                      value={selectedDate}
                      minDate={dayjs().add(1, 'day')}
                      onChange={(newValue) => setSelectedDate(newValue)} />
                  </DemoContainer>
                </LocalizationProvider><br />

                {selectedDate &&
                  staffList.map(staff =>
                    <>
                      <Grid item xs={12} md={6} lg={3}>
                        <Typography sx={{ fontSize: "16px" }}>Dr. {staff.firstname + " " + staff.lastname}</Typography>
                        {generateAvailableTimeSlots(staff, selectedDate).map(slot =>
                          <MDButton
                            circular
                            color={selectedStaff?.staffId === staff.staffId &&
                              selectedTimeslot.startTime === slot.startTime &&
                              selectedTimeslot.endTime === slot.endTime ? "dark" : "light"}
                            sx={{ margin: '5px' }}
                            onClick={() => handleSelectTime(staff, slot)}>
                            {slot.startTime + " - " + slot.endTime}
                          </MDButton>)}
                      </Grid><br /></>)}
              </>
            }
          </FormControl>

        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseReferralModal} color="primary">
            Cancel
          </MDButton>
          <MDButton disabled={!selectedStaff || !selectedDate || !selectedTimeslot} onClick={handleCreateReferral} color="primary">
            Create
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EHRRecord;


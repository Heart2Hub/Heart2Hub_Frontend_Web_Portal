import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { appointmentApi } from "../../../api/Api";
import { displayMessage } from "../../../store/slices/snackbarSlice";

import moment from "moment";
import { TextField } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { formatDateToYYYYMMDD } from "utility/Utility";
import { parseDateFromYYYYMMDD } from "utility/Utility";
import { addDurationToDate } from "utility/Utility";
import ViewAppointmentModal from "./ViewAppointmentModal";
import { parseDateFromLocalDateTime } from "utility/Utility";

function CalenderView() {
  const reduxDispatch = useDispatch();
  const staff = useSelector(selectStaff);

  moment.locale("ko", {
    week: {
      dow: 1,
      doy: 1,
    },
  });
  const localizer = momentLocalizer(moment);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [startDateDisplay, setStartDateDisplay] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDateDisplay, setEndDateDisplay] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  );

  const getCalendarRangeView = async () => {
    // need plus 1 since month starts with 0
    const response = await appointmentApi.viewAllAppointmentsByRange(
      startDateDisplay.getDate(),
      startDateDisplay.getMonth() + 1,
      startDateDisplay.getFullYear(),
      endDateDisplay.getDate(),
      endDateDisplay.getMonth() + 1,
      endDateDisplay.getFullYear(),
      staff.unit.name,
      0
    );
    let data = [];
    let listOfAppts = response.data;
    listOfAppts.map((appointment) => {
      const {
        appointmentId,
        firstName,
        lastName,
        // actualDateTime,
        bookedDateTime,
        estimatedDuration,
      } = appointment;
      data.push({
        id: appointmentId,
        title: firstName + " " + lastName,
        start: parseDateFromLocalDateTime(bookedDateTime),
        end: addDurationToDate(
          parseDateFromLocalDateTime(bookedDateTime),
          estimatedDuration
        ),
        data: appointment,
      });
    });
    setAppointments(data);
  };

  const handleSelect = (data) => {
    setSelectedAppointment(data.data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleStartDateChange = (e) => {
    let newStartDate = parseDateFromYYYYMMDD(e.target.value);
    if (newStartDate > endDateDisplay) {
      newStartDate = endDateDisplay;

      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Information:",
          content: "start date cannot be later than end date",
        })
      );
    }
    setStartDateDisplay(newStartDate);
  };

  const handleEndDateChange = (e) => {
    let newEndDate = parseDateFromYYYYMMDD(e.target.value);

    console.log(newEndDate < startDateDisplay);
    if (newEndDate < startDateDisplay) {
      newEndDate = startDateDisplay;

      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Information:",
          content: "end date cannot be earlier than start date",
        })
      );
    }
    setEndDateDisplay(newEndDate);
  };

  const handleChangeDateRange = () => {
    setLoading(true);
    getCalendarRangeView();

    reduxDispatch(
      displayMessage({
        color: "info",
        icon: "notification",
        title: "Refreshing View",
        content: "Updated Appointment View",
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    getCalendarRangeView();
  }, [loading]);

  return (
    <>
      <>
        <MDBox
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h5" fontWeight="medium" color="text">
            Selected Date Range: &nbsp;
          </MDTypography>
          <TextField
            type="date"
            label="Start Date"
            value={formatDateToYYYYMMDD(startDateDisplay)}
            onChange={handleStartDateChange}
            required
            sx={{ marginRight: "16px" }}
          />
          <TextField
            type="date"
            label="End Date"
            value={formatDateToYYYYMMDD(endDateDisplay)}
            onChange={handleEndDateChange}
            required
            sx={{ marginRight: "16px" }}
          />
          <MDBox sx={{ alignItems: "center", justifyContent: "center" }}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleChangeDateRange}
              size="medium"
              sx={{ marginRight: "16px" }}
            >
              <MDTypography variant="h5" fontWeight="medium" color="white">
                Refresh Dates
              </MDTypography>
            </MDButton>
          </MDBox>
        </MDBox>
      </>

      <br />

      <Calendar
        localizer={localizer}
        events={appointments}
        onSelectEvent={handleSelect}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week"]}
        style={{ height: 1200 }}
      />

      <ViewAppointmentModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedAppointment={selectedAppointment}
      />
    </>
  );
}

export default CalenderView;

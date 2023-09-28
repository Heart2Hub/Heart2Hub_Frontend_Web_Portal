import MDBox from "components/MDBox";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Grid } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appointmentApi } from "../../api/Api";

import moment from "moment";
// import { getColor } from '../utils/utils';

function CalenderView() {
  moment.locale("ko", {
    week: {
      dow: 1,
      doy: 1,
    },
  });
  const localizer = momentLocalizer(moment);

  const [appointments, setAppointments] = useState([]);
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const getCalendarMonthView = async () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    //need plus 1 since month starts with 0
    const response = await appointmentApi.viewAllAppointmentsByMonth(
      currentMonth + 1,
      currentYear
    );
    let data = [];
    let listOfAppts = response.data;
    console.log(listOfAppts);
    console.log(listOfAppts.length);
    listOfAppts.map((appointment) => {
      const { appointmentId, description, comments, actualDateTime } =
        appointment;
      actualDateTime[1] -= 1;
      data.push({
        id: appointmentId,
        title: appointmentId,
        start: new Date(...actualDateTime.slice(0, 3), 0, 0, 0),
        end: new Date(...actualDateTime.slice(0, 3), 23, 59, 0),
        data: description,
      });
    });
    setAppointments(data);
  };

  const handleSelect = (data) => {
    console.log("open");
  };

  useEffect(() => {
    getCalendarMonthView();
  }, [loading]);

  return (
    <>
      <Calendar
        localizer={localizer}
        events={appointments}
        onSelectEvent={handleSelect}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week"]}
        style={{ height: 1200 }}
        // eventPropGetter={(event) => {
        //   const backgroundColor = getColor(
        //     event.start,
        //     event.end,
        //     event.data
        //   );
        //   const fontSize = "14px";
        //   const color =
        //     getColor(event.start, event.end, event.data) === "#5e5e5e"
        //       ? "white"
        //       : "black";
        //   return { style: { backgroundColor, fontSize, color } };
        // }}
      />
    </>
  );
}

export default CalenderView;

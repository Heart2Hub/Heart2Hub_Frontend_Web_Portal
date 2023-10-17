import { Card, Typography, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import {
  selectEHRRecord,
  setEHRRecord,
  updateEHRRecord,
} from "../../../../store/slices/ehrSlice";
import { parseDateFromLocalDateTime } from "utility/Utility";
import { useState } from "react";
import { appointmentApi } from "api/Api";
import { useEffect } from "react";
import { formatDateToYYYYMMDD } from "utility/Utility";

function AppointmentsBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const handlefetchAppointmentData = async () => {
    try {
      const response = await appointmentApi.viewPatientAppointments(
        ehrRecord.username
      );
      const allAppointments = response.data;
      setUpcomingAppointments([]);
      for (const appointment of allAppointments) {
        if (
          parseDateFromLocalDateTime(appointment.bookedDateTime) > new Date()
        ) {
          if (
            !upcomingAppointments.some(
              (existingAppointment) =>
                existingAppointment.appointmentId === appointment.appointmentId
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

  useEffect(() => {
    handlefetchAppointmentData();
  }, [ehrRecord]);

  return (
    <>
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
              </Grid>
            ))}
          </Typography>
        </Card>
      </MDBox>
    </>
  );
}

export default AppointmentsBox;

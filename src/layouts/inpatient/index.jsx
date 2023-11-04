import React from "react";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { appointmentApi, staffApi, admissionApi, wardApi } from "api/Api";
import { useEffect } from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import { Icon, Box, Tab, Tabs } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "./inpatient.css";
import CreateAppointmentModal from "./CreateAppointmentModal";

import StaffListSidePanel from "./StaffListSidePanel";
import MDBox from "components/MDBox";
import { useDispatch } from "react-redux";
import { displayMessage } from "store/slices/snackbarSlice";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import { useRef } from "react";
import AdmissionDialog from "./AdmissionDialog";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import AdmissionCard from "./AdmissionCard";

import NoAdmissionCard from "./NoAdmissionCard";
import AdmissionTicketModal from "./AdmissionTicketModal";

function Inpatient() {
  const staff = useSelector(selectStaff);
  const localizer = momentLocalizer(moment);

  const currentHour = new Date().getHours();
  const customDayView = {
    start: moment().hour(currentHour),
    end: moment().add(1, "day").hour(22), // 10 pm the next day
  };

  const reduxDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  //for handling filtering
  const [selectStaffToFilter, setSelectStaffToFilter] = useState(null);

  //for side panel to show list of staff working
  const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);

  //for displaying admissions
  const [currentDayAdmissions, setCurrentDayAdmissions] = useState([]);
  const [admissionsByRoom, setAdmissionsByRoom] = useState([]);
  const [room, setRoom] = useState(1);

  //for opening admission ticket modal
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  //force a refresh for modal assigning
  const forceRefresh = () => {
    setLoading(true);
    getAdmissions();
    getStaffCurrentlyWorking();
    setLoading(false);
  };

  //get List of currently working staffs
  const getStaffCurrentlyWorking = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndWard(
      staff.unit.name
    );
    setListOfWorkingStaff(response.data);
  };

  const getAdmissions = async () => {
    const response = await admissionApi.getAdmissionsForWard(staff.unit.name);
    let admissions = response.data;
    if (selectStaffToFilter) {
      admissions = admissions.filter((admission) =>
        admission.listOfStaffsId.includes(selectStaffToFilter)
      );
    }

    setCurrentDayAdmissions(admissions);

    const filtered = admissions.filter((admission) => admission.room === 1);
    const admissionsInBedOrder = filtered.sort((a, b) => a.bed - b.bed);
    setAdmissionsByRoom(admissionsInBedOrder);
  };

  useEffect(() => {
    getStaffCurrentlyWorking();
    getAdmissions();
    //console.log(staff);
    //console.log(selectStaffToFilter);
  }, [selectStaffToFilter]);

  const handleChangeRoom = (event, selectedRoom) => {
    setRoom(selectedRoom);
    const filtered = currentDayAdmissions.filter(
      (admission) => admission.room === selectedRoom
    );
    const admissionsInBedOrder = filtered.sort((a, b) => a.bed - b.bed);
    setAdmissionsByRoom(admissionsInBedOrder);
  };

  const handleSelectStaffToFilter = (staffId) => {
    setSelectStaffToFilter(staffId);
    const filtered = currentDayAdmissions.filter(
      (admission) =>
        admission.listOfStaffsId.includes(staffId) && admission.room === room
    );
    const admissionsInBedOrder = filtered.sort((a, b) => a.bed - b.bed);
    setAdmissionsByRoom(admissionsInBedOrder);
  };

  const handleSelectAdmission = (admission) => {
    setSelectedAdmission(admission);
    setOpenModal(true);
  };

  const handleUpdateAdmission = (updatedAdmission) => {
    setSelectedAdmission(updatedAdmission);
    setOpenModal(true);
    const updatedAdmissions = admissionsByRoom.map((existingAdmission) => {
      if (updatedAdmission.admissionId === existingAdmission.admissionId) {
        return updatedAdmission;
      }
      return existingAdmission;
    });
    setAdmissionsByRoom(updatedAdmissions);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const dischargeTomorrow = async () => {
    const tomorrow = moment().add(1, "days");
    tomorrow.seconds(0);
    tomorrow.minutes(0);
    tomorrow.hours(12);
    const tomorrowDateString = tomorrow.format("YYYY-MM-DDTHH:mm:ss");
    await admissionApi.handleDischarge(tomorrowDateString);
    forceRefresh();
  };

  const allocateTomorrow = async () => {
    const tomorrow = moment().add(1, "days");
    tomorrow.seconds(0);
    tomorrow.minutes(0);
    tomorrow.hours(13);
    const tomorrowDateString = tomorrow.format("YYYY-MM-DDTHH:mm:ss");
    await admissionApi.handleAllocateIncoming(tomorrowDateString);
    forceRefresh();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDTypography
        sx={{
          fontSize: "2.5rem", // Adjust the size as per your preference
          textAlign: "center",
          fontWeight: "bold", // Makes the font-weight bold
          marginTop: "1rem", // Adds some top margin
          marginBottom: "1rem", // Adds some bottom margin
        }}
      >
        Ward {staff.unit.name}
      </MDTypography>
      <MDTypography sx={{ textAlign: "center" }}>{}</MDTypography>

      <MDBox sx={{ display: "flex", width: "100%" }}>
        <MDBox className="staff-list">
          <StaffListSidePanel
            handleSelectStaffToFilter={handleSelectStaffToFilter}
            selectStaffToFilter={selectStaffToFilter}
            listOfWorkingStaff={listOfWorkingStaff}
          />
        </MDBox>

        <MDBox>
          {/* <MDButton onClick={dischargeTomorrow}>Discharge</MDButton>
          <MDButton onClick={allocateTomorrow}>Allocate</MDButton> */}
          <Tabs
            value={room}
            onChange={handleChangeRoom}
            style={{ marginTop: "10px", width: "500px" }}
          >
            <Tab label="Room 1" value={1} />
            <Tab label="Room 2" value={2} />
            <Tab label="Room 3" value={3} />
          </Tabs>

          <MDBox className="admission-calendar">
            {admissionsByRoom.length > 0 ? (
              admissionsByRoom.map((admission, index) => (
                <Calendar
                  className={index === 0 ? "has-time" : "no-time"}
                  localizer={localizer}
                  defaultView={Views.DAY}
                  startAccessor="start"
                  endAccesor="end"
                  events={[
                    {
                      title: "Admission Ticket",
                      start: new Date(),
                      end: new Date(),
                      allDay: true,
                    },
                  ]}
                  components={{
                    event: () =>
                      admission.duration === null ? (
                        <div className="no-admission">
                          <NoAdmissionCard admission={admission} />
                        </div>
                      ) : (
                        <AdmissionCard
                          appointment={admission}
                          index={index}
                          listOfWorkingStaff={listOfWorkingStaff}
                          forceRefresh={forceRefresh}
                          handleSelectAdmission={handleSelectAdmission}
                        />
                      ),
                  }}
                />
              ))
            ) : (
              <p>No Admissions assigned to you</p>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
      {selectedAdmission && (
        <AdmissionTicketModal
          key={selectedAdmission.admissionId}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedAppointment={selectedAdmission}
          listOfWorkingStaff={listOfWorkingStaff}
          forceRefresh={forceRefresh}
          handleUpdateAdmission={handleUpdateAdmission}
        />
      )}
    </DashboardLayout>
  );
}

export default Inpatient;

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

import {
  Icon,
  Box,
  Tab,
  Tabs,
  Popper,
  Paper,
  Fade,
  Modal,
} from "@mui/material";
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

import AdmissionTicketModal from "./AdmissionTicketModal";
import { parseDateFromLocalDateTime } from "utility/Utility";
import MedicationOrderModal from "./MedicationOrderModal";
import { medicationOrderApi } from "api/Api";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { parseDateFromYYYYMMDDHHMMSS } from "utility/Utility";

const beds = [
  { id: 1, title: "Bed 1" },
  { id: 2, title: "Bed 2" },
  { id: 3, title: "Bed 3" },
  { id: 4, title: "Bed 4" },
  { id: 5, title: "Bed 5" },
  { id: 6, title: "Bed 6" },
];

const events = [
  {
    id: 1,
    title: "Meeting 1",
    start: moment("2023-11-06T10:00:00").toDate(), // Specify the date and time of the event
    end: moment("2023-11-06T11:00:00").toDate(),
  },
];

function Inpatient() {
  const staff = useSelector(selectStaff);
  const localizer = momentLocalizer(moment);
  const reduxDispatch = useDispatch();

  //for handling filtering
  const [selectStaffToFilter, setSelectStaffToFilter] = useState(null);

  //for side panel to show list of staff working
  const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);

  //for displaying admissions
  const [wards, setWards] = useState([]);
  const [displayedWard, setDisplayedWard] = useState("");
  const [currentDayAdmissions, setCurrentDayAdmissions] = useState([]);
  const [calendarResources, setCalendarResources] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [room, setRoom] = useState(1);

  //for opening admission ticket modal
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [admissionTicketModal, setAdmissionTicketModal] = useState(false);

  //for opening medication order modal
  const [medicationOrderModal, setMedicationOrderModal] = useState(false);
  const [selectedSlotStart, setSelectedSlotStart] = useState(null);
  const [selectedSlotEnd, setSelectedSlotEnd] = useState(null);
  const [existingMedicationOrders, setExistingMedicationOrders] = useState([]);

  //helper method to map admissions to resources and events for calendar
  const mapAdmissionsToResourcesAndEvents = async (admissions) => {
    console.log(admissions);
    const resources = admissions
      .map((admission) => {
        return {
          id: admission.bed,
          title: `Bed ${admission.bed}`,
        };
      })
      .sort((a, b) => a.id - b.id);

    setCalendarResources(resources);

    const events = [];

    for (const admission of admissions) {
      const startDate = parseDateFromLocalDateTime(admission.admissionDateTime);
      const endDate = parseDateFromLocalDateTime(admission.dischargeDateTime);
      endDate.setDate(endDate.getDate() + 1);

      // Admission Ticket Card
      const admissionTicketEvent = {
        id: admission.admissionId,
        title: "Admission",
        start: startDate,
        end: endDate,
        allDay: true,
        resourceId: admission.bed,
      };
      events.push(admissionTicketEvent);

      const medicationOrders = await getMedicationOrders(
        admission.listOfMedicationOrderIds
      );

      const slotCount = {};

      for (const medicationOrder of medicationOrders) {
        const startDate = medicationOrder.startDate;

        if (!slotCount.hasOwnProperty(startDate)) {
          slotCount[startDate] = [medicationOrder];
        } else {
          slotCount[startDate].push(medicationOrder);
        }
      }

      console.log(slotCount);

      // Medication orders
      const slots = Object.entries(slotCount);

      for (const [startDateString, medicationOrders] of slots) {
        const startDate = parseDateFromYYYYMMDDHHMMSS(startDateString);
        const endDate = parseDateFromYYYYMMDDHHMMSS(startDateString);
        endDate.setHours(endDate.getHours() + 1);

        const medicationOrderEvent = {
          id: 0,
          title: `${medicationOrders.length} Medication Order(s)`,
          start: startDate,
          end: endDate,
          resourceId: admission.bed,
          medicationOrders: medicationOrders,
        };
        events.push(medicationOrderEvent);
      }
    }

    setCalendarEvents(events);
  };

  //helper method to get medication orders from medication order ids
  const getMedicationOrders = async (medicationOrderIds) => {
    const medicationOrderPromises = medicationOrderIds.map((id) =>
      medicationOrderApi.getMedicationOrderById(id)
    );
    const medicationOrderResponses = await Promise.all(medicationOrderPromises);
    const listOfMedicationOrders = medicationOrderResponses.map(
      (response) => response.data
    );
    //console.log(listOfMedicationOrders);
    return listOfMedicationOrders;
  };

  const getInitialViewForDepartmentStaff = async () => {
    const staffAdmissionsResponse = await admissionApi.getAdmissionsForStaff(
      staff.staffId
    );
    const staffAdmissions = staffAdmissionsResponse.data;

    //get list of wards that doctor is assigned to
    let wards = [];
    for (let i = 0; i < staffAdmissions.length; i++) {
      const ward = staffAdmissions[i].ward;
      if (!wards.includes(ward)) {
        wards.push(ward);
      }
    }
    setWards(wards);
    setDisplayedWard(wards[0]);

    //get list of ward staff for the first ward
    const wardStaffResponse =
      await staffApi.getStaffsWorkingInCurrentShiftAndWard(wards[0]);
    setListOfWorkingStaff(wardStaffResponse.data);

    //get admissions for the first ward
    const wardAdmissionsResponse = await admissionApi.getAdmissionsForWard(
      wards[0]
    );
    const wardAdmissions = wardAdmissionsResponse.data;
    //console.log(wardAdmissions);
    const wardAdmissionsAssignedToStaff = wardAdmissions.filter((admission) =>
      admission.listOfStaffsId.includes(staff.staffId)
    );

    setCurrentDayAdmissions(wardAdmissionsAssignedToStaff);

    //filter by room 1
    let roomOneAdmissions = wardAdmissionsAssignedToStaff.filter(
      (admission) => admission.room === 1
    );

    mapAdmissionsToResourcesAndEvents(roomOneAdmissions);
  };

  const getInitialViewForWardStaff = async () => {
    setDisplayedWard(staff.unit.name);

    //get list of ward staff for the first ward
    const wardStaffResponse =
      await staffApi.getStaffsWorkingInCurrentShiftAndWard(staff.unit.name);
    setListOfWorkingStaff(wardStaffResponse.data);

    const wardAdmissionsResponse = await admissionApi.getAdmissionsForWard(
      staff.unit.name
    );
    const wardAdmissions = wardAdmissionsResponse.data;

    setCurrentDayAdmissions(wardAdmissions);

    //filter by room 1
    let roomOneAdmissions = wardAdmissions.filter(
      (admission) => admission.room === 1
    );

    mapAdmissionsToResourcesAndEvents(roomOneAdmissions);
  };

  // useEffect(() => {
  //   console.log(staff);
  //   if (staff.staffRoleEnum === "ADMIN" || staff.staffRoleEnum === "NURSE") {
  //     getInitialViewForWardStaff();
  //   } else {
  //     getInitialViewForDepartmentStaff();
  //   }
  // }, []);

  useEffect(() => {
    if (!medicationOrderModal) {
      if (staff.staffRoleEnum === "ADMIN" || staff.staffRoleEnum === "NURSE") {
        getInitialViewForWardStaff();
      } else {
        getInitialViewForDepartmentStaff();
      }
    }
  }, [medicationOrderModal]);

  const handleChangeWard = async (event, selectedWard) => {
    setSelectStaffToFilter(null);
    setRoom(1);
    setDisplayedWard(selectedWard);

    //get list of ward staff for new ward
    const wardStaffResponse =
      await staffApi.getStaffsWorkingInCurrentShiftAndWard(selectedWard);
    setListOfWorkingStaff(wardStaffResponse.data);

    //get admissions for new ward
    const wardAdmissionsResponse = await admissionApi.getAdmissionsForWard(
      selectedWard
    );
    const wardAdmissions = wardAdmissionsResponse.data;

    setCurrentDayAdmissions(wardAdmissions);

    //filter by room 1
    let roomOneAdmissions = wardAdmissions.filter(
      (admission) => admission.room === 1
    );

    //map admission to calendar event
    mapAdmissionsToResourcesAndEvents(roomOneAdmissions);
  };

  const handleChangeRoom = (event, selectedRoom) => {
    setSelectStaffToFilter(null);
    setRoom(selectedRoom);
    let selectedRoomAdmissions = currentDayAdmissions.filter(
      (admission) => admission.room === selectedRoom
    );

    mapAdmissionsToResourcesAndEvents(selectedRoomAdmissions);
  };

  const handleSelectAdmission = (admission) => {
    setSelectedAdmission(admission);
    setAdmissionTicketModal(true);
  };

  const handleUpdateAdmission = (updatedAdmission) => {
    setSelectedAdmission(updatedAdmission);
    setAdmissionTicketModal(true);

    const updatedAdmissions = currentDayAdmissions.map((existingAdmission) => {
      if (updatedAdmission.admissionId === existingAdmission.admissionId) {
        return updatedAdmission;
      }
      return existingAdmission;
    });
    setCurrentDayAdmissions(updatedAdmissions);

    //filter by room 1
    let roomOneAdmissions = updatedAdmissions.filter(
      (admission) => admission.room === 1
    );

    //map admission to calendar event
    mapAdmissionsToResourcesAndEvents(roomOneAdmissions);
  };

  const handleCancelAdmission = (cancelledAdmissionId) => {
    const updatedAdmissions = currentDayAdmissions.filter(
      (existingAdmission) =>
        existingAdmission.admissionId !== cancelledAdmissionId
    );
    setCurrentDayAdmissions(updatedAdmissions);

    //filter by room 1
    let roomOneAdmissions = updatedAdmissions.filter(
      (admission) => admission.room === 1
    );

    //map admission to calendar event
    mapAdmissionsToResourcesAndEvents(roomOneAdmissions);

    setAdmissionTicketModal(false);
  };

  const handleCloseAdmissionTicketModal = () => {
    setSelectedAdmission(null);
    setAdmissionTicketModal(false);
  };

  const handleSelectStaffToFilter = (staffId) => {
    setSelectStaffToFilter(staffId);
    let selectedAdmissions = currentDayAdmissions.filter(
      (admission) => admission.room === room
    );

    if (staffId > 0) {
      selectedAdmissions = selectedAdmissions.filter((admission) =>
        admission.listOfStaffsId.includes(staffId)
      );
    }

    mapAdmissionsToResourcesAndEvents(selectedAdmissions);
  };

  const handleSelectSlot = (slotInfo) => {
    const currentDate = new Date();
    console.log("slot " + slotInfo);
    if (slotInfo.start < currentDate) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Order cannot be done for past date",
        })
      );
      return
    }

    setSelectedSlotStart(slotInfo.start);
    setSelectedSlotEnd(slotInfo.end);
    const orderForAdmission = currentDayAdmissions.filter(
      (admission) =>
        admission.room === room && admission.bed === slotInfo.resourceId
    )[0];
    setSelectedAdmission(orderForAdmission);
    console.log(selectedAdmission);

    // console.log("admisssion " + parseDateFromLocalDateTime(selectedAdmission.dischargeDateTime))
    console.log("date" + selectedAdmission.dischargeDateTime);
    const checkDate = parseDateFromLocalDateTime(selectedAdmission.dischargeDateTime);
    if (slotInfo.start > checkDate) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Order cannot be done after discharge date",
        })
      );
      return
    }
    setMedicationOrderModal(true);
  };

  const handleCloseMedicationOrderModal = () => {
    setSelectedAdmission(null);
    setExistingMedicationOrders([]);
    setMedicationOrderModal(false);
  };

  const handleSelectEvent = (event) => {
    console.log(event);
    const orderForAdmission = currentDayAdmissions.filter(
      (admission) =>
        admission.room === room && admission.bed === event.resourceId
    )[0];
    setSelectedAdmission(orderForAdmission);
    setSelectedSlotStart(event.start);
    setSelectedSlotEnd(event.end);
    // console.log("date" + selectedAdmission.dischargeDateTime);
    // const checkDate = parseDateFromLocalDateTime(selectedAdmission.dischargeDateTime);
    // if (selectedSlotStart > checkDate) {
    //   reduxDispatch(
    //     displayMessage({
    //       color: "error",
    //       icon: "notification",
    //       title: "Error Encountered",
    //       content: "Order cannot be done after discharge date",
    //     })
    //   );
    //   return
    // }
    setExistingMedicationOrders(event.medicationOrders);
    setMedicationOrderModal(true);
  };

  // const fetchAllMedicationOrders = async () => {
  //   try {
  //     console.log("fetch");
  //     medicationOrderApi.getAllMedicationOrders().then((response) => {
  //       const orders = response.data;

  //       const mappedEvents = orders.map((order) => {
  //         console.log("Orders " + order.startDate);
  //         const title = `Medication Order`;

  //         return {
  //           title,
  //           id: order.medicationOrderId,
  //           // medicationOrderId: order.medicationOrderId,
  //           // comments: order.comments,
  //           // medication: order.medication.inventoryItemName,
  //           start: new Date(order.startDate),
  //           end: new Date(order.endDate),
  //           // quantity: order.quantity,
  //           // facilityBookingId: booking.facilityBookingId,
  //           // owner: booking.staffUsername,
  //           // resizable: true,
  //           // draggable: true,
  //           allDay: false,
  //         };
  //       });

  //       setAdmissionOrders(mappedEvents);
  //       console.log(admissionOrders);
  //       // Update the calendarConfig with the new events
  //     });
  //   } catch (error) {
  //     console.error("Error fetching cart items:", error);
  //   }
  // };

  // const dischargeTomorrow = async () => {
  //   const tomorrow = moment().add(1, "days");
  //   tomorrow.seconds(0);
  //   tomorrow.minutes(0);
  //   tomorrow.hours(12);
  //   const tomorrowDateString = tomorrow.format("YYYY-MM-DDTHH:mm:ss");
  //   await admissionApi.handleDischarge(tomorrowDateString);
  //   forceRefresh();
  // };

  // const allocateTomorrow = async () => {
  //   const tomorrow = moment().add(1, "days");
  //   tomorrow.seconds(0);
  //   tomorrow.minutes(0);
  //   tomorrow.hours(13);
  //   const tomorrowDateString = tomorrow.format("YYYY-MM-DDTHH:mm:ss");
  //   await admissionApi.handleAllocateIncoming(tomorrowDateString);
  //   forceRefresh();
  // };

  // useEffect(() => {
  //   fetchAllMedicationOrders();
  // }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {staff.staffRoleEnum === "ADMIN" ||
        staff.staffRoleEnum === "NURSE" ? null : (
        <Tabs
          value={displayedWard}
          onChange={handleChangeWard}
          style={{ marginTop: "10px", width: "500px" }}
        >
          {wards.map((ward) => (
            <Tab label={ward} value={ward} />
          ))}
        </Tabs>
      )}

      <MDTypography
        sx={{
          fontSize: "2.5rem", // Adjust the size as per your preference
          textAlign: "center",
          fontWeight: "bold", // Makes the font-weight bold
          marginTop: "1rem", // Adds some top margin
          marginBottom: "1rem", // Adds some bottom margin
        }}
      >
        Ward {displayedWard}
      </MDTypography>
      <MDTypography sx={{ textAlign: "center" }}>{ }</MDTypography>

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
            {calendarResources.length > 0 ? (
              <Calendar
                localizer={localizer}
                defaultView={Views.DAY}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                resources={calendarResources}
                events={calendarEvents}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                components={{
                  event: ({ event }) => {
                    if (event.id === 0) {
                      return <div>{event.title}</div>;
                    } else {
                      return (
                        <AdmissionCard
                          admission={
                            currentDayAdmissions.filter(
                              (admission) => admission.admissionId === event.id
                            )[0]
                          }
                          handleSelectAdmission={handleSelectAdmission}
                        />
                      );
                    }
                  },
                }}
              />
            ) : (
              <p>No Admissions in this room</p>
            )}

            {/* {admissionsByRoom.length > 0 ? (
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
            )} */}
          </MDBox>
        </MDBox>
      </MDBox>
      {selectedAdmission && (
        <AdmissionTicketModal
          key={selectedAdmission.admissionId}
          openModal={admissionTicketModal}
          handleCloseModal={handleCloseAdmissionTicketModal}
          selectedAdmission={selectedAdmission}
          listOfWorkingStaff={listOfWorkingStaff}
          handleUpdateAdmission={handleUpdateAdmission}
          handleCancelAdmission={handleCancelAdmission}
        />
      )}
      {selectedAdmission && existingMedicationOrders && (
        <MedicationOrderModal
          openModal={medicationOrderModal}
          handleCloseModal={handleCloseMedicationOrderModal}
          selectedAdmission={selectedAdmission}
          startDate={selectedSlotStart}
          endDate={selectedSlotEnd}
          existingMedicationOrders={existingMedicationOrders}
        />
      )}
    </DashboardLayout>
  );
}

export default Inpatient;
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
import TreatmentModal from "./TreatmentModal";
import { parseDateFromLocalDateTimeWithSecs } from "utility/Utility";
import { inpatientTreatmentApi } from "api/Api";
import { Navigate } from "react-router-dom";

function Inpatient() {
  const staff = useSelector(selectStaff);
  console.log(staff);
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

  //for opening treatment modal
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [existingTreatment, setExistingTreatment] = useState(null);
  const [staffDTO, setStaffDTO] = useState(null);

  const [eventIds, setEventIds] = useState([]);

  //get the facility location
  const getFacilityLocationByStaffIdThroughShift = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      staff.unit.name
    );
    const listOfWorkingStaff = response.data;

    let staffDTO = listOfWorkingStaff.filter(
      (workingStaff) => workingStaff.staffId === staff.staffId
    )[0];

    //console.log(staffDTO);

    if (staffDTO) {
      setStaffDTO(staffDTO);
    } else {
      setStaffDTO(null);
    }
  };

  useEffect(() => {
    getFacilityLocationByStaffIdThroughShift();
  }, []);

  //helper method to map admissions to resources and events for calendar
  const mapAdmissionsToResourcesAndEvents = async (admissions) => {
    //console.log(admissions);
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

      const dateToMedicationOrdersMap = {};

      //console.log(medicationOrders);

      for (const medicationOrder of medicationOrders) {
        const startDate = medicationOrder.startDate;

        if (!dateToMedicationOrdersMap.hasOwnProperty(startDate)) {
          dateToMedicationOrdersMap[startDate] = [medicationOrder];
        } else {
          dateToMedicationOrdersMap[startDate].push(medicationOrder);
        }
      }

      // Medication orders
      const medicationOrderDates = Object.entries(dateToMedicationOrdersMap);

      for (const [startDateString, medicationOrders] of medicationOrderDates) {
        const firstMedicationOrder = medicationOrders[0];
        const startDate = parseDateFromYYYYMMDDHHMMSS(
          firstMedicationOrder.startDate
        );
        const endDate = parseDateFromYYYYMMDDHHMMSS(
          firstMedicationOrder.endDate
        );

        //change color of event using id
        let eventId;
        for (const medicationOrder of medicationOrders) {
          if (medicationOrder.isCompleted) {
            eventId = 3;
          } else {
            const startMoment = moment(medicationOrder.startDate);
            const endMoment = moment(medicationOrder.endDate);
            if (moment().isBefore(startMoment)) {
              eventId = 0;
            } else if (moment().isBetween(startMoment, endMoment)) {
              eventId = 1;
            } else {
              eventId = 2;
            }
            break;
          }
        }

        const medicationOrderEvent = {
          id: eventId,
          title: `${medicationOrders.length} Medication Order(s)`,
          start: startDate,
          end: endDate,
          resourceId: admission.bed,
          allDay: false,
          medicationOrders: medicationOrders,
        };
        events.push(medicationOrderEvent);
      }

      //Treatment
      const inpatientTreatments = await getInpatientTreatments(
        admission.listOfInpatientTreatmentIds
      );

      console.log(inpatientTreatments);

      for (const treatment of inpatientTreatments) {
        const startDate = parseDateFromYYYYMMDDHHMMSS(treatment.startDate);
        const endDate = parseDateFromYYYYMMDDHHMMSS(treatment.endDate);

        //change color of event using id
        let eventId;

        if (treatment.isCompleted) {
          eventId = 3;
        } else {
          const startMoment = moment(treatment.startDate);
          const endMoment = moment(treatment.endDate);
          if (moment().isBefore(startMoment)) {
            eventId = 0;
          } else if (moment().isBetween(startMoment, endMoment)) {
            eventId = 1;
          } else {
            eventId = 2;
          }
        }

        console.log(eventId);

        const treatmentEvent = {
          id: eventId,
          title: "Inpatient Treatment",
          start: startDate,
          end: endDate,
          resourceId: admission.bed,
          allDay: false,
          treatment: treatment,
        };
        events.push(treatmentEvent);
      }
    }

    console.log(events);

    setCalendarEvents(events);

    //setCalendarEvents([...events, ...defaultEvents]);
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

  //helper method to get inpatient treatments from inpatient treatment ids
  const getInpatientTreatments = async (inpatientTreatmentIds) => {
    const inpatientTreatmentPromises = inpatientTreatmentIds.map((id) =>
      inpatientTreatmentApi.getInpatientTreatmentById(id)
    );
    const inpatientTreatmentResponses = await Promise.all(
      inpatientTreatmentPromises
    );
    const listOfInpatientTreatments = inpatientTreatmentResponses.map(
      (response) => response.data
    );
    //console.log(listOfMedicationOrders);
    return listOfInpatientTreatments;
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
    wards.sort();
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

  useEffect(() => {
    if (
      staff.listOfAssignedAdmissions.length === 0 &&
      staff.unit.listOfFacilities
    ) {
      return;
    }
    if (!medicationOrderModal) {
      if (staff.staffRoleEnum === "ADMIN" || staff.staffRoleEnum === "NURSE") {
        getInitialViewForWardStaff();
      } else {
        getInitialViewForDepartmentStaff();
      }
    }
  }, [medicationOrderModal, treatmentModal]);

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
    const wardAdmissionsAssignedToStaff = wardAdmissions.filter((admission) =>
      admission.listOfStaffsId.includes(staff.staffId)
    );

    setCurrentDayAdmissions(wardAdmissionsAssignedToStaff);

    //filter by room 1
    let roomOneAdmissions = wardAdmissionsAssignedToStaff.filter(
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
    const orderForAdmission = currentDayAdmissions.filter(
      (admission) =>
        admission.room === room && admission.bed === slotInfo.resourceId
    )[0];
    const currentDate = new Date();

    //console.log(calendarEvents);

    if (!orderForAdmission.arrived) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Patient has not arrived",
        })
      );
      return;
    }

    if (staff.staffRoleEnum === "ADMIN" || staff.staffRoleEnum === "NURSE") {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "You are not allowed to create an order",
        })
      );
      return;
    } else if (slotInfo.start < currentDate) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Order cannot be done for past date",
        })
      );
      return;
    } else {
      if (staff.staffRoleEnum === "DOCTOR") {
        //1. Discharge date check
        const dischargeDate = parseDateFromLocalDateTimeWithSecs(
          orderForAdmission.dischargeDateTime
        );
        if (slotInfo.start > dischargeDate) {
          reduxDispatch(
            displayMessage({
              color: "error",
              icon: "notification",
              title: "Error Encountered",
              content: "Order cannot be done after discharge date",
            })
          );
          return;
        }

        //2. Slot duration = 1 hour check
        const slotDuration = slotInfo.end.getTime() - slotInfo.start.getTime();
        const slotDurationInHours = slotDuration / (1000 * 60 * 60);

        if (slotDurationInHours !== 1) {
          reduxDispatch(
            displayMessage({
              color: "error",
              icon: "notification",
              title: "Error Encountered",
              content: "Medication Order should be 1 hour",
            })
          );
          return;
        }

        //3. Overlapping events check
        const filteredCalendarEvents = calendarEvents
          .filter(
            (event) => event.resourceId === slotInfo.resourceId && !event.allDay
          )
          .sort((a, b) => a.start - b.start);
        //console.log(filteredCalendarEvents);

        if (filteredCalendarEvents.length > 0) {
          for (const event of filteredCalendarEvents) {
            if (checkForOverlappingEvents(slotInfo, event)) {
              reduxDispatch(
                displayMessage({
                  color: "error",
                  icon: "notification",
                  title: "Error Encountered",
                  content: "There is an existing order in this time slot",
                })
              );
              return;
            }
          }
        }
      } else {
        const dischargeDate = parseDateFromLocalDateTime(
          orderForAdmission.dischargeDateTime
        );
        //1. Discharge date check
        if (slotInfo.start > dischargeDate) {
          reduxDispatch(
            displayMessage({
              color: "error",
              icon: "notification",
              title: "Error Encountered",
              content: "Order cannot be done on discharge date",
            })
          );
          return;
        }

        //2. Shift check
        const shiftStart = staffDTO.startTime[3];
        const shiftEnd = staffDTO.endTime[3];

        if (
          slotInfo.start.getHours() < shiftStart ||
          slotInfo.end.getHours() > shiftEnd
        ) {
          reduxDispatch(
            displayMessage({
              color: "error",
              icon: "notification",
              title: "Error Encountered",
              content: "Order cannot be done outside of shift hours",
            })
          );
          return;
        }

        //3. Overlapping events check
        const filteredCalendarEvents = calendarEvents
          .filter(
            (event) => event.resourceId === slotInfo.resourceId && !event.allDay
          )
          .sort((a, b) => a.start - b.start);
        //console.log(filteredCalendarEvents);

        if (filteredCalendarEvents.length > 0) {
          for (const event of filteredCalendarEvents) {
            if (checkForOverlappingEvents(slotInfo, event)) {
              reduxDispatch(
                displayMessage({
                  color: "error",
                  icon: "notification",
                  title: "Error Encountered",
                  content: "There is an existing order in this time slot",
                })
              );
              return;
            }
          }
        }
      }
    }

    setSelectedSlotStart(slotInfo.start);
    setSelectedSlotEnd(slotInfo.end);
    setSelectedAdmission(orderForAdmission);

    if (staff.staffRoleEnum === "DOCTOR") {
      setMedicationOrderModal(true);
    } else {
      setTreatmentModal(true);
    }
  };

  //helper method to prevent overlapping events
  const checkForOverlappingEvents = (newSlot, existingSlot) => {
    if (
      newSlot.end <= existingSlot.start ||
      newSlot.start >= existingSlot.end
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleCloseMedicationOrderModal = () => {
    setSelectedAdmission(null);
    setExistingMedicationOrders([]);
    setMedicationOrderModal(false);
  };

  const handleCloseTreatmentModal = () => {
    setSelectedAdmission(null);
    setExistingTreatment(null);
    setTreatmentModal(false);
  };

  const handleSelectEvent = (event) => {
    //console.log(event);
    const orderForAdmission = currentDayAdmissions.filter(
      (admission) =>
        admission.room === room && admission.bed === event.resourceId
    )[0];
    setSelectedAdmission(orderForAdmission);
    setSelectedSlotStart(event.start);
    setSelectedSlotEnd(event.end);

    if (event.medicationOrders) {
      setExistingMedicationOrders(event.medicationOrders);
      setMedicationOrderModal(true);
    } else if (event.treatment) {
      setExistingTreatment(event.treatment);
      setTreatmentModal(true);
    }
  };

  return staff.listOfAssignedAdmissions.length === 0 &&
    staff.unit.listOfFacilities ? (
    <Navigate to="/error" replace />
  ) : (
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
                    } else if (event.id === 1) {
                      return <div className="orange-event">{event.title}</div>;
                    } else if (event.id === 2) {
                      return <div className="red-event">{event.title}</div>;
                    } else if (event.id === 3) {
                      return <div className="green-event">{event.title}</div>;
                    } else {
                      return (
                        <AdmissionCard
                          admission={
                            currentDayAdmissions.filter(
                              (admission) => admission.admissionId === event.id
                            )[0]
                          }
                          handleSelectAdmission={handleSelectAdmission}
                          events={calendarEvents}
                        />
                      );
                    }
                  },
                }}
              />
            ) : (
              <p>No Admissions in this room</p>
            )}
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
      {selectedAdmission && (
        <TreatmentModal
          openModal={treatmentModal}
          handleCloseModal={handleCloseTreatmentModal}
          selectedAdmission={selectedAdmission}
          startDate={selectedSlotStart}
          endDate={selectedSlotEnd}
          existingTreatment={existingTreatment}
        />
      )}
    </DashboardLayout>
  );
}

export default Inpatient;

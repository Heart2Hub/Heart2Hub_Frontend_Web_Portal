import React from "react";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { appointmentApi, staffApi } from "../../../api/Api";
import { useEffect } from "react";
import MDButton from "components/MDButton";

import { Icon, Box } from "@mui/material";
import "./kanbanStyles.css";
import CreateAppointmentModal from "./CreateAppointmentModal";

import StaffListSidePanel from "./StaffListSidePanel";
import MDBox from "components/MDBox";
import { useDispatch } from "react-redux";
import { displayMessage } from "store/slices/snackbarSlice";
import AssignAppointmentDialog from "./AssignAppointmentDialog";
import { useRef } from "react";

function KanbanBoard() {
  const staff = useSelector(selectStaff);
  const [loading, setLoading] = useState(false);
  const reduxDispatch = useDispatch();

  //for assigning staff to appoint
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointmentToAssign, setSelectedAppointmentToAssign] =
    useState(null);
  const [assigningToSwimlane, setAssigningToSwimlane] = useState("");

  //for handling filtering
  const [selectStaffToFilter, setSelectStaffToFilter] = useState(null);

  //for side panel to show list of staff working
  const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);

  //create 1 array for each column
  const [registration, setRegistration] = useState([]);
  const [triage, setTriage] = useState([]);
  const [consultation, setConsultation] = useState([]);
  const [discharge, setDischarge] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [admission, setAdmission] = useState([]);
  const [pharmacy, setPharmacy] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectStaffToFilter = (staffId) => {
    setSelectStaffToFilter(staffId);
  };

  //main method to handle drag and drop logic
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // GET ITEM
    const appointment = findItemById(draggableId, [
      ...registration,
      ...triage,
      ...consultation,
      ...discharge,
      ...treatment,
      ...admission,
      ...pharmacy,
    ]);

    //========================== DRAG DROP LOGIC CHECKS ========================
    //if same source and destination do nothing
    if (source.droppableId === destination.droppableId) return;

    //from any swimlane check that patient has arrived, else return do nth
    if (!appointment.arrived) {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Please check that patient has arrived first!",
        })
      );
      return;
    }

    //ticket should not flow back to the registration swimlane
    if (destination.droppableId === "1" && source.droppableId !== "1") {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Cannot return to Registration",
        })
      );
      return;
    }

    //========================== Get destination swimlane name ========================
    let destinationSwimlane = "";
    if (destination.droppableId === "1") {
      destinationSwimlane = "Registration";
    } else if (destination.droppableId === "2") {
      destinationSwimlane = "Triage";
    } else if (destination.droppableId === "3") {
      destinationSwimlane = "Consultation";
    } else if (destination.droppableId === "4") {
      destinationSwimlane = "Treatment";
    } else if (destination.droppableId === "5") {
      destinationSwimlane = "Admission";
    } else if (destination.droppableId === "6") {
      destinationSwimlane = "Pharmacy";
    } else if (destination.droppableId === "7") {
      destinationSwimlane = "Discharge";
    } else {
      console.log("NO DESTINATION MATCH FOR " + destination.droppableId);
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Invalid Swimlane!",
        })
      );
    }

    //=======================   ADD ASSIGNED LOGIC HERE =================
    const assignAppointment = await showAssignAppointmentDialog(
      appointment,
      destinationSwimlane
    );
    if (!assignAppointment) {
      setSelectedAppointmentToAssign(null);
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "No Assignment was performed",
        })
      );
      return;
    }

    //========================== Updating Backend ========================
    let updatedAppointment;
    try {
      const response = await appointmentApi.updateAppointmentSwimlaneStatus(
        appointment.appointmentId,
        destinationSwimlane
      );

      updatedAppointment = response.data;
    } catch (error) {
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: error.response.data,
        })
      );
      return;
    }

    //========================== ACTUAL DRAGGIN DROPPING ========================
    //IF SOURCE AND END NOT THE SAME REMOVE FROM SOURCE ARRAY
    if (source.droppableId === "1") {
      setRegistration(removeItemById(draggableId, registration));
      // console.log("remove from registration");
    } else if (source.droppableId === "2") {
      setTriage(removeItemById(draggableId, triage));
      // console.log("remove from triage");
    } else if (source.droppableId === "3") {
      setConsultation(removeItemById(draggableId, consultation));
      // console.log("remove from consultation");
    } else if (source.droppableId === "4") {
      setTreatment(removeItemById(draggableId, treatment));
    } else if (source.droppableId === "5") {
      setAdmission(removeItemById(draggableId, admission));
    }else if (source.droppableId === "6") {
      setPharmacy(removeItemById(draggableId, pharmacy));
    } else if (source.droppableId === "7") {
      setDischarge(removeItemById(draggableId, discharge));
    } else {
      console.log("NO SOURCE MATCH FOR " + source.droppableId);
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Invalid Swimlane",
        })
      );
    }

    //ADD ITEM
    //should add checks to prevent backward flow?
    if (destination.droppableId === "1") {
      setRegistration([{ ...updatedAppointment }, ...registration]);
    } else if (destination.droppableId === "2") {
      setTriage([{ ...updatedAppointment }, ...triage]);
    } else if (destination.droppableId === "3") {
      setConsultation([{ ...updatedAppointment }, ...consultation]);
    } else if (destination.droppableId === "4") {
      setTreatment([{ ...updatedAppointment }, ...treatment]);
    } else if (destination.droppableId === "5") {
      setAdmission([{ ...updatedAppointment }, ...admission]);
    } else if (destination.droppableId === "6") {
      setPharmacy([{ ...updatedAppointment }, ...pharmacy]);
    } else if (destination.droppableId === "7") {
      setDischarge([{ ...updatedAppointment }, ...discharge]);
    } else {
      console.log("NO DESTINATION MATCH FOR " + destination.droppableId);
      reduxDispatch(
        displayMessage({
          color: "warning",
          icon: "notification",
          title: "Error",
          content: "Invalid Swimlane",
        })
      );
    }

    reduxDispatch(
      displayMessage({
        color: "success",
        icon: "notification",
        title: "Success",
        content: "Appointment Ticket is updated!",
      })
    );
    getStaffCurrentlyWorking();
  };

  //for assigning appt to staff
  const dialogResolver = useRef(null); // This will hold the resolve function

  const showAssignAppointmentDialog = (appointment, swimlaneName) => {
    return new Promise((resolve) => {
      // Store the resolve function in our ref
      dialogResolver.current = resolve;
      setSelectedAppointmentToAssign(appointment);
      setAssigningToSwimlane(swimlaneName);
      setDialogOpen(true);
    });
  };

  const handleConfirm = async (selectedStaffId) => {
    if (dialogResolver.current) {
      try {
        //send to BE to assign staff
        if (selectedAppointmentToAssign !== null) {
          const response = await appointmentApi.assignAppointmentToStaff(
            selectedAppointmentToAssign.appointmentId,
            selectedStaffId,
            staff.staffId
          );

          const updatedAssignment = response.data;
        }

        //reset
        setSelectedAppointmentToAssign(null);

        dialogResolver.current(true); // Resolve promise if user confirms
        dialogResolver.current = null; // Clear it out after using
        // }
      } catch (error) {
        console.log(error);
        //perform error handling
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error",
            content: error.response.data,
          })
        );
      }
    }
    setDialogOpen(false);
  };

  const handleClose = () => {
    if (dialogResolver.current) {
      dialogResolver.current(false); // Resolve promise if user cancels
      dialogResolver.current = null; // Clear it out after using
    }

    reduxDispatch(
      displayMessage({
        color: "info",
        icon: "notification",
        title: "Error",
        content: "No action was taken",
      })
    );

    setSelectedAppointmentToAssign(null);
    setDialogOpen(false);
  };

  //force a refresh for modal assigning
  const forceRefresh = () => {
    setLoading(true);
    getAppointmentsForToday();
    getStaffCurrentlyWorking();
    setLoading(false);
  };

  //Utility functions to find and remove items in array
  function findItemById(id, array) {
    return array.find((item) => item.appointmentId === Number(id));
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.appointmentId !== Number(id));
  }

  function replaceItemByIdWithUpdated(id, arrayName, newItem) {
    let newColumnList = [];
    let selectedColumnList;

    if (arrayName === "Registration") {
      selectedColumnList = JSON.parse(JSON.stringify(registration));
    } else if (arrayName === "Triage") {
      selectedColumnList = JSON.parse(JSON.stringify(triage));
    } else if (arrayName === "Consultation") {
      selectedColumnList = JSON.parse(JSON.stringify(consultation));
    } else if (arrayName === "Treatment") {
      selectedColumnList = JSON.parse(JSON.stringify(treatment));
    } else if (arrayName === "Admission") {
      selectedColumnList = JSON.parse(JSON.stringify(admission));
    } else if (arrayName === "Pharmacy") {
      selectedColumnList = JSON.parse(JSON.stringify(pharmacy));
    } else if (arrayName === "Discharge") {
      selectedColumnList = JSON.parse(JSON.stringify(discharge));
    } else {
      console.log("ERROR");
      selectedColumnList = [];
    }

    selectedColumnList.map((item) => {
      if (item.appointmentId === Number(id)) {
        newColumnList.push(newItem);
      } else {
        newColumnList.push(item);
      }
    });

    if (arrayName === "Registration") {
      setRegistration(newColumnList);
    } else if (arrayName === "Triage") {
      setTriage(newColumnList);
    } else if (arrayName === "Consultation") {
      setConsultation(newColumnList);
    } else if (arrayName === "Treatment") {
      setTreatment(newColumnList);
    } else if (arrayName === "Admission") {
      setAdmission(newColumnList);
    } else if (arrayName === "Pharmacy") {
      setPharmacy(newColumnList);
    } else if (arrayName === "Discharge") {
      setDischarge(newColumnList);
    } else {
      console.log("ERROR 2");
    }
  }

  //Retrieve appointments that take place TODAY
  const getAppointmentsForToday = async () => {
    let today = new Date();

    //used for filtering staff tickets
    let selectedStaffId = 0;
    if (selectStaffToFilter !== null) {
      selectedStaffId = selectStaffToFilter;
    }

    // need plus 1 since month starts with 0
    const response = await appointmentApi.viewAllAppointmentsByRange(
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
      staff.unit.name,
      selectedStaffId
    );

    //filter appointments according to the swimlanes the tickets are at
    //sort them by ID as well
    setRegistration(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "REGISTRATION")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
    setTriage(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "TRIAGE")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
    setConsultation(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "CONSULTATION")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
    setTreatment(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "TREATMENT")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
    setAdmission(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "ADMISSION")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
    setPharmacy(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "PHARMACY")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
    setDischarge(
      response.data
        .filter((appt) => appt.swimlaneStatusEnum === "DISCHARGE")
        .sort((appt1, appt2) => appt2.appointmentId - appt1.appointmentId)
    );
  };

  //get List of currently working staffs
  const getStaffCurrentlyWorking = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      staff.unit.name
    );
    setListOfWorkingStaff(response.data);
  };

  const handleAppointmentCreated = () => {
    getAppointmentsForToday();
  };

  useEffect(() => {
    getAppointmentsForToday();
    getStaffCurrentlyWorking();
    console.log(staff);
  }, [loading, selectStaffToFilter]);

  return (
    <>
      <Box display="flex" justifyContent="left" alignItems="left" mb={2}>
        <MDButton variant="contained" color="primary" onClick={openModal}>
          Create New Appointment
          <Icon>add</Icon>
        </MDButton>
      </Box>
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAppointmentCreated={handleAppointmentCreated}
      />
      <MDBox sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <StaffListSidePanel
          handleSelectStaffToFilter={handleSelectStaffToFilter}
          selectStaffToFilter={selectStaffToFilter}
          listOfWorkingStaff={listOfWorkingStaff}
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            <KanbanColumn
              title="Registration"
              appointments={registration}
              id={"1"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
            <KanbanColumn
              title="Triage"
              appointments={triage}
              id={"2"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
            <KanbanColumn
              title="Consultation"
              appointments={consultation}
              id={"3"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
            <KanbanColumn
              title="Treatment"
              appointments={treatment}
              id={"4"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
            <KanbanColumn
              title="Admission"
              appointments={admission}
              id={"5"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
            <KanbanColumn
              title="Pharmacy"
              appointments={pharmacy}
              id={"6"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
            <KanbanColumn
              title="Discharge"
              appointments={discharge}
              id={"7"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
              forceRefresh={forceRefresh}
            />
          </div>
        </DragDropContext>
      </MDBox>
      <AssignAppointmentDialog
        open={isDialogOpen}
        onConfirm={handleConfirm}
        onClose={handleClose}
        listOfWorkingStaff={listOfWorkingStaff}
        selectedAppointmentToAssign={selectedAppointmentToAssign}
        assigningToSwimlane={assigningToSwimlane}
      />
    </>
  );
}

export default KanbanBoard;

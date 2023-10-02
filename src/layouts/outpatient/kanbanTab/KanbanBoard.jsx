import React from "react";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { appointmentApi, staffApi } from "../../../api/Api";
import { useEffect } from "react";
import "./kanbanStyles.css";
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

  //for handling filtering
  const [selectStaffToFilter, setSelectStaffToFilter] = useState(null);

  //for side panel to show list of staff working
  const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);

  //create 1 array for each column
  const [registration, setRegistration] = useState([]);
  const [triage, setTriage] = useState([]);
  const [consultation, setConsultation] = useState([]);

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
    ]);

    //========================== DRAG DROP LOGIC CHECKS ========================
    //if same source and destination do nothing
    if (source.droppableId === destination.droppableId) return;

    //if from registration, check that patient has arrived, else return do nth
    if (source.droppableId === "1") {
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
    }

    //=======================   ADD ASSIGNED LOGIC HERE =================
    const assignAppointment = await showAssignAppointmentDialog(appointment);
    if (!assignAppointment) {
      setSelectedAppointmentToAssign(null);
      return; // Exit the function if the user didn't confirm
    }

    //=========================================================================

    //========================== Updating Backend ========================
    let destinationSwimlane = "";
    if (destination.droppableId === "1") {
      destinationSwimlane = "Registration";
    } else if (destination.droppableId === "2") {
      destinationSwimlane = "Triage";
    } else if (destination.droppableId === "3") {
      destinationSwimlane = "Consultation";
    } else {
      console.log("NO DESTINATION MATCH FOR " + destination.droppableId);
    }

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
          content: error.data,
        })
      );
      console.log("SOMETHING WENT WRONG");
      console.log(error);
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
    } else {
      console.log("NO SOURCE MATCH FOR " + source.droppableId);
    }

    //ADD ITEM
    //should add checks to prevent backward flow?
    if (destination.droppableId === "1") {
      setRegistration([{ ...updatedAppointment }, ...registration]);
    } else if (destination.droppableId === "2") {
      setTriage([{ ...updatedAppointment }, ...triage]);
    } else if (destination.droppableId === "3") {
      setConsultation([{ ...updatedAppointment }, ...consultation]);
    } else {
      console.log("NO DESTINATION MATCH FOR " + destination.droppableId);
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

  const showAssignAppointmentDialog = (appointment) => {
    console.log("SHOW CONFIRMATION IS BEING CALLED");
    return new Promise((resolve) => {
      // Store the resolve function in our ref
      dialogResolver.current = resolve;
      setSelectedAppointmentToAssign(appointment);
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
            selectedStaffId
          );
          console.log(response);

          //reset
          setSelectedAppointmentToAssign(null);

          dialogResolver.current(true); // Resolve promise if user confirms
          dialogResolver.current = null; // Clear it out after using
        }
      } catch (error) {
        //perform error handling

        console.log(error);
      }
    }
    setDialogOpen(false);
  };

  const handleClose = () => {
    if (dialogResolver.current) {
      dialogResolver.current(false); // Resolve promise if user cancels
      dialogResolver.current = null; // Clear it out after using
    }

    setSelectedAppointmentToAssign(null);
    setDialogOpen(false);
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
  };

  //get List of currently working staffs
  const getStaffCurrentlyWorking = async () => {
    const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
      staff.unit.name
    );
    setListOfWorkingStaff(response.data);
    console.log(response.data);
    // handleLiftListOfCurrentWorkingStaff(response.data);
  };

  useEffect(() => {
    getAppointmentsForToday();
    getStaffCurrentlyWorking();
  }, [loading, selectStaffToFilter]);

  return (
    <>
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
            />
            <KanbanColumn
              title="Triage"
              appointments={triage}
              id={"2"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
            />
            <KanbanColumn
              title="Consultation"
              appointments={consultation}
              id={"3"}
              replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
              listOfWorkingStaff={listOfWorkingStaff}
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
      />
      ;
    </>
  );
}

export default KanbanBoard;

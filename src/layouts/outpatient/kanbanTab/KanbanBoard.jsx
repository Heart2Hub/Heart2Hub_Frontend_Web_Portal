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

function KanbanBoard() {
  const staff = useSelector(selectStaff);
  const [loading, setLoading] = useState(false);

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
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    //if same source and destination do nothing
    if (source.droppableId === destination.droppableId) return;

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

    // GET ITEM
    const appointment = findItemById(draggableId, [
      ...registration,
      ...triage,
      ...consultation,
    ]);

    //ADD ITEM
    //should add checks to prevent backward flow?
    if (destination.droppableId === "1") {
      setRegistration([{ ...appointment }, ...registration]);
    } else if (destination.droppableId === "2") {
      setTriage([{ ...appointment }, ...triage]);
    } else if (destination.droppableId === "3") {
      setConsultation([{ ...appointment }, ...consultation]);
    } else {
      console.log("NO DESTINATION MATCH FOR " + destination.droppableId);
    }
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
    </>
  );
}

export default KanbanBoard;

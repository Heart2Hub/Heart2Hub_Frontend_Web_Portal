import React from "react";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { appointmentApi } from "../../../api/Api";
import { useEffect } from "react";
import "./kanbanStyles.css";

function KanbanBoard() {
  const staff = useSelector(selectStaff);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  //create 1 array for each column
  const [registration, setRegistration] = useState([]);
  const [triage, setTriage] = useState([]);
  const [consultation, setConsultation] = useState([]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // console.log(source.droppableId);
    // console.log(destination.droppableId);

    //if same source and destination do nothing
    if (source.droppableId === destination.droppableId) return;

    //IF SOURCE AND END NOT THE SAME
    //REMOVE FROM SOURCE ARRAY
    if (source.droppableId === 1 || source.droppableId === "1") {
      setRegistration(removeItemById(draggableId, registration));
      // console.log("remove from registration");
    } else if (source.droppableId === 2 || source.droppableId === "2") {
      setTriage(removeItemById(draggableId, triage));
      // console.log("remove from triage");
    } else if (source.droppableId === 3 || source.droppableId === "3") {
      setConsultation(removeItemById(draggableId, consultation));
      // console.log("remove from consultation");
    } else {
      // console.log("NO SOURCE MATCH FOR " + source.droppableId);
    }

    // GET ITEM
    const appointment = findItemById(draggableId, [
      ...registration,
      ...triage,
      ...consultation,
    ]);

    // console.log("RETRIEVED THIS APPT: ");
    // console.log(appointment);

    //ADD ITEM
    //should add checks to prevent backward flow?
    if (destination.droppableId === 1 || destination.droppableId === "1") {
      setRegistration([{ ...appointment }, ...registration]);
      // console.log("add to registration");
    } else if (
      destination.droppableId === 2 ||
      destination.droppableId === "2"
    ) {
      setTriage([{ ...appointment }, ...triage]);
      // console.log("add to triage");
    } else if (
      destination.droppableId === 3 ||
      destination.droppableId === "3"
    ) {
      setConsultation([{ ...appointment }, ...consultation]);
      // console.log("add to consultation");
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
        console.log("FOUND: " + Number(id));
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

  const getAppointmentsForToday = async () => {
    let today = new Date();
    // need plus 1 since month starts with 0
    const response = await appointmentApi.viewAllAppointmentsByRange(
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
      staff.unit.name
    );
    // console.log(response);
    setAppointments(response.data);
    setRegistration(response.data);
  };

  useEffect(() => {
    getAppointmentsForToday();
  }, [loading]);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          <KanbanColumn
            title="Registration"
            appointments={registration}
            id={"1"}
            replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
          />
          <KanbanColumn
            title="Triage"
            appointments={triage}
            id={"2"}
            replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
          />
          <KanbanColumn
            title="Consultation"
            appointments={consultation}
            id={"3"}
            replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
          />
        </div>
      </DragDropContext>
    </>
  );
}

export default KanbanBoard;

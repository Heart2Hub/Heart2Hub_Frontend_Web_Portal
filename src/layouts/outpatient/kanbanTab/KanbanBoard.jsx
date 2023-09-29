import React from "react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import KanbanColumn from "./KanbanColumn";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";

function KanbanBoard() {
  const staff = useSelector(selectStaff);

  //create 1 array for each column
  const [registration, setRegistration] = useState([]);
  const [triage, setTriage] = useState([]);
  const [consultation, setConsultation] = useState([]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    //if same source and destination do nothing
    if (source.droppableId == destination.droppableId) return;

    //IF SOURCE AND END NOT THE SAME
    //REMOVE FROM SOURCE ARRAY
    if (source.droppableId == 1) {
      setRegistration(removeItemById(draggableId, registration));
    } else if (source.droppableId == 3) {
      setTriage(removeItemById(draggableId, triage));
    } else if (source.droppableId == 3) {
      setConsultation(removeItemById(draggableId, consultation));
    }

    // GET ITEM
    const appointment = findItemById(draggableId, [
      ...registration,
      ...triage,
      ...consultation,
    ]);

    //ADD ITEM
    //should add checks to prevent backward flow?
    if (destination.droppableId == 1) {
      setRegistration([
        { ...appointment, registration: !appointment.appointment },
        ...appointment,
      ]);
    } else if (destination.droppableId == 2) {
      setTriage([{ ...appointment, triage: !appointment.triage }, ...triage]);
    } else {
      setConsultation([
        { ...appointment, consultation: !appointment.consultation },
        ...consultation,
      ]);
    }
  };

  //Utility functions to find and remove items in array
  function findItemById(id, array) {
    return array.find((item) => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.id != id);
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <h2 style={{ textAlign: "center" }}>KANBAN BOARD</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/* <Column title={"TO DO"} tasks={incomplete} id={"1"} />
          <Column title={"DONE"} tasks={completed} id={"2"} />
          <Column title={"BACKLOG"} tasks={[]} id={"3"} /> */}

          <KanbanColumn title="Registration" tasks={registration} id={"1"} />
          <KanbanColumn title="Triage" tasks={triage} id={"2"} />
          <KanbanColumn title="Consultation" tasks={consultation} id={"3"} />
        </div>
      </DragDropContext>
    </>
  );
}

export default KanbanBoard;

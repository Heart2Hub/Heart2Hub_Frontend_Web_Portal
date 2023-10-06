import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import KanbanDraggable from "./KanbanDraggable";
import "./kanbanStyles.css";

function KanbanColumn({
  title,
  appointments,
  id,
  replaceItemByIdWithUpdated,
  listOfWorkingStaff,
  forceRefresh,
}) {
  return (
    <div className="column">
      <h3 className="column-title">{title}</h3>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            className="column-tasklist"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {appointments.map((appointment, index) => (
              <KanbanDraggable
                key={index}
                index={index}
                appointment={appointment}
                replaceItemByIdWithUpdated={replaceItemByIdWithUpdated}
                columnName={title}
                listOfWorkingStaff={listOfWorkingStaff}
                forceRefresh={forceRefresh}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;

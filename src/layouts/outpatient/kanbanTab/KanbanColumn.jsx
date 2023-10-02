import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import KanbanDraggable from "./KanbanDraggable";
import "./kanbanStyles.css";
import MDTypography from "components/MDTypography";

function KanbanColumn({
  title,
  appointments,
  id,
  replaceItemByIdWithUpdated,
  listOfWorkingStaff,
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

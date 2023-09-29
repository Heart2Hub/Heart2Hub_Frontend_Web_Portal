import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanDraggable from "./KanbanDraggable";
import "./scroll.css";

function KanbanColumn({ title, tasks, id }) {
  const containerStyle = {
    backgroundColor: "#f4f5f7",
    borderRadius: "2.5px",
    width: "300px",
    height: "475px",
    overflowY: "scroll",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    border: "1px solid gray",
  };

  const titleStyle = {
    padding: "8px",
    backgroundColor: "pink",
    textAlign: "center",
    position: "stick",
  };

  const taskListStyle = {
    padding: "3px",
    transition: "background-color 0.2s ease",
    backgroundColor: "#f4f5f7",
    flexGrow: 1,
    minHeight: "100px",
  };

  return (
    <div style={containerStyle} className="column">
      <h3
        style={
          titleStyle
          // {
          //   backgroundColor: "lightblue",
          //   position: "stick",
          // }
        }
      >
        {title}
      </h3>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          //create list of appts here
          <div
            style={taskListStyle}
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;

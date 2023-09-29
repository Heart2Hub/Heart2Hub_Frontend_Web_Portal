import { Avatar } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

function KanbanDraggable({ appointment, index }) {
  const containerStyle = {
    borderRadius: "10px",
    boxShadow: "5px 5px 5px 2px grey",
    padding: "8px",
    color: "#000",
    marginBottom: "8px",
    minHeight: "90px",
    marginLeft: "10px",
    marginRight: "10px",
    // backgroundColor will be set dynamically
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  };

  const textContentStyle = {};

  const iconsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: "2px",
  };

  //for color change when u click n drag
  function bgcolorChange(props) {
    return props.isDragging
      ? "lightgreen"
      : props.isDraggable
      ? props.isBacklog
        ? "#F2D7D5"
        : "#DCDCDC"
      : props.isBacklog
      ? "#F2D7D5"
      : "#EAF4FC";
  }

  return (
    <Draggable
      draggableId={`${appointment.id}`}
      key={appointment.id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          style={containerStyle}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
            <span>
              <small>
                #{appointment.id}
                {"  "}
              </small>
            </span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", padding: 2 }}
          >
            <div>{appointment.title}</div>
          </div>
          <div style={iconsStyle}>
            <div>
              <Avatar
                onClick={() => console.log(appointment)}
                src={"https://joesch.moe/api/v1/random?key=" + appointment.id}
              />
            </div>
          </div>

          {/* must put placeholder or will crash */}
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
}

export default KanbanDraggable;

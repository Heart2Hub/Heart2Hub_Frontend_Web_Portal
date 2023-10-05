import React from "react";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { appointmentApi } from "../../../api/Api";
import { useEffect } from "react";
import MDButton from "components/MDButton";


import {

  Button,
  Icon,
  Box

} from '@mui/material';
import "./kanbanStyles.css";
import CreateAppointmentModal from "./CreateAppointmentModal";


function KanbanBoard() {
  const staff = useSelector(selectStaff);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  //create 1 array for each column
  const [registration, setRegistration] = useState([]);
  const [triage, setTriage] = useState([]);
  const [consultation, setConsultation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


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
    // console.log("item finding called");
    // console.log(typeof Number(id));
    // console.log(typeof array[0].appointmentId);
    // console.log(array.find((item) => item.appointmentId === Number(id)));
    return array.find((item) => item.appointmentId === Number(id));
  }

  function removeItemById(id, array) {
    // console.log("item removal called to remove " + id);
    // console.log(array.filter((item) => item.appointmentId !== Number(id)));
    return array.filter((item) => item.appointmentId !== Number(id));
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
        <div>

      <Box display="flex" justifyContent="left" alignItems="left" mb={2}>

        <MDButton
          Button
          variant="contained"
          color="primary"
          onClick={openModal}
        >
          Create New Appointment
          <Icon>add</Icon>
        </MDButton>
      </Box>


      {/* Use the CreateAppointmentModal component */}
      <CreateAppointmentModal isOpen={isModalOpen} onClose={closeModal} />      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          <KanbanColumn
            title="Registration"
            appointments={registration}
            id={"1"}
          />
          <KanbanColumn title="Triage" appointments={triage} id={"2"} />
          <KanbanColumn
            title="Consultation"
            appointments={consultation}
            id={"3"}
          />
        </div>
      </DragDropContext>
      </div>

    </>
  );
  // return (
  //   <>
  //     <DragDropContext onDragEnd={handleDragEnd}>
  //       {/* <h2 className="kanban-title">KANBAN BOARD</h2> */}
  //       <div className="kanban-board">
  //         <KanbanColumn
  //           title="Registration"
  //           appointments={registration}
  //           id={"1"}
  //         />
  //         <KanbanColumn title="Triage" appointments={triage} id={"2"} />
  //         <KanbanColumn
  //           title="Consultation"
  //           appointments={consultation}
  //           id={"3"}
  //         />
  //         <KanbanColumn
  //           title="Consultation"
  //           appointments={consultation}
  //           id={"3"}
  //         />
  //         <KanbanColumn
  //           title="Consultation"
  //           appointments={consultation}
  //           id={"3"}
  //         />
  //       </div>
  //     </DragDropContext>
  //   </>
  // );
}

export default KanbanBoard;

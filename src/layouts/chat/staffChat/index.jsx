import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  MessageSeparator,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import MDAvatar from "components/MDAvatar";
import { useEffect } from "react";
import { chatApi } from "api/Api";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import { REST_ENDPOINT } from "constants/RestEndPoint";
import socketIO from "socket.io-client";
import { staffApi } from "api/Api";
import dayjs from "dayjs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

var socket = null;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 1,
  borderRadius: 2,
  p: 5,
};

function StaffChat() {
  const loggedInStaff = useSelector(selectStaff);
  const [loading, setLoading] = useState(false);
  const reduxDispatch = useDispatch();

  //conversations
  const [conversations, setConversations] = useState(new Map());
  const [allStaffs, setAllStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [inputMessage, setInputMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newPayload, setNewPayload] = useState(null);
  const [openModal, setOpenModal] = useState();
  const [unit, setUnit] = useState(null);
  const [role, setRole] = useState(null);
  const [toStaff, setToStaff] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffRoles, setStaffRoles] = useState([]);

  const fetchConversations = async () => {
    const response = await chatApi.getStaffConversations(loggedInStaff.staffId);
    console.log(response.data);

    setConversations(response.data);
  };

  const createStaffConversation = async () => {
    try {
      const response = await chatApi.createStaffConversation(
        loggedInStaff.staffId,
        toStaff
      );
      setStaffOptions([]);
      setToStaff(null);
      setRole(null);
      setUnit(null);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllStaffs = async () => {
    try {
      const response = await staffApi.getAllStaff();
      const staffs = response.data;
      setAllStaffs(staffs);

      const resp = await staffApi.getStaffRoles();
      setStaffRoles(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      if (loggedInStaff) {
        connect();
        socket.on("messageResponse", (data) => onPrivateMessage(data));

        return () => {
          socket.disconnect();
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [loggedInStaff]);

  useEffect(() => {
    try {
      if (loggedInStaff) {
        fetchConversations();
      }
      if (allStaffs.length === 0) {
        getAllStaffs();
      }
      if (role && unit) {
        console.log(role);
        console.log(unit);
        console.log(allStaffs);
        const filteredStaff = allStaffs.filter(
          (staff) =>
            staff.staffId > 1 &&
            staff.staffRoleEnum === role &&
            staff.unit.name === unit
        );

        setStaffOptions(filteredStaff);
      }
    } catch (error) {
      console.log(error);
    }
  }, [loggedInStaff, role, unit]);

  useEffect(() => {}, [newPayload]);

  const connect = () => {
    socket = socketIO.connect("http://localhost:4000");
    // socket.emit('newUser', socket.id);
  };

  const handleSendMessage = () => {
    socket.emit("message", {
      content: inputMessage,
      senderId: loggedInStaff.staffId,
      conversationId: selectedConversation.conversationId,
      timestamp: new Date(),
      socketID: socket.id,
      randomId: Math.random(),
    });
    setInputMessage("");
    setSubmitted(true);
  };

  const handleConversationClick = (staffId, convo) => {
    setSelectedStaff(staffId);
    setSelectedConversation(convo);
    fetchConversations();
  };

  // add the message into the chat that is sent from others
  const onPrivateMessage = (payload) => {
    setSelectedConversation((prevConversation) => {
      const updatedConversation = { ...prevConversation };
      updatedConversation.listOfChatMessages = [
        ...updatedConversation.listOfChatMessages,
        payload,
      ];
      return updatedConversation;
    });
    setNewPayload(payload);
  };

  const formatTime = (dateTime) => {
    if (dateTime.charAt(dateTime.length - 1) === "Z") {
      return dayjs(dateTime, "YYYY-MM-DDTHH:mm:ss.SSSZ").format(
        "DD/MM/YYYY HH:mm"
      );
    } else {
      return dayjs(dateTime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm");
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setStaffOptions(allStaffs);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <div
        style={{
          height: "600px",
          position: "relative",
        }}
      >
        <MainContainer responsive>
          <Sidebar position="left" scrollable={false}>
            <MDButton
              variant="contained"
              color="info"
              onClick={handleOpenModal}
            >
              + Create new chat
            </MDButton>
            <ConversationList>
              {conversations.length !== 0 &&
                Array.from(Object.entries(conversations)).map(
                  ([staffId, convo]) => {
                    return (
                      <Conversation
                        key={staffId}
                        name={
                          allStaffs.length > 0
                            ? allStaffs.filter(
                                (staff) => staff.staffId == staffId
                              )[0].firstname +
                              " " +
                              allStaffs.filter(
                                (staff) => staff.staffId == staffId
                              )[0].lastname
                            : "N/A"
                        }
                        info={
                          allStaffs.length > 0
                            ? allStaffs.filter(
                                (staff) => staff.staffId == staffId
                              )[0].staffRoleEnum +
                              " (" +
                              allStaffs.filter(
                                (staff) => staff.staffId == staffId
                              )[0].unit.name +
                              ")"
                            : "N/A"
                        }
                        onClick={() => handleConversationClick(staffId, convo)}
                      >
                        <Conversation.Content>hi</Conversation.Content>
                        {/* <Avatar src={lillyIco} name="Lilly" status="available" /> */}
                      </Conversation>
                    );
                  }
                )}
            </ConversationList>
          </Sidebar>

          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <MDAvatar src={""} />
              <ConversationHeader.Content
                userName={
                  selectedStaff
                    ? allStaffs.filter(
                        (staff) => staff.staffId == selectedStaff
                      )[0].firstname +
                      " " +
                      allStaffs.filter(
                        (staff) => staff.staffId == selectedStaff
                      )[0].lastname
                    : "N/A"
                }
                info={
                  selectedStaff
                    ? allStaffs.filter(
                        (staff) => staff.staffId == selectedStaff
                      )[0].staffRoleEnum +
                      " (" +
                      allStaffs.filter(
                        (staff) => staff.staffId == selectedStaff
                      )[0].unit.name +
                      ")"
                    : "N/A"
                }
              />
              <ConversationHeader.Actions></ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList>
              {selectedConversation?.listOfChatMessages?.map((message) => (
                <>
                  <Message
                    key={
                      message.chatMessageId
                        ? message.chatMessageId
                        : message.randomId
                    }
                    model={{
                      message: message.content,
                      sentTime: "10:00",
                      sender: "xxx",
                      direction:
                        message.senderId == selectedStaff
                          ? "incoming"
                          : "outgoing",
                      position: "single",
                    }}
                  ></Message>
                  <Message.Header sentTime={formatTime(message.timestamp)} />
                  {/* <p style={{fontSize: '12px', float: message.senderId != selectedStaff ? 'right' : null, marginBottom: '5px'}}>time</p> */}
                </>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              value={inputMessage}
              onChange={(newMessage) => setInputMessage(newMessage)}
              onSend={handleSendMessage}
            />
          </ChatContainer>
        </MainContainer>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
            },
          }}
        >
          <Box sx={style}>
            <Grid container spacing={3}>
              <Grid md={12}>
                <Typography variant="h5">Create New Chat</Typography>
                <InputLabel sx={{ marginBottom: "5px", marginTop: "15px" }}>
                  Unit
                </InputLabel>
                <Select
                  name="unit"
                  fullWidth
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  sx={{ lineHeight: "3em" }}
                >
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Emergency Medicine">
                    Emergency Medicine
                  </MenuItem>
                  <MenuItem value="Surgery">Surgery</MenuItem>
                  <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                  <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                  <MenuItem value="Radiology">Radiology</MenuItem>
                  <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                </Select>
                <br />
                <br />
                <InputLabel sx={{ marginBottom: "5px" }}>Staff Role</InputLabel>
                <Select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  fullWidth
                  sx={{ lineHeight: "3em" }}
                >
                  {staffRoles.map((r) => (
                    <MenuItem value={r}>{r}</MenuItem>
                  ))}
                </Select>
                <br />
                <br />
                {role && unit && (
                  <>
                    <InputLabel sx={{ marginBottom: "5px" }}>
                      Select Staff
                    </InputLabel>
                    <Select
                      name="select_staff"
                      value={toStaff}
                      fullWidth
                      onChange={(e) => setToStaff(e.target.value)}
                      sx={{ lineHeight: "3em" }}
                    >
                      {staffOptions.map((staff) => (
                        <MenuItem value={staff.staffId}>
                          {staff.firstname + " " + staff.lastname}
                        </MenuItem>
                      ))}
                    </Select>
                    <br />
                    <br />
                  </>
                )}
                <div style={{ float: "right" }}>
                  <MDButton onClick={handleCloseModal} color="primary">
                    Cancel
                  </MDButton>
                  &nbsp;&nbsp;
                  <MDButton
                    sx={{ marginLeft: "10px" }}
                    disabled={!role || !unit}
                    onClick={createStaffConversation}
                    color="success"
                  >
                    Create
                  </MDButton>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default StaffChat;

import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
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
import { selectAccessToken } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import { REST_ENDPOINT } from "constants/RestEndPoint";
import socketIO from 'socket.io-client';
import { staffApi, patientApi } from "api/Api";
import dayjs from 'dayjs'
import { date } from "yup";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MDButton from "components/MDButton";
import InputLabel from '@mui/material/InputLabel';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import MDBox from "components/MDBox";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatBody from "./ChatBody";

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
  const accessToken = useSelector(selectAccessToken)
  const [loading, setLoading] = useState(false);
  const reduxDispatch = useDispatch();

  //conversations
  const [conversations, setConversations] = useState(new Map());
  const [patientConversations, setPatientConversations]= useState(new Map())
  const [allStaffs, setAllStaffs] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [inputMessage, setInputMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newPayload, setNewPayload] = useState(null)
  const [openModal, setOpenModal] = useState();
  const [unit, setUnit] = useState(null);
  const [role, setRole] = useState(null);
  const [toStaff, setToStaff] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffRoles, setStaffRoles] = useState([]);
  const [tabValue, setTabValue] = useState("Staff Chat")
  const [showUnread, setShowUnread] = useState([]);
 
  const fetchConversations = async () => {
    const response = await chatApi.getStaffConversations(loggedInStaff.staffId);
    const patientConvos = response.data;
    let staffConv = response.data;
    setPatientConversations(Object.fromEntries(Object.entries(patientConvos).filter(([key,value]) => key >= 1000)))
    staffConv = Object.fromEntries(Object.entries(staffConv).filter(([key,value]) => key < 1000));
    // staffConv = Object.fromEntries(Object.entries(staffConv).sort((a,b) => {
    //   console.log(a)
    //   console.log(b)
    //   const aVal = a[1].listOfChatMessages.length > 0 ? a[1].listOfChatMessages[a[1].listOfChatMessages.length-1].timestamp : null;
    //   const bVal = b[1].listOfChatMessages.length > 0 ? b[1].listOfChatMessages[b[1].listOfChatMessages.length-1].timestamp : null;
    //   console.log(aVal)
    //   console.log(bVal)

    //   if (aVal && bVal) {
    //     return dayjs(aVal, 'YYYY-MM-DD HH:mm:ss') - dayjs(bVal, 'YYYY-MM-DD HH:mm:ss')
    //   } else {
    //     return -1;
    //   }
    // }))
    setConversations(staffConv);
  };

  const createStaffConversation = async () => {
    try {
      const response = await chatApi.createStaffConversation(loggedInStaff.staffId, toStaff);
      setStaffOptions([])
      setToStaff(null)
      setRole(null)
      setUnit(null)
      setOpenModal(false);
    } catch (error) {
      console.log(error)
    }
    
  }

  const getAllStaffs = async () => {
    try {
      const response = await staffApi.getAllStaff();
      const staffs = response.data;
      setAllStaffs(staffs);

      const resp = await staffApi.getStaffRoles();
      setStaffRoles(resp.data);
    } catch (error) {
      console.log(error)
    }
  }

  const getAllPatients = async() => {
    try {
      const response = await patientApi.getAllPatients();
      const patients = response.data;
      console.log(patients)
      setAllPatients(patients);
    } catch (error) {
      console.log(error)
    }
  }

  const connect = () => {
    socket = socketIO.connect('http://localhost:4000');
    // socket.emit('newUser', socket.id);
  };

  const handleSendMessage = () => {
    socket.emit('message', {
      content: inputMessage,
      senderId: loggedInStaff.staffId,
      conversationId: selectedConversation.conversationId,
      token: accessToken,
      timestamp: new Date(),
      socketID: socket.id,
      randomId: Math.random()
    });
    setInputMessage("")
    setSubmitted(true);
  }

  const handleConversationClick = (staffId, convo) => {
    setSelectedStaff(staffId);
    setSelectedConversation(convo);
    fetchConversations();
    // removeShowUnread(convo.conversationId)
  }

  // const addShowUnread = (id) => {
  //   if (!showUnread.includes(id)) setShowUnread(prev => [...prev, id]);
  // }

  // const removeShowUnread = (id) => {
  //   setShowUnread(prev => prev.filter(item => item !== id));
  // }

  // add the message into the chat that is sent from others
  const onPrivateMessage = (payload) => {
      setSelectedConversation((prevConversation) => {
        if (prevConversation?.conversationId === payload?.conversationId) {
          const updatedConversation = { ...prevConversation };
          updatedConversation.listOfChatMessages = [
            ...updatedConversation.listOfChatMessages,
            payload,
          ];
          return updatedConversation;
        } else {
          // console.log("HERE")
          // addShowUnread(payload.conversationId)
          return prevConversation;
        }
      });
      setNewPayload(payload)
  };

  const formatTime = (dateTime) => {
    if (dateTime.charAt(dateTime.length-1) === 'Z') {
      return dayjs(dateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY HH:mm')
    } else {
      return dayjs(dateTime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true);
    setStaffOptions(allStaffs);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedStaff(null);
    setSelectedConversation(null);
  };
  
  const handleRefresh = () => {
    fetchConversations();
  }

  useEffect(() => {
    try {
      if (loggedInStaff) {
        connect();
        socket.on('messageResponse', (data) => onPrivateMessage(data));

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
      if (allPatients.length === 0) {
        getAllPatients();
      }
      if (role && unit) {
        const filteredStaff = allStaffs.filter(
          staff => staff.staffId > 1 && staff.staffRoleEnum === role && staff.unit.name === unit
        );
      
        setStaffOptions(filteredStaff);
      }
    } catch (error) {
      console.log(error);
    }
  }, [loggedInStaff, role, unit, showUnread.length]);

  useEffect(() => {

  }, [newPayload])

  return (
    <div>
      <DashboardNavbar />
      <div
        style={{
          height: "600px",
          position: "relative",
        }}
      >
        <TabContext value={tabValue}>
        <MDBox
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="tabs example"
            sx={{ width: "100%", height: "5rem" }}
            centered
          >
            <Tab
              icon={<BusinessCenterIcon fontSize="large" />}
              value="Staff Chat"
              label="Staff Chat"
              iconPosition="top"
            />
            {loggedInStaff.staffRoleEnum === "ADMIN" &&
            <Tab
              icon={<AccessAlarmIcon fontSize="large" />}
              value="Patient Chat"
              label="Patient Chat"
              iconPosition="top"
            />}
          </TabList>
        </MDBox>

        <TabPanel value="Staff Chat" sx={{ height: '800px'}}>
        <ChatBody 
            conversations={conversations}
            allPeople={allStaffs}
            user="staff"
            handleOpenModal={handleOpenModal}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            formatTime={formatTime}
            selectedStaff={selectedStaff}
            selectedConversation={selectedConversation}
            handleConversationClick={handleConversationClick}
            showUnread={showUnread}
            handleRefresh={fetchConversations}
          />
        </TabPanel>

        <TabPanel value="Patient Chat" sx={{ height: '800px'}}>
          <ChatBody 
            conversations={patientConversations}
            allPeople={allPatients}
            user="patient"
            handleOpenModal={handleOpenModal}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            formatTime={formatTime}
            selectedStaff={selectedStaff}
            selectedConversation={selectedConversation}
            handleConversationClick={handleConversationClick}
            showUnread={showUnread}
            handleRefresh={fetchConversations}
          />
        </TabPanel>


      
      </TabContext>

        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            slotProps={{
                backdrop: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  },
                },
              }}
        >
            <Box sx={style}>
              <Grid container spacing={3}>
                  <Grid md={12}>
                    <Typography variant="h5">Create New Chat</Typography>
                    <InputLabel sx={{marginBottom: '5px', marginTop: '15px'}}>Unit</InputLabel>
                    <Select
                        name="unit"
                        fullWidth
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        sx={{ lineHeight: "3em"}}
                      >
                        <MenuItem value="Cardiology">Cardiology</MenuItem>
                        <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                        <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                        <MenuItem value="Neurology">Neurology</MenuItem>
                        <MenuItem value="Emergency Medicine">Emergency Medicine</MenuItem>
                        <MenuItem value="Surgery">Surgery</MenuItem>
                        <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                        <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                        <MenuItem value="Radiology">Radiology</MenuItem>
                        <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                      </Select><br/><br/>
                      <InputLabel sx={{marginBottom: '5px'}}>Staff Role</InputLabel>
                      <Select
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        sx={{ lineHeight: "3em" }}
                      >
                        {staffRoles.map(r => 
                          <MenuItem value={r}>{r}</MenuItem>)}
                      </Select><br/><br/>
                     {role && unit && 
                     <>
                      <InputLabel sx={{marginBottom: '5px'}}>Select Staff</InputLabel>
                      <Select
                          name="select_staff"
                          value={toStaff}
                          fullWidth
                          onChange={(e) => setToStaff(e.target.value)}
                          sx={{ lineHeight: "3em" }}
                        >
                          {staffOptions.map(staff => 
                          <MenuItem value={staff.staffId}>{staff.firstname + " " + staff.lastname}</MenuItem>)}
                        </Select><br/><br/>
                     </>}
                     <div style={{float: 'right' }}>
                        <MDButton onClick={handleCloseModal} color="primary">
                          Cancel
                        </MDButton>&nbsp;&nbsp;
                        <MDButton 
                          sx={{marginLeft: '10px' }} 
                          disabled={!role || !unit}
                          onClick={createStaffConversation} 
                          color="success">
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
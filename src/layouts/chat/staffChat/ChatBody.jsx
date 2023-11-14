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
import { useState, useEffect } from "react";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import './ChatBody.css';

const ChatBody = ({conversations, allPeople, user, handleOpenModal, inputMessage, 
    setInputMessage, handleSendMessage, formatTime, selectedStaff, selectedConversation, handleConversationClick}) => {

    // useEffect(() => {
    //     handleRefresh()
    // }, [showUnread.length])

    const [value, setValue] = useState("");

    return (
        <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
            {user === "staff" &&
            <MDButton
            variant="contained"
            color="info"
            onClick={handleOpenModal}>+ Create new chat
            </MDButton>}
            <Search placeholder="Search..." value={value} onChange={v => setValue(v)} onClearClick={() => setValue("")} />
            <ConversationList>
                {conversations.length !== 0 &&
                    Array.from(Object.entries(conversations)).map(([id, convo]) => {
                    const conversationName = user === "staff"
                        ? allPeople.length > 0 ? allPeople.filter(staff => staff.staffId == id)[0].firstname + " " + allPeople.filter(staff => staff.staffId == id)[0].lastname : ""
                        : allPeople.filter(patient => patient.electronicHealthRecordId == (id/1000))[0].firstName + " " + allPeople.filter(patient => patient.electronicHealthRecordId == (id/1000))[0].lastName;

                    const conversationInfo = user === "staff"
                        ? allPeople.length > 0 ? allPeople.filter(staff => staff.staffId == id)[0].staffRoleEnum + " (" + allPeople.filter(staff => staff.staffId == id)[0].unit.name + ")" : ""
                        : "Patient";

                    const searchValue = value.toLowerCase();

                    // Filter conversations based on the search value
                    if (conversationName.toLowerCase().includes(searchValue) || conversationInfo.toLowerCase().includes(searchValue)) {
                        return (
                        <Conversation
                            key={id}
                            name={conversationName}
                            info={conversationInfo}
                            onClick={() => handleConversationClick(id, convo)}
                        />
                        );
                    }

                    return null; // Return null for conversations that don't match the search criteria
                    })}
                </ConversationList>
          </Sidebar>

          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <MDAvatar src={""} />
              {user === "staff" ?
              <ConversationHeader.Content
                userName={selectedStaff ? allPeople.filter(staff => staff.staffId == selectedStaff)[0].firstname + " " +  allPeople.filter(staff => staff.staffId == selectedStaff)[0].lastname 
                : Object.entries(conversations).length === 0 ? "No staff members have contacted you 😔" : "Select a chat on the left to chat with another staff member!"}
                info={selectedStaff ? 
                    allPeople.filter(staff => staff.staffId == selectedStaff)[0].staffRoleEnum + " (" + allPeople.filter(staff => staff.staffId == selectedStaff)[0].unit?.name + ")"
                   : ""}
              /> :
              <ConversationHeader.Content
                userName={selectedStaff ? allPeople.filter(patient => patient.electronicHealthRecordId == (selectedStaff/1000))[0].firstName + " " 
                    +  allPeople.filter(patient => patient.electronicHealthRecordId == (selectedStaff/1000))[0].lastName :
                    Object.entries(conversations).length === 0 ? "No patients have contacted you 😔" : "Select a chat on the left to respond to a patient!"}
                info={selectedStaff ? "Patient" : ""}
              />}
              <ConversationHeader.Actions>
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
            >
              {selectedConversation?.listOfChatMessages?.map((message =>
              <>
                <Message
                  key={message.chatMessageId ? message.chatMessageId : message.randomId}
                  model={{
                    message: message.content,
                    sentTime: "10:00",
                    sender: "xxx",
                    direction: selectedStaff >= 1000 ? (message.senderId == (selectedStaff / 1000) ? "incoming" : "outgoing") : (message.senderId == selectedStaff ? "incoming" : "outgoing"),
                    position: "single",
                  }}
                ></Message>
                <Message.Footer 
                    sender={selectedStaff >= 1000 ? (message.senderId == (selectedStaff / 1000) ? formatTime(message.timestamp) : "") : (message.senderId == selectedStaff ? formatTime(message.timestamp) : "")}
                    sentTime={selectedStaff >= 1000 ? (message.senderId == (selectedStaff / 1000) ? "" : formatTime(message.timestamp)) : (message.senderId == selectedStaff ? "" : formatTime(message.timestamp))}/>
              </>))}

            </MessageList>
            {selectedStaff &&
            <MessageInput
              placeholder="Type message here"
              value={inputMessage}
              onChange={(newMessage) => setInputMessage(newMessage)}
              onSend={handleSendMessage}
            />}
          </ChatContainer>
        </MainContainer>
    )
}

export default ChatBody;
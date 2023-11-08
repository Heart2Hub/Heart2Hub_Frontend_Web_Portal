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
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { chatApi } from "api/Api";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import { REST_ENDPOINT } from "constants/RestEndPoint";

var stompClient = null;

function StaffChat() {
  const loggedInStaff = useSelector(selectStaff);
  const [loading, setLoading] = useState(false);
  const reduxDispatch = useDispatch();

  //conversations
  const [conversations, setConversations] = useState(new Map());
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [inputMessage, setInputMessage] = useState("");

  const fetchConversations = async () => {
    const response = await chatApi.getStaffConversations(loggedInStaff.staffId);
    console.log(response.data);

    setConversations(response.data);
  };

  useEffect(() => {
    try {
      if (loggedInStaff) {
        connect();

        // fetchConversations();
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
    } catch (error) {
      console.log(error);
    }
  }, [loggedInStaff]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  //listen to your own websocket for incoming messages
  const onConnected = () => {
    stompClient.subscribe(
      "/user/" + loggedInStaff.staffId + "/private",
      onPrivateMessage
    );
    console.log("CONNECTED");
  };

  // add the message into the chat that is sent from others
  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);

    if (conversations.get(payloadData.senderStaffId)) {
      conversations.get(payloadData.senderStaffId).push(payloadData);
      setConversations(new Map(conversations));
    } else {
      let list = [];
      list.push(payloadData);
      conversations.set(payloadData.senderStaffId, list);
      setConversations(new Map(conversations));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  // to send your message
  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderStaffId: loggedInStaff.staffId,
        receiverStaffId: 1,
        status: "CHAT",
        timestamp: Date.now(),
        message: inputMessage,
      };

      console.log(chatMessage);
      console.log(JSON.stringify(chatMessage));

      //settle later
      // if (userData.senderStaffId !== selectedConversation) {
      //   conversations.get(selectedConversation).push(chatMessage);
      //   setConversations(new Map(conversations));
      // }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      // setUserData({ ...userData, message: "" });
      setInputMessage("");
    }
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
            <Search placeholder="Search..." />
            <ConversationList>
              {conversations.length !== 0 &&
                Array.from(conversations.entries()).map(([staffId, convo]) => {
                  return (
                    <Conversation
                      key={staffId}
                      name={staffId}
                      lastSenderName="testtest"
                      info={staffId}
                    >
                      {/* <Avatar src={lillyIco} name="Lilly" status="available" /> */}
                    </Conversation>
                  );
                })}
            </ConversationList>
          </Sidebar>

          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <MDAvatar src={""} />
              <ConversationHeader.Content
                userName="Zoe"
                info="Active 10 mins ago"
              />
              <ConversationHeader.Actions>
                {/* <VoiceCallButton />
          <VideoCallButton />
          <EllipsisButton orientation="vertical" /> */}
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              typingIndicator={<TypingIndicator content="Zoe is typing" />}
            >
              <MessageSeparator content="Saturday, 30 November 2019" />
              <Message
                model={{
                  message: "Hello my friend",
                  sentTime: "15 mins ago",
                  sender: "Zoe",
                  direction: "incoming",
                  position: "single",
                }}
              >
                {/* <Avatar src={zoeIco} name="Zoe" /> */}
              </Message>
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              value={inputMessage}
              // onChange={handleMessage}
              onChange={(newMessage) => setInputMessage(newMessage)}
              onSend={sendPrivateValue}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default StaffChat;

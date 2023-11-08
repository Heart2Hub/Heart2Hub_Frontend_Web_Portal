import React, { useEffect, useState } from "react";
import WebSocketService from "./WebSocketService";

function Chat2() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const handleMessageInput = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = () => {
    WebSocketService.sendMessage(messageInput);
    setMessageInput("");
  };

  useEffect(() => {
    // Establish the WebSocket connection when the component mounts
    WebSocketService.connect();

    return () => {
      // Disconnect the WebSocket when the component unmounts
      WebSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    // Subscribe to messages only after the WebSocket connection is established
    if (WebSocketService.stompClient) {
      const subscription = WebSocketService.subscribe((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up the subscription when the component unmounts
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [WebSocketService.stompClient]); // This effect depends on the stompClient

  // useEffect(() => {
  //   WebSocketService.connect();
  //   WebSocketService.subscribe((message) => {
  //     setMessages([...messages, message]);
  //   });

  //   return () => {
  //     WebSocketService.disconnect();
  //   };
  // }, [messages]);

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={handleMessageInput}
        placeholder="Enter your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Chat2;

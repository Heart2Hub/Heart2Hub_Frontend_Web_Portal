import Stomp from "stompjs";
import SockJS from "sockjs-client";

const WebSocketService = {
  stompClient: null,

  connect: () => {
    const socket = new SockJS("/ws");
    WebSocketService.stompClient = Stomp.over(socket);
    WebSocketService.stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
    });
  },

  disconnect: () => {
    if (WebSocketService.stompClient) {
      WebSocketService.stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    }
  },

  subscribe: (callback) => {
    if (WebSocketService.stompClient) {
      WebSocketService.stompClient.subscribe("/topic/messages", (message) => {
        const messageData = JSON.parse(message.body);
        callback(messageData);
      });
    }
  },

  sendMessage: (message) => {
    if (WebSocketService.stompClient) {
      WebSocketService.stompClient.send(
        "/app/chat",
        {},
        JSON.stringify({ content: message })
      );
    }
  },
};

export default WebSocketService;

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React from "react";
import StaffChat from "./staffChat";
import Chat2 from "./staffChat/Chat";
import ChatRoom from "./staffChat/ChatRoom";

function Chat() {
  return (
    <DashboardLayout>
      <StaffChat />

      {/* <Chat2 /> */}
      {/* <ChatRoom /> */}
    </DashboardLayout>
  );
}

export default Chat;

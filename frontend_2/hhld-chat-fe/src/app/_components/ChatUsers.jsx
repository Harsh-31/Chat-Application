import React, { useEffect } from "react";
import { useUsersStore } from "../zustand/useUsersStore";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import axios from "axios";
import { useAuthStore } from "../zustand/useAuthStore";

const ChatUsers = () => {
  const { users } = useUsersStore();
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs } = useChatMsgsStore();
  const { authName } = useAuthStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  };

  useEffect(() => {
    const getMsgs = async () => {
      console.log("getting msgs----------");
      const res = await axios.get(
        "http://localhost:8080/msgs",
        {
          params: {
            sender: authName,
            receiver: chatReceiver,
          },
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.length !== 0) {
        updateChatMsgs(res.data);
      } else {
        updateChatMsgs([]);
      }
    };
    if (chatReceiver) {
      getMsgs();
    }
  }, [chatReceiver]);

  return (
    <div>
      {users.map((user, index) => (
        <div
          key={user.id}
          onClick={() => setChatReceiver(user)}
          style={{
            backgroundColor: "#4A5568", // Default color
            color: "#FFFFFF", // Default color
            borderRadius: "8px",
            padding: "10px",
            margin: "10px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#000000"; // Hover color
            e.target.style.color = "#FFFFFF"; // Hover color
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4A5568"; // Default color
            e.target.style.color = "#FFFFFF"; // Default color
          }}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default ChatUsers;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Messages.css";

export default function Messages() {

  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState(null);

  const conversations = [
    {
      id: 1,
      name: "Rajesh Traders",
      avatar: "👨‍💼",
      lastMessage: "Is the tomato stock available?",
      time: "10:30 AM",
      unread: 2
    },
    {
      id: 2,
      name: "Fresh Market",
      avatar: "🧑‍💼",
      lastMessage: "I need 50 kg onions.",
      time: "Yesterday",
      unread: 1
    },
    {
      id: 3,
      name: "Green Basket",
      avatar: "👨‍🌾",
      lastMessage: "Thank you!",
      time: "Monday",
      unread: 0
    }
  ];

  return (
    <div className="messages-page">

      {/* HEADER */}

      <div className="messages-header">

        <div>
          <span className="messages-tag">
            💬 Farmer Communication
          </span>

          <h1>Messages</h1>

          <p>
            Connect with buyers and manage your conversations.
          </p>
        </div>

        <button
          className="messages-back-btn"
          onClick={() => navigate("/farmer-dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* MESSAGES CONTAINER */}

      <div className="messages-container">

        {/* CONVERSATION LIST */}

        <div className="conversation-list">

          <div className="conversation-title">
            <h2>Conversations</h2>

            <span>
              {conversations.length}
            </span>
          </div>


          {conversations.map((chat) => (

            <div
              key={chat.id}
              className={`conversation-item ${
                selectedChat === chat.id ? "selected-chat" : ""
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >

              <div className="conversation-avatar">
                {chat.avatar}
              </div>


              <div className="conversation-details">

                <div className="conversation-top">

                  <strong>
                    {chat.name}
                  </strong>

                  <small>
                    {chat.time}
                  </small>

                </div>

                <p>
                  {chat.lastMessage}
                </p>

              </div>


              {chat.unread > 0 && (
                <span className="unread-count">
                  {chat.unread}
                </span>
              )}

            </div>

          ))}

        </div>


        {/* CHAT AREA */}

        <div className="chat-area">

          {selectedChat === null ? (

            <div className="chat-empty">

              <div className="chat-empty-icon">
                💬
              </div>

              <h2>Select a conversation</h2>

              <p>
                Choose a buyer from the list to start
                viewing your messages.
              </p>

            </div>

          ) : (

            <>

              <div className="chat-header">

                <div className="chat-user-avatar">
                  {
                    conversations.find(
                      (chat) => chat.id === selectedChat
                    )?.avatar
                  }
                </div>

                <div>

                  <h3>
                    {
                      conversations.find(
                        (chat) => chat.id === selectedChat
                      )?.name
                    }
                  </h3>

                  <span>
                    Buyer
                  </span>

                </div>

              </div>


              <div className="chat-messages">

                <div className="received-message">
                  Hello! I am interested in your produce.
                </div>

                <div className="sent-message">
                  Sure! Please tell me what quantity you need.
                </div>

              </div>


              <div className="message-input">

                <input
                  type="text"
                  placeholder="Type your message..."
                />

                <button>
                  Send
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}
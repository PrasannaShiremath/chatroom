import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');

    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => socketRef.current.close();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        username,
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      };
      socketRef.current.send(JSON.stringify(message));
      setNewMessage('');
    }
  };

  return (
    <div className="chat">
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

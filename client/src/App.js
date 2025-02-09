import React, { useState, useEffect, useRef } from "react";
import "./styles.css"; // Keeping your amazing UI

const App = () => {
    const [username, setUsername] = useState("");
    const [isChatActive, setIsChatActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userColor, setUserColor] = useState("");

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (isChatActive) {
            socketRef.current = new WebSocket("ws://localhost:8080"); // Change when deploying

            socketRef.current.onopen = () => {
                console.log("Connected to WebSocket");
                setUserColor(getRandomColor()); // Assign a random color to the user
            };

            socketRef.current.onmessage = (event) => {
                const newMessage = JSON.parse(event.data);
                setMessages((prev) => [...prev, newMessage]);

                // Auto-scroll to latest message
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            };

            return () => {
                socketRef.current.close();
            };
        }
    }, [isChatActive]);

    const sendMessage = () => {
        if (message.trim() !== "" && socketRef.current?.readyState === WebSocket.OPEN) {
            const messageData = {
                username,
                message,
                color: userColor,
                time: new Date().toLocaleTimeString()
            };
            socketRef.current.send(JSON.stringify(messageData));
            setMessage(""); // Clear input field
        }
    };

    const getRandomColor = () => {
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD", "#E74C3C"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="chat-container">
            {!isChatActive ? (
                <div className="login-box">
                    <h2>Join the Chat</h2>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={() => setIsChatActive(true)}>Start Chat</button>
                </div>
            ) : (
                <div className="chat-box">
                    <h2 className="chat-title">Chatroom</h2>
                    <div className="messages-container">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message-bubble ${msg.username === username ? "sent" : "received"}`}
                                style={{ alignSelf: msg.username === username ? "flex-end" : "flex-start" }} // Align messages
                            >
                                <span className="username" style={{ color: msg.color }}>{msg.username}</span>
                                <p>{msg.message}</p>
                                <span className="timestamp">{msg.time}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

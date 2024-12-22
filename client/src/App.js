import React, { useState } from 'react';
import Chat from './Chat';
import './styles.css';

function App() {
  const [username, setUsername] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const enterChat = () => {
    if (username.trim()) setIsChatOpen(true);
  };

  return (
    <div className="App">
      {!isChatOpen ? (
        <div className="login">
          <h1>Welcome to Chat App</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={enterChat}>Join Chat</button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}

export default App;

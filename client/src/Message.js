import React from 'react';

const Message = ({ username, text, time }) => {
  return (
    <div className="message">
      <strong>{username}</strong> <em>{time}</em>
      <p>{text}</p>
    </div>
  );
};

export default Message;

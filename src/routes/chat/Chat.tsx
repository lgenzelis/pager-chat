import React, { useEffect, useRef, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { Message as MessageType, connect, disconnect } from 'src/services/chat';

import './styles.css';
import { Message } from './components/message';
import { MessageInput } from './components/messageInput';

export const Chat: React.FC<RouteChildrenProps> = ({ location: { search }, history }) => {
  const username = new URLSearchParams(search).get('username');
  const dummyBottomDiv = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [typers, setTypers] = useState<string[]>([]);

  useEffect(() => {
    if (!username) {
      history.replace('/');
    } else {
      connect(
        username,
        (newMsg: MessageType) => {
          setMessages((currentMessages) => [...currentMessages, newMsg]);
          dummyBottomDiv.current?.scrollIntoView({ behavior: 'smooth' });
        },
        setTypers,
      );
      return disconnect;
    }
  }, [history, username]);

  return (
    <div className="OuterContainer">
      <div className="ChatContainer">
        <div className="ChatMessagesContainer">
          {messages.map((msg, idx) => (
            <Message message={msg} key={`${msg.username}-${msg.time}-${idx}`} />
          ))}
          <div ref={dummyBottomDiv} />
        </div>
        <MessageInput />
        <div style={{ opacity: typers.length ? 1 : 0 }} className="TypersDiv">
          {typers.length === 1 ? `${typers[0]} is typing...` : 'People are typing...'}
        </div>
      </div>
    </div>
  );
};

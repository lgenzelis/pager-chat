import React, { useEffect, useRef, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { connect, sendTextMessage, isTyping, disconnect } from 'src/services/chat';
import { Message } from 'src/services/chat/types';

import './styles.css';
import { TextMessage } from './textMessage';

export const Chat: React.FC<RouteChildrenProps> = ({ location: { search }, history }) => {
  const username = new URLSearchParams(search).get('username');
  const [msg, setMsg] = useState('');
  const dummyBottomDiv = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [typers, setTypers] = useState<string[]>([]);

  useEffect(() => {
    if (!username) {
      history.replace('/');
    } else {
      connect(
        username,
        (newMsg: Message) => {
          setMessages((currentMessages) => [...currentMessages, newMsg]);
          if (newMsg.username !== username) {
            dummyBottomDiv.current?.scrollIntoView({ behavior: 'smooth' });
          }
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
          {messages.map((msg, idx) =>
            msg.type === 'text' ? <TextMessage {...msg} key={`${msg.username}-${msg.time}-${idx}`} /> : null,
          )}
          <div ref={dummyBottomDiv} />
        </div>
        <form
          onSubmit={(event) => {
            sendTextMessage(msg);
            setMsg('');
            event.preventDefault();
          }}
        >
          <div className="ChatInputContainer">
            <input
              type="text"
              className="ChatMsgInput"
              autoFocus
              placeholder="Message"
              value={msg}
              onChange={(event) => {
                isTyping();
                setMsg(event.target.value);
              }}
            />
            <input type="submit" className="ChatMsgSend" value="Send" disabled={!msg} />
          </div>
          {!!typers.length && (typers.length === 1 ? `${typers[0]} is typing...` : 'People are typing...')}
        </form>
      </div>
    </div>
  );
};

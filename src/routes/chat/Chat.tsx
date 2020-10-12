import React, { useEffect, useRef, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import {
  Message as MessageType,
  connect,
  sendTextMessage,
  userIsTyping,
  disconnect,
  sendImageMessage,
} from 'src/services/chat';

import './styles.css';
import { Message } from './components/message';

export const Chat: React.FC<RouteChildrenProps> = ({ location: { search }, history }) => {
  const username = new URLSearchParams(search).get('username');
  const [msg, setMsg] = useState('');
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
        <form
          className="ChatInputForm"
          onSubmit={(event) => {
            event.preventDefault();
            if (msg.toLowerCase().startsWith('/gif')) {
              const query = msg.substr(5).trim() || 'rick roll';
              const API_KEY = 'p6sA33BUc919642eiVspoiJu9PHTxcSd';
              console.log('~~~ query', query);
              fetch(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}`)
                .then((res) => res.json())
                .then(({ data }) => {
                  console.log('~~~ data', data);
                  console.log('~~~ data[0].title', data[0].title);
                  console.log('~~~ data[0].title', data[0].images.downsized.url);
                  sendImageMessage(data[0].images.downsized.url, data[0].title);
                });
            } else {
              sendTextMessage(msg);
            }
            setMsg('');
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
                userIsTyping();
                setMsg(event.target.value);
              }}
            />
            <input type="submit" className="ChatMsgSend" value="Send" disabled={!msg} />
          </div>
        </form>
        <div style={{ opacity: typers.length ? 1 : 0 }} className="TypersDiv">
          {typers.length === 1 ? `${typers[0]} is typing...` : 'People are typing...'}
        </div>
      </div>
    </div>
  );
};

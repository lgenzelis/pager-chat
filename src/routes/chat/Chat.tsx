import React, { useEffect, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';

import { connect, sendTextMessage, isTyping, disconnect } from 'src/services/chat';

import './styles.css';

export function Chat({ location: { search }, history }: RouteChildrenProps) {
  const username = new URLSearchParams(search).get('username');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!username) {
      history.replace('/');
    } else {
      connect(username);
      return () => disconnect();
    }
  }, [history, username]);

  return (
    <div className="OuterContainer">
      <div className="ChatContainer">
        <div className="ChatMessagesContainer">
          Jim Halperudsdsduu
          {/*messages.map*/}
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
        </form>
      </div>
    </div>
  );
}

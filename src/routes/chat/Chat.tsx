import React, { useEffect, useRef, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { connect, disconnect, ChatEvent as ChatEventType } from 'src/services/chat';

import './styles.css';
import { ChatEvent } from './components/chatEvent';
import { MessageInput } from './components/messageInput';

export const Chat: React.FC<RouteChildrenProps> = ({ location: { search }, history }) => {
  const username = new URLSearchParams(search).get('username');
  const dummyBottomDiv = useRef<HTMLDivElement | null>(null);

  const [chatEvents, setChatEvents] = useState<ChatEventType[]>();
  const [typers, setTypers] = useState<string[]>([]);

  useEffect(() => {
    if (!username) {
      history.replace('/');
    } else {
      connect(
        username,
        (newMsg: ChatEventType) => {
          setChatEvents((prevChatEvents) => [...(prevChatEvents ?? []), newMsg]);
        },
        setTypers,
        setChatEvents,
      );
      return disconnect;
    }
  }, [history, username]);

  useEffect(() => {
    if (chatEvents) {
      dummyBottomDiv.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatEvents]);

  return (
    <div className="OuterContainer">
      <div className="InnerContainer ChatContainer">
        {chatEvents ? (
          <>
            <div className="ChatMessagesContainer">
              {chatEvents.slice(chatEvents.length - 100).map((chatEvent, idx) => (
                <ChatEvent chatEvent={chatEvent} key={`${chatEvent.username}-${chatEvent.time}-${idx}`} />
              ))}
              <div ref={dummyBottomDiv} />
            </div>
            <MessageInput />
            <div style={{ opacity: typers.length ? 1 : 0 }} className="TypersDiv">
              {typers.length === 1 ? `${typers[0]} is typing...` : 'People are typing...'}
            </div>
          </>
        ) : (
          <div className="LoadingIndicator" />
        )}
      </div>
    </div>
  );
};

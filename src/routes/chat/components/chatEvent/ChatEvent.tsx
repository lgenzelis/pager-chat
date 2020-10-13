import React from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ChatEvent as ChatEventType } from 'src/services/chat';
import { getAvatarUrl } from 'src/services/avatar';

import './styles.css';

type TextMessageProps = {
  chatEvent: ChatEventType;
};

export const ChatEvent: React.FC<TextMessageProps> = React.memo(({ chatEvent }) => {
  const date = parseISO(chatEvent.time);
  let timeText = format(date, `h:mm aaaaa'm'`);
  if (!isToday(date)) {
    if (isYesterday(date)) {
      timeText = `Yesterday @${timeText}`;
    } else {
      timeText = `${format(date, 'MMMM do')} @${timeText}`;
    }
  }

  let chatEventContent: JSX.Element;
  switch (chatEvent.type) {
    case 'text':
      chatEventContent = (
        <div className="MsgBody">
          {chatEvent.text
            .split('\n')
            .filter(Boolean)
            .map((line, idx) => (
              <p key={idx} className="MessageTextLine">
                {line}
              </p>
            ))}
        </div>
      );
      break;
    case 'image':
      chatEventContent = <img src={chatEvent.url} alt={chatEvent.alt ?? ''} className="ImageMessage" />;
      break;
    case 'connected':
      chatEventContent = <div className="ConnectionEvent">{`${chatEvent.username} has joined the chat`}</div>;
      break;
    case 'disconnected':
      chatEventContent = <div className="ConnectionEvent">{`${chatEvent.username} has left the chat`}</div>;
      break;
  }

  return (
    <div className="TextMessageOuterContainer">
      <img className="Avatar" src={getAvatarUrl(chatEvent.username)} alt={`${chatEvent.username} Avatar`} />
      <div className="TextMessageContainer">
        {(chatEvent.type === 'text' || chatEvent.type === 'image') && (
          <div className="UserTimeContainer">
            <div className="Username">{chatEvent.username}</div>
            <div className="DateTime">{timeText}</div>
          </div>
        )}
        {chatEventContent}
      </div>
    </div>
  );
});

import React from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Message as MessageType } from 'src/services/chat';
import { getAvatarUrl } from 'src/services/avatar';

import './styles.css';

type TextMessageProps = {
  message: MessageType;
};

export const Message: React.FC<TextMessageProps> = React.memo(({ message }) => {
  const date = parseISO(message.time);
  let timeText = format(date, `h:mm aaaaa'm'`);
  if (!isToday(date)) {
    if (isYesterday(date)) {
      timeText = `Yesterday @${timeText}`;
    } else {
      timeText = `${format(date, 'MMMM do')} @${timeText}`;
    }
  }

  return (
    <div className="TextMessageOuterContainer">
      <img className="Avatar" src={getAvatarUrl(message.username)} alt={`${message.username} Avatar`} />
      <div className="TextMessageContainer">
        <div className="UserTimeContainer">
          <div className="Username">{message.username}</div>
          <div className="DateTime">{timeText}</div>
        </div>
        {message.type === 'text' ? (
          <div className="MsgBody">
            {message.text
              .split('\n')
              .filter(Boolean)
              .map((line, idx) => (
                <p key={idx} className="MessageTextLine">
                  {line}
                </p>
              ))}
          </div>
        ) : (
          <img src={message.url} alt={message.alt ?? ''} className="ImageMessage" />
        )}
      </div>
    </div>
  );
});

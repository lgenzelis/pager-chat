import React from 'react';
import { TextMessage as TextMessageType } from 'src/services/chat/types';
import './styles.css';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const TextMessage: React.FC<Omit<TextMessageType, 'type'>> = ({ username, time, text }) => {
  const imgSrc = `https://ui-avatars.com/api/?background=eee&color=000&name=${username}`;

  const date = parseISO(time);
  let timeText = format(date, `h:mmaaaaa'm'`);
  if (!isToday(date)) {
    if (isYesterday(date)) {
      timeText = `Yesterday @ ${timeText}`;
    } else {
      timeText = `${format(date, 'MMMM do')} @ ${timeText}`;
    }
  }

  return (
    <div className="TextMessageOuterContainer">
      <img className="Avatar" src={imgSrc} alt={`${username} Avatar`} />
      <div className="TextMessageContainer">
        <div className="UserTimeContainer">
          <div className="Username">{username}</div>
          <div className="DateTime">{timeText}</div>
        </div>
        <div className="MsgBody">{text}</div>
      </div>
    </div>
  );
};
//format(endDate, )

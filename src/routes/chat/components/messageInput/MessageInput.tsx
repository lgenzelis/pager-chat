import React, { useRef, useState } from 'react';
import { sendImageMessage, sendTextMessage, userIsTyping } from 'src/services/chat';

import './styles.css';

const lineHeightPxs = 16;
const maxRows = 3;

function resizeTextArea(
  event: React.ChangeEvent<HTMLTextAreaElement>,
  textareaInitialHeight: number,
  setTextAreaRows: (rows: number) => void,
) {
  /* adapted from https://codepen.io/liborgabrhel/pen/eyzwOx */

  const previousRows = event.target.rows;
  event.target.rows = 1;
  const currentRows = ~~((event.target.scrollHeight - textareaInitialHeight) / lineHeightPxs) + 1;

  if (currentRows === previousRows) {
    event.target.rows = currentRows;
  }

  if (currentRows >= maxRows) {
    event.target.rows = maxRows;
    event.target.scrollTop = event.target.scrollHeight;
  }

  if (currentRows <= maxRows) {
    setTextAreaRows(currentRows);
  } else {
    setTextAreaRows(maxRows);
  }
}

export const MessageInput: React.FC = () => {
  const [msg, setMsg] = useState('');
  const [textAreaRows, setTextAreaRows] = useState(1);
  const textareaInitialHeight = useRef<number>(0);

  const onSubmit = (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (msg.toLowerCase().startsWith('/gif')) {
      const query = msg.substr(5).trim() || 'rick roll';
      const API_KEY = 'p6sA33BUc919642eiVspoiJu9PHTxcSd';
      console.log('~~~ query', query);
      fetch(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}`)
        .then((res) => res.json())
        .then(({ data }) => {
          console.log('~~~ data', data);
          console.log('~~~ data[0].title', data[0].title); //TODO
          console.log('~~~ data[0].title', data[0].images.downsized.url);
          sendImageMessage(data[0].images.downsized.url, data[0].title);
        });
    } else {
      sendTextMessage(msg);
    }
    setMsg('');
    setTextAreaRows(1);
  };

  return (
    <form className="ChatInputForm" onSubmit={onSubmit}>
      <div className="ChatInputContainer">
        <textarea
          className="ChatMsgInput"
          autoFocus
          placeholder="Message"
          value={msg}
          onKeyPress={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              onSubmit(event);
            }
          }}
          onChange={(event) => {
            userIsTyping();
            setMsg(event.target.value);
            resizeTextArea(event, textareaInitialHeight.current, setTextAreaRows);
          }}
          rows={textAreaRows}
          style={{ lineHeight: `${lineHeightPxs}px` }}
          ref={(ref) => {
            if (!textareaInitialHeight.current) {
              textareaInitialHeight.current = ref?.scrollHeight ?? 0;
            }
          }}
        />
        <input type="submit" className="ChatMsgSend" value="Send" disabled={!msg} />
      </div>
    </form>
  );
};

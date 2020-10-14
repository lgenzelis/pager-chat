import React, { useRef } from 'react';
import { userIsTyping } from 'src/services/chat';

import './styles.css';

const lineHeightPxs = 16;
const maxRows = 3;

/* autoresizeTextArea adapted from https://codepen.io/liborgabrhel/pen/eyzwOx */
function autoresizeTextArea(
  event: React.ChangeEvent<HTMLTextAreaElement>,
  textareaInitialHeight: number,
  setTextAreaRows: (rows: number) => void,
) {
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

type TextInputProps = {
  msg: string;
  setMsg: (newMsg: string) => void;
  textAreaRows: number;
  setTextAreaRows: (nRows: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({
  msg,
  setMsg,
  textAreaRows,
  setTextAreaRows,
  onSubmit,
  loading,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaInitialHeight = useRef<number>(0);

  const textAreaOnKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      onSubmit(event);
    }
  };

  const textAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    userIsTyping();
    setMsg(event.target.value);
    autoresizeTextArea(event, textareaInitialHeight.current, setTextAreaRows);
  };

  const textAreaOnRef = (ref: HTMLTextAreaElement | null) => {
    textAreaRef.current = ref;
    if (!textareaInitialHeight.current) {
      textareaInitialHeight.current = ref?.scrollHeight ?? 0;
    }
  };

  return (
    <>
      <textarea
        autoFocus
        placeholder="Message"
        value={loading ? 'Loading...' : msg}
        onKeyPress={textAreaOnKeyPress}
        onChange={textAreaOnChange}
        ref={textAreaOnRef}
        className="ChatMsgInput"
        style={{ lineHeight: `${lineHeightPxs}px` }}
        rows={textAreaRows}
        disabled={loading}
      />
      {!loading && (
        <button type="submit" className="ChatMsgSend" disabled={!msg}>
          {msg.toLowerCase().startsWith('/gif') ? 'Search' : 'Send'}
        </button>
      )}
    </>
  );
};

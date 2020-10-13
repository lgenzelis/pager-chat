import React, { useRef, useState } from 'react';
import { sendImageMessage, sendTextMessage, userIsTyping } from 'src/services/chat';
import { getGifResults, GifResults } from 'src/services/gif';

import './styles.css';
import { GifPreviewer } from './GifPreviewer';

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

export type GifsPreviewData = {
  gifs: GifResults;
  activeIdx: number;
};

export const MessageInput: React.FC = () => {
  const [msg, setMsg] = useState('');
  const [textAreaRows, setTextAreaRows] = useState(1);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaInitialHeight = useRef<number>(0);
  const [gifPreviewData, setGifPreviewData] = useState<GifsPreviewData>();

  const onSubmit = (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (gifPreviewData) {
      const gif = gifPreviewData.gifs[gifPreviewData.activeIdx];
      sendImageMessage(gif.url, gif.title);
      setGifPreviewData(undefined);
    } else if (msg.toLowerCase().startsWith('/gif')) {
      getGifResults(msg.substr(5).trim()).then((results) => {
        if (results) {
          setGifPreviewData({ gifs: results, activeIdx: 0 });
        }
      });
    } else {
      sendTextMessage(msg);
    }
    setMsg('');
    setTextAreaRows(1);
    textAreaRef.current?.focus();
  };

  return (
    <form
      className="ChatInputForm"
      onSubmit={onSubmit}
      onReset={() => {
        setGifPreviewData(undefined);
        setMsg('');
        setTextAreaRows(1);
      }}
    >
      <div className="ChatInputContainer">
        {!gifPreviewData ? (
          <>
            <textarea
              className="ChatMsgInput"
              autoFocus
              placeholder="ChatEvent"
              value={msg}
              onKeyPress={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  onSubmit(event);
                }
              }}
              onChange={(event) => {
                userIsTyping();
                setMsg(event.target.value);
                autoresizeTextArea(event, textareaInitialHeight.current, setTextAreaRows);
              }}
              rows={textAreaRows}
              style={{ lineHeight: `${lineHeightPxs}px` }}
              ref={(ref) => {
                textAreaRef.current = ref;
                if (!textareaInitialHeight.current) {
                  textareaInitialHeight.current = ref?.scrollHeight ?? 0;
                }
              }}
            />
            <button type="submit" className="ChatMsgSend" disabled={!msg}>
              {msg.toLowerCase().startsWith('/gif') ? 'Search' : 'Send'}
            </button>
          </>
        ) : (
          <GifPreviewer
            gifPreviewData={gifPreviewData}
            setActivePreview={(activeIdx) =>
              setGifPreviewData(
                (prevPreviewData) =>
                  prevPreviewData && {
                    activeIdx,
                    gifs: prevPreviewData.gifs,
                  },
              )
            }
          />
        )}
      </div>
    </form>
  );
};

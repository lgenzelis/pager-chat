import React, { useRef, useState } from 'react';
import { sendImageMessage, sendTextMessage } from 'src/services/chat';
import { getGifResults, GifResults } from 'src/services/gif';

import './styles.css';
import { GifPreviewer } from './GifPreviewer';
import { TextInput } from './TextInput';

export type GifsPreviewData = {
  gifs: GifResults;
  activeIdx: number;
};

export const MessageInput: React.FC = () => {
  const [msg, setMsg] = useState('');
  const [textAreaRows, setTextAreaRows] = useState(1);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [gifPreviewData, setGifPreviewData] = useState<GifsPreviewData>();
  const [isFetchingGifs, setIsFetchingGifs] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (gifPreviewData) {
      const gif = gifPreviewData.gifs[gifPreviewData.activeIdx];
      sendImageMessage(gif.url, gif.title);
      setGifPreviewData(undefined);
    } else if (msg.toLowerCase().startsWith('/gif')) {
      setIsFetchingGifs(true);
      getGifResults(msg.substr(5).trim())
        .then((results) => {
          if (results) {
            setGifPreviewData({ gifs: results, activeIdx: 0 });
          }
        })
        .finally(() => setIsFetchingGifs(false));
    } else {
      sendTextMessage(msg);
    }
    setMsg('');
    setTextAreaRows(1);
    textAreaRef.current?.focus();
  };

  const onReset = () => {
    setGifPreviewData(undefined);
    setMsg('');
    setTextAreaRows(1);
  };

  const setActiveGifPreview = (activeIdx: number) =>
    setGifPreviewData(
      (prevPreviewData) =>
        prevPreviewData && {
          activeIdx,
          gifs: prevPreviewData.gifs,
        },
    );

  return (
    <form className="ChatInputForm" onSubmit={onSubmit} onReset={onReset}>
      <div className="ChatInputContainer">
        {!gifPreviewData ? (
          <TextInput {...{ msg, setMsg, textAreaRows, setTextAreaRows, onSubmit, loading: isFetchingGifs }} />
        ) : (
          <GifPreviewer gifPreviewData={gifPreviewData} setActivePreview={setActiveGifPreview} />
        )}
      </div>
    </form>
  );
};

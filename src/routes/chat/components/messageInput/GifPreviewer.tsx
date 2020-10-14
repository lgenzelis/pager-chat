import React, { useState } from 'react';

import { GifsPreviewData } from './MessageInput';

type GifPreviewerProps = {
  gifPreviewData: GifsPreviewData;
  setActivePreview: (activePreviewIdx: number) => void;
};

export const GifPreviewer: React.FC<GifPreviewerProps> = ({ gifPreviewData, setActivePreview }) => {
  const [temporaryActivePreviewIdx, setTemporaryActivePreviewIdx] = useState<number>(gifPreviewData.activeIdx);

  const onShuffle = () => {
    setTemporaryActivePreviewIdx((gifPreviewData.activeIdx + 1) % gifPreviewData.gifs.length);
  };

  return (
    <>
      <img
        src={gifPreviewData.gifs[temporaryActivePreviewIdx].url}
        alt={gifPreviewData.gifs[temporaryActivePreviewIdx].title}
        className="GifPreview"
        style={{ opacity: temporaryActivePreviewIdx !== gifPreviewData.activeIdx ? 0.4 : 1 }}
        onLoad={() => setActivePreview(temporaryActivePreviewIdx)}
      />
      <div className="GifPreviewButtonsContainer">
        <button type="submit" className="ChatMsgButton" autoFocus>
          Send
        </button>
        <button type="button" className="ChatMsgButton" onClick={onShuffle}>
          Shuffle
        </button>
        <button type="reset" className="ChatMsgButton">
          Cancel
        </button>
      </div>
    </>
  );
};

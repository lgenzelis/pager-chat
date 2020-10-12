type MessageBase = {
  username: string;
  time: Date;
};

type TextMessage = MessageBase & {
  type: 'text';
  text: string;
};

type ImageMessage = MessageBase & {
  type: 'image';
  url: string;
  alt: string | null;
};

export type Message = TextMessage | ImageMessage;

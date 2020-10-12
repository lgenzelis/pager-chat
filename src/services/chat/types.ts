type MessageBase = {
  username: string;
  time: string;
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

export type Typers = {
  [username: string]: boolean;
};

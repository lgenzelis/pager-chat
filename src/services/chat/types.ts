type MessageBase = {
  username: string;
  time: string;
};

export type TextMessage = MessageBase & {
  type: 'text';
  text: string;
};

export type ImageMessage = MessageBase & {
  type: 'image';
  url: string;
  alt: string | null;
};

export type Message = TextMessage | ImageMessage;

export type Typers = {
  [username: string]: boolean;
};

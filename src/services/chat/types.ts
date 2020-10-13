type ChatEventBase = {
  username: string;
  time: string;
};

type TextMessage = ChatEventBase & {
  type: 'text';
  text: string;
};

type ImageMessage = ChatEventBase & {
  type: 'image';
  url: string;
  alt: string | null;
};

export type Message = TextMessage | ImageMessage;

export type Typers = {
  [username: string]: boolean;
};

type Connection = ChatEventBase & {
  type: 'connected' | 'disconnected';
};

export type ChatEvent = Message | Connection;

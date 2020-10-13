import socketIOClient from 'socket.io-client';

import { ChatEvent, Message, Typers } from './types';

let socket: SocketIOClient.Socket | undefined;

export async function connect(
  username: string,
  onChatEvent: (message: ChatEvent) => void,
  onTypingEvent: (usersTyping: string[]) => void,
  onLoadInitialChatEventsBatch: (messages: ChatEvent[]) => void,
) {
  socket?.disconnect();
  socket = socketIOClient(`https://pager-hiring.herokuapp.com/?username=${username}`);

  const initialChatEvents: ChatEvent[] = [];
  const maxWaitPromise = new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 5000),
  );
  const maxWaitBetweenMsgsPromise = new Promise((resolve) => {
    let maxWaitBetweenMsgsTimeoutId: NodeJS.Timeout;
    socket?.on('message', (msg: Message) => {
      initialChatEvents.push(msg);
      if (maxWaitBetweenMsgsTimeoutId) {
        clearTimeout(maxWaitBetweenMsgsTimeoutId);
      }
      maxWaitBetweenMsgsTimeoutId = setTimeout(() => {
        resolve();
      }, 400);
    });
    socket?.on('user-connected', (_username: string) => {
      initialChatEvents.push({ type: 'connected', username: _username, time: new Date().toISOString() });
    });
    socket?.on('user-disconnected', (_username: string) => {
      initialChatEvents.push({ type: 'disconnected', username: _username, time: new Date().toISOString() });
    });
  });

  await Promise.race([maxWaitPromise, maxWaitBetweenMsgsPromise]);
  onLoadInitialChatEventsBatch(initialChatEvents);
  socket.removeAllListeners();

  socket.on('message', onChatEvent);

  socket.on('user-connected', (_username: string) => {
    onChatEvent({ type: 'connected', username: _username, time: new Date().toISOString() });
  });

  socket.on('user-disconnected', (_username: string) => {
    onChatEvent({ type: 'disconnected', username: _username, time: new Date().toISOString() });
  });

  socket.on('is-typing', (typers: Typers) => {
    onTypingEvent(
      Object.entries(typers)
        .filter(([otherUser, isTyping]) => isTyping && otherUser !== username)
        .map(([otherUser]) => otherUser),
    );
  });
}

export function disconnect() {
  socket?.emit('typing', false);
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = undefined;
}

export function sendTextMessage(message: string) {
  socket?.emit('text-message', message);
}

export function sendImageMessage(url: string, alt?: string) {
  socket?.emit('image-message', { url, alt });
}

export const userIsTyping = (function () {
  const nonTypingTimeMsMax = 1500;
  let userIsTyping = false;
  let timeoutId: NodeJS.Timeout | undefined;

  return () => {
    if (!userIsTyping) {
      socket?.emit('typing', true);
      userIsTyping = true;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
    timeoutId = setTimeout(() => {
      socket?.emit('typing', false);
      userIsTyping = false;
    }, nonTypingTimeMsMax);
  };
})();

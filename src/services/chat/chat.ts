import socketIOClient from 'socket.io-client';

import { Message, Typers } from './types';

let socket: SocketIOClient.Socket | undefined;

export async function connect(
  username: string,
  onMessageEvent: (message: Message) => void,
  onTypingEvent: (usersTyping: string[]) => void,
  onLoadInitialMsgsBatch: (messages: Message[]) => void,
) {
  socket?.disconnect();
  socket = socketIOClient(`https://pager-hiring.herokuapp.com/?username=${username}`);

  const initialMessages: Message[] = [];
  const maxWaitPromise = new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 3500),
  );
  const maxWaitBetweenMsgsPromise = new Promise((resolve) => {
    let maxWaitBetweenMsgsTimeoutId: NodeJS.Timeout;
    socket?.on('message', (msg: Message) => {
      initialMessages.push(msg);
      if (maxWaitBetweenMsgsTimeoutId) {
        clearTimeout(maxWaitBetweenMsgsTimeoutId);
      }
      maxWaitBetweenMsgsTimeoutId = setTimeout(() => {
        resolve();
      }, 200);
    });
  });

  await Promise.race([maxWaitPromise, maxWaitBetweenMsgsPromise]);
  onLoadInitialMsgsBatch(initialMessages);
  socket.removeAllListeners();

  socket.on('message', onMessageEvent);

  socket.on('is-typing', (typers: Typers) => {
    onTypingEvent(
      Object.entries(typers)
        .filter(([otherUser, isTyping]) => isTyping && otherUser !== username)
        .map(([otherUser]) => otherUser),
    );
  });

  // socket.on('user-connected', (_username: string) => {
  //   if (_username === username) {
  //
  //   }
  //
  // });
  //   console.log(username, 'CONNECTED');
  // socket.on('user-disconnected', (username: string) => {
  //   console.log(username, 'DISCONNECTED');
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

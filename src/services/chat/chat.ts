import socketIOClient from 'socket.io-client';

import { Message, Typers } from './types';

let socket: SocketIOClient.Socket | undefined;

export function connect(
  username: string,
  onMessageEvent: (message: Message) => void,
  onTypingEvent: (usersTyping: string[]) => void,
) {
  socket?.disconnect();
  socket = socketIOClient(`https://pager-hiring.herokuapp.com/?username=${username}`);
  // socket.on('user-connected', (username: string) => {
  //   console.log(username, 'CONNECTED');
  // socket.on('user-disconnected', (username: string) => {
  //   console.log(username, 'DISCONNECTED');

  socket.on('message', onMessageEvent);

  socket.on('is-typing', (typers: Typers) => {
    onTypingEvent(
      Object.entries(typers)
        .filter(([otherUser, isTyping]) => isTyping && otherUser !== username)
        .map(([otherUser]) => otherUser),
    );
  });
}

export function disconnect() {
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

export const isTyping = (function () {
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

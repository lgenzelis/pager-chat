import socketIOClient from 'socket.io-client';
import { Message } from './types';

let socket: SocketIOClient.Socket | undefined;

export function connect(username: string) {
  socket?.disconnect();
  socket = socketIOClient(`https://pager-hiring.herokuapp.com/?username=${username}`);
  socket.on('user-connected', (username: string) => {
    console.log(username, 'CONNECTED');
  });
  socket.on('user-disconnected', (username: string) => {
    console.log(username, 'DISCONNECTED');
  });
  socket.on('is-typing', (typers: any) => {
    // <typers> is a map where the `key` is the <username> and the value is a `boolean` that is `true` if the user is typing and `false` if not.
    // typers: {
    //   [username: string]: boolean
    //   }
    console.log('~~~ typers', typers);
  });
  socket.on('message', (message: Message) => {
    if (message.type === 'text') {
      console.log('MESSAGE from', message.username, 'at', message.time, ': ', message.text);
    } else {
      console.log('MESSAGE from', message.username, 'at', message.time, ': ', message.url, message.alt);
    }
  });
}

export function disconnect() {
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

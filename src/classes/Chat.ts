import WebSocket from 'ws';
import { EventEmitter } from 'events';
import * as I from '../interfaces';

export declare interface Chat {
  on(event: 'ready', listener: () => void): this;
  on(event: 'message', listener: (message: I.MessageGroups) => void): this;
  on(event: 'notice', listener: (notice: I.NoticeGroups) => void): this;
  on(event: 'close', listener: () => void): this;
}

export class Chat extends EventEmitter {
  private chatSocket: WebSocket;
  private userCredentials: I.Credentials;
  private regexps: I.ChatRegexps = {
    message: /:(?<user>[^ ]+?)!(?<host>[^ ]+?) (?<type>(PRIVMSG|WHISPER)) (?<channel>[^ ]+?) :(?<content>.*)/,
    notice: /:(?<host>[^ ]+?) NOTICE (?<channel>[^ ]+?) :(?<content>.*)/,
    ping: /PING :tmi.twitch.tv/,
  };
  private pingTimestamp: number = new Date().getTime();
}

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

  constructor(userCredentials: I.Credentials) {
    super();
    this.chatSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    this.chatSocket.addEventListener('open', this.handleSocketConnection);
    this.userCredentials = Object.assign(userCredentials, {
      token: this.parseTwitchToken(userCredentials.token),
    });
  }

  private handleSocketConnection = (): void => {
    this.chatSocket.addEventListener('message', this.handleSocketMessage);
    this.chatSocket.addEventListener('close', this.handleSocketClose);
    this.chatSocket.send(`PASS ${this.userCredentials.token}`);
    this.chatSocket.send(`NICK ${this.userCredentials.username}`);
    this.chatSocket.send(`CAP REQ :twitch.tv/commands`);
    this.emit('ready');
  };

  private handleSocketMessage = ({ data: receivedMessage }: any): void | boolean => {
    if (this.regexps.message.test(receivedMessage)) {
      const groups = this.regexps.message.exec(receivedMessage)!.groups;
      return this.emit('message', Object.assign({}, groups));
    }
    if (this.regexps.notice.test(receivedMessage)) {
      const groups = this.regexps.notice.exec(receivedMessage)!.groups;
      return this.emit('notice', Object.assign({}, groups));
    }
    if (this.regexps.ping.test(receivedMessage)) {
      this.pingTimestamp = new Date().getTime();
      return this.chatSocket.send('PONG :tmi.twitch.tv');
    }
  };

  private handleSocketClose = (): void => {
    this.emit('close');
  };

  private parseTwitchToken = (token: string): string => {
    if (!token.includes('oauth:')) {
      return `oauth:${token}`;
    }
    return token;
  };

  private parseChannelName = (channelName: string): string => {
    if (channelName[0] !== '#') {
      return `#${channelName}`;
    }
    return channelName;
  };

  public getPingTimestamp = (): number => {
    return this.pingTimestamp;
  };

  public joinChannel = (channelName: string): void => {
    channelName = this.parseChannelName(channelName);
    this.chatSocket.send(`JOIN ${channelName}`);
  };

  public leaveChannel = (channelName: string): void => {
    channelName = this.parseChannelName(channelName);
    this.chatSocket.send(`PART ${channelName}`);
  };

  public hostChannel = (channelName: string): void => {
    channelName = this.parseChannelName(channelName);
    this.chatSocket.send(`PRIVMSG #${this.userCredentials.username} :.host ${channelName}`);
  };

  public unhostChannel = (): void => {
    this.chatSocket.send(`PRIVMSG #${this.userCredentials.username} :.unhost`);
  };

  public sendMessage = (channelName: string, message: string): void => {
    channelName = this.parseChannelName(channelName);
    this.chatSocket.send(`PRIVMSG ${channelName} :${message}`);
  };

  public close = () => {
    this.chatSocket.close();
  };
}

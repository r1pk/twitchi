# Twitchi

Twitchi is a simple library written using TypeScript to perform actions on Twitch.tv using WebSocket requests.

## Setup

Twitchi repository contains only source files with the .ts extension. In order to use the library with pure js code, you must first compile the project using following commands.

```
  npm install
  npm run build
```

After the above commands are executed, you should see "dist" folder with .js files.

## Twitchi Examples

```javascript
const Twitchi = require('./dist');
const credentials = {
  username: 'bot-username',
  token: 'bot-token',
};

const chat = new Twitchi.Chat(credentials);

chat.on('ready', () => {
  chat.on('message', (message) => {
    console.log(message);
  });
  chat.on('notice', (notice) => {
    console.warning(notice);
  });
  chat.joinChannel('test-channel');
  chat.sendMessage('test-channel', 'Hello everyone!');
});
```

## Index

- [Twitchi](https://github.com/r1pk/Twitchi#twitchi-classes)
  - [Chat](https://github.com/r1pk/Twitchi#chat)
    - [Events](https://github.com/r1pk/Twitchi#events)
      - [`ready`](https://github.com/r1pk/Twitchi#ready)
      - [`message`](https://github.com/r1pk/Twitchi#message)
      - [`notice`](https://github.com/r1pk/Twitchi#notice)
      - [`close`](https://github.com/r1pk/Twitchi#close)
    - [Methods](https://github.com/r1pk/Twitchi#methods)
      - [`getPingTimestamp()`](https://github.com/r1pk/Twitchi#getpingtimestamp-number)
      - [`joinChannel()`](https://github.com/r1pk/Twitchi#joinchannelchannel-string-void)
      - [`leaveChannel()`](https://github.com/r1pk/Twitchi#leavechannelchannel-string-void)
      - [`hostChannel()`](https://github.com/r1pk/Twitchi#hostchannelchannel-string-void)
      - [`unhostChannel()`](https://github.com/r1pk/Twitchi#unhostchannelchannel-string-void)
      - [`sendMessage()`](https://github.com/r1pk/Twitchi#sendmessagechannel-string-message-string-void)
      - [`close()`](https://github.com/r1pk/Twitchi#close-void)

## Twitchi classes

Twitchi library currently contains only one class that accepts an object as a constructor parameter.

### Example

```javascript
const Twitchi = require('./dist'); // default typescript output folder
const credentials = {
  username: 'bot-username',
  token: 'bot-token',
};

// And now, based on the credentials object we can use constructor

const chat = new Twitchi.Chat(credentials);
```

All further usage examples of events/methods use will be based on this example.

## Chat

### Events

- ### `ready`

  This event is emitted when the bot has successfully connected to the IRC server.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    // your code
  });
  ```

- ### `message`

  This event is emitted when a message with `PRIVMSG` or `WHISPER` tag is sent over IRC.
  - `PRIVMSG` - Public message
  - `WHISPER` - Private message


  #### Usage

  ```javascript
  chat.on('message', (message) => {
    // your code
  });
  ```

  #### Message interface

  ```javascript
  {
    user: string;
    host: string;
    type: string; // PRIVMSG or WHISPER
    channel: string;
    content: string;
  }
  ```

- ### `notice`

  This event is emitted when a message with `NOTICE` tag is sent over IRC.

  #### Usage

  ```javascript
  chat.on('notice', (notice) => {
    // your code
  });
  ```

  #### Notice interface

  ```javascript
  {
    host: string;
    channel: string;
    content: string;
  }
  ```

- ### `close`

  This event is emitted when the irc connection is closed.

  #### Usage

  ```javascript
  chat.on('close', () => {
    // your code
  });
  ```

### Methods

- ### `getPingTimestamp(): number`

  Returns timestamp of the last received ping request.

  #### Usage

  ```javascript
  const pingTimestamp = bot.getPingTimestamp();
  console.log(new Date(pingTimestamp))
  ```

- ### `joinChannel(channel: string): void`

  Join chat on given channel.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    chat.joinChannel('randomChannel');
  });
  ```

- ### `leaveChannel(channel: string): void`

  Leaves chat on given channel.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    chat.leaveChannel('randomChannel');
  });
  ```

- ### `hostChannel(channel: string): void`

  Attempts to host a channel.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    chat.hostChannel('randomChannel');
  });
  ```

- ### `unhostChannel(channel: string): void`

  Attempts to unhost a channel.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    chat.unhostChannel('randomChannel');
  });
  ```

- ### `sendMessage(channel: string, message: string): void`

  Sends the message to the specified channel.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    chat.sendMessage('randomChannel', 'message 123');
  });
  ```

- ### `close(): void`

  Closes the connection to twitch irc.

  #### Usage

  ```javascript
  chat.on('ready', () => {
    chat.close();
  });
  ```

## Author

- **Patryk Krawczyk** - [r1pk](https://github.com/r1pk)

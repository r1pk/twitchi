export interface ChatRegexps {
  message: RegExp;
  notice: RegExp;
  ping: RegExp;
}

export interface MessageGroups {
  user: string;
  host: string;
  type: string;
  channel: string;
  content: string;
}

export interface NoticeGroups {
  host: string;
  channel: string;
  content: string; 
}

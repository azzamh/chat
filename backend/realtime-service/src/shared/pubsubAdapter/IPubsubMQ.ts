export interface IPubSubMQ {
  publishOnlineStatus(username: string, data: userOnlineStatusData): Promise<void>;
  publishTypingStatus(username: string, data: userTypingStatusData): Promise<void>;
  subscribeToOnlineStatus(subscriberUsername: string, username: string, callback: (data: userOnlineStatusData) => Promise<void>): Promise<void>;
  subscribeToTypingStatus(subscriberUsername: string, username: string, callback: (data: userTypingStatusData) => Promise<void>): Promise<void>;

  publishMessagesInbox(username: string, data: PubsubMessageData): Promise<void>;
  subscribeMessagesInbox(username: string, callback: (data: PubsubMessageData) => Promise<void>): Promise<void>;

  publishMessagesOutbox(username: string, data: PubsubMessageData): Promise<void>;
  subscribeMessagesOutbox(username: string, callback: (data: PubsubMessageData) => Promise<void>): Promise<void>;


}

export interface PubsubMessageData {
  id: string,
  room_seq_id: number,
  room_id: string,
  sender_id: string,
  content: string,
  sent_at: Date | null,
  delivered_at: Date | null,
  seen_at: Date | null,
  sender_username: string,
  sender_fullname: string
}

export interface userOnlineStatusData{
    userId: string,
    username: string,
    isOnline: boolean,
    timestamp: string
}

export interface userTypingStatusData{
    userId: string,
    username: string,
    isTyping: boolean,
    timestamp: string
}
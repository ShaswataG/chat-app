import { WebSocket } from 'ws';

export type ExtendedWebSocket = WebSocket & {
  userId?: string;
  username?: string;
  joinedRooms?: Set<string>;
};
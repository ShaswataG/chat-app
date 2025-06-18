import { WebSocket } from 'ws';

export type ExtendedWebSocket = WebSocket & {
  username?: string;
  joinedRooms?: Set<string>;
};
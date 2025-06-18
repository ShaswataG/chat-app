import WebSocket from 'ws';
import { Chat } from '../models/chat.model';
import { Room } from '../models/room.model';
import { ExtendedWebSocket } from '../types/ws.types';
import logger from '../utils/logger';

const roomsMap = new Map<string, Set<ExtendedWebSocket>>();

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws: ExtendedWebSocket) => {
    logger.info("Client connected")
    ws.joinedRooms = new Set();

    ws.on('message', async (data) => {
      try {
        const payload = JSON.parse(data.toString());
        const { type, room, username, message } = payload;

        if (type === 'join') {
          ws.username = username;
          ws.joinedRooms!.add(room);

          // persist room in DB if it doesn't exist
          let existingRoom = await Room.findOne({ name: room });
          if (!existingRoom) {
            existingRoom = await Room.create({ name: room });
            logger.info(`Room "${room}" created in DB`);
          }

          // Track in in-memory map for broadcasting
          if (!roomsMap.has(room)) {
            
            roomsMap.set(room, new Set());
          }
          roomsMap.get(room)!.add(ws);

          const recentMessages = await Chat.find({ room })
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

          ws.send(JSON.stringify({ type: 'history', room, messages: recentMessages.reverse() }));
        }

        if (type === 'leave') {
          ws.joinedRooms?.delete(room);
          roomsMap.get(room)?.delete(ws);
        }

        if (type === 'message') {
          const chat = await Chat.create({ room, username: ws.username, message });

          const broadcast = {
            type: 'message',
            room,
            username: ws.username,
            message,
            timestamp: chat.timestamp,
          };

          roomsMap.get(room)?.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(broadcast));
            }
          });
        }
      } catch (err) {
        console.error('Invalid message:', err);
      }
    });

    ws.on('close', () => {
      roomsMap.forEach((clients, room) => {
        clients.delete(ws);
        if (clients.size === 0) roomsMap.delete(room);
      });
    });
  });
};
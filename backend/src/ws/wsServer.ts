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
          const { type, roomName, roomId, username, message } = payload;

        if (type === 'create') {
          // persist room in DB if it doesn't exist
          logger.info('Create room event triggered')
          let existingRoom = await Room.findOne({ name: roomName });
          if (existingRoom) {
            ws.send(JSON.stringify({ type: 'error', message: 'Failed to create room! Room already exists!' }));
            return;
          }
          let newRoom = await Room.create({ name: roomName });
          logger.info(`Room "${roomName}" created in DB`);

          if (!roomsMap.has(newRoom?._id?.toString())) {
            roomsMap.set(newRoom?._id?.toString(), new Set());
          }
          roomsMap.get(newRoom?._id?.toString())!.add(ws);

          ws.username = username;
          ws.joinedRooms!.add(newRoom?._id?.toString());

          ws.send(JSON.stringify({ type: 'newRoomCreated', message: {
            id: newRoom._id,
            name: newRoom.name
          }}))
          return;
        }

        if (type === 'join') {
          ws.username = username;
          ws.joinedRooms!.add(roomId);

          // persist room in DB if it doesn't exist
          let existingRoom = await Room.findById(roomId);
          if (!existingRoom) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room doesn\'t exist!' }));
            return;
          }

          // Track in in-memory map for broadcasting
          if (!roomsMap.has(existingRoom?._id.toString())) {
            roomsMap.set(existingRoom?._id.toString(), new Set());
          }
          roomsMap.get(existingRoom._id.toString())!.add(ws);

          const recentMessages = await Chat.find({ room_id: roomId })
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

          ws.send(JSON.stringify({ type: 'history', room: roomId, messages: recentMessages.reverse() }));
          return;
        }

        if (type === 'leave') {
          ws.joinedRooms?.delete(roomId);
          roomsMap.get(roomId)?.delete(ws);
          return;
        }

        if (type === 'message') {
          console.log('roomId: ', roomId);
          console.log('username: ', username);
          console.log('message: ', message);
          const chat = await Chat.create({ room_id: roomId, username: ws.username, message });

          const broadcast = {
            type: 'message',
            roomId,
            username: ws.username,
            message,
            timestamp: chat.timestamp,
          };

          roomsMap.get(roomId)?.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(broadcast));
            }
          });
          return;
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
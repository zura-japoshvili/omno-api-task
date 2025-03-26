import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';

class WebSocketManager {
  private connections = new Map<string, Set<WebSocket>>();

  add(clientId: string, socket: WebSocket) {
    const room = this.connections.get(clientId) || new Set<WebSocket>();
    room.add(socket);
    this.connections.set(clientId, room);
  }

  remove(clientId: string, socket: WebSocket) {
    const room = this.connections.get(clientId);
    if (room) {
      room.delete(socket);
      if (room.size === 0) {
        this.connections.delete(clientId);
      }
    }
  }

  send(clientId: string, message: unknown): boolean {
    const room = this.connections.get(clientId);
    if (!room || room.size === 0) {
      return false;
    }

    let success = true;
    room.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to send message to a socket in room ${clientId}:`, error);
          success = false;
        }
      }
    });
    return success;
  }
}

export const websocketManager = new WebSocketManager();

const websocketPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('@fastify/websocket'));

  fastify.get('/ws', { websocket: true }, (socket, req) => {
    const url = new URL(`http://localhost${req.url}`);
    const clientId = url.searchParams.get('clientId'); 

    if (!clientId) {
      socket.close(1008, 'clientId required');
      return;
    }

    websocketManager.add(clientId, socket);
    fastify.log.info(`WebSocket connected to room: ${clientId}`);

    socket.on('close', () => {
      websocketManager.remove(clientId, socket);
      fastify.log.info(`WebSocket disconnected from room: ${clientId}`);
    });

    socket.on('error', (error) => {
      fastify.log.error(`WebSocket error in room: ${clientId}`, error);
      websocketManager.remove(clientId, socket);
    });
  });
};

export default fp(websocketPlugin, { name: 'websocket-manager' });
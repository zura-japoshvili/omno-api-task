import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';
import config from '../config/config';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  factor?: number;
}

class WebSocketManager {
  private connections = new Map<string, Set<WebSocket>>();
  private defaultRetryOptions: RetryOptions = {
    maxRetries: 3,
    baseDelay: 2000,
    factor: 2
  };

  add(fastify: any, clientId: string, socket: WebSocket) {
    const room = this.connections.get(clientId) || new Set<WebSocket>();
    room.add(socket);
    this.connections.set(clientId, room);
    fastify.log.info(`WebSocket connected to room: ${clientId}`);
  }

  remove(fastify: any, clientId: string, socket: WebSocket) {
    const room = this.connections.get(clientId);
    if (room) {
      room.delete(socket);
      if (room.size === 0) {
        this.connections.delete(clientId);
      }
      fastify.log.info(`WebSocket disconnected from room: ${clientId}`);
    }
  }

  async sendWithRetry(
    fastify: any, 
    clientId: string, 
    message: unknown, 
    retryOptions?: RetryOptions
  ): Promise<boolean> {
    const options = { ...this.defaultRetryOptions, ...retryOptions };

    for (let attempt = 0; attempt < options.maxRetries!; attempt++) {
      const room = this.connections.get(clientId);

      if (!room || room.size === 0) {
        fastify.log.warn(`No WebSocket connections found for clientId: ${clientId}. Attempt ${attempt + 1}`);
        
        // Calculate delay with exponential backoff
        const delay = options.baseDelay! * Math.pow(options.factor!, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Continue to next iteration if no connections
        continue;
      }

      let success = true;
      room.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
          try {
            socket.send(JSON.stringify(message));
          } catch (error) {
            success = false;
            fastify.log.error(`Send attempt ${attempt + 1} failed for socket in room ${clientId}`, error);
          }
        }
      });

      if (success) {
        fastify.log.info(`Successfully sent message on attempt ${attempt + 1}`);
        return true;
      }

      // Calculate delay with exponential backoff
      const delay = options.baseDelay! * Math.pow(options.factor!, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    fastify.log.error(`Failed to send message after ${options.maxRetries} attempts for clientId: ${clientId}`);
    return false;
  }

  send(fastify: any, clientId: string, message: unknown): boolean {
    const room = this.connections.get(clientId);
    if (!room || room.size === 0) {
      fastify.log.warn(`No WebSocket connections found for clientId: ${clientId}`);
      return false;
    }

    let success = true;
    room.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify(message));
        } catch (error) {
          success = false;
          fastify.log.error(`Failed to send message to socket in room ${clientId}`, error);
        }
      }
    });

    return success;
  }

  getConnectionCount(clientId: string): number {
    return this.connections.get(clientId)?.size || 0;
  }
}

export const websocketManager = new WebSocketManager();

const websocketPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('@fastify/websocket'));

  fastify.get('/ws', { websocket: true }, (socket, req) => {
    const url = new URL(`${config.baseUrl}${req.url}`);
    const clientId = url.searchParams.get('clientId');

    if (!clientId) {
      socket.close(1008, 'clientId required');
      fastify.log.warn('WebSocket connection attempt without clientId');
      return;
    }

    websocketManager.add(fastify, clientId, socket);

    socket.on('close', () => {
      websocketManager.remove(fastify, clientId, socket);
    });

    socket.on('error', (error) => {
      fastify.log.error(`WebSocket error in room: ${clientId}`, error);
      websocketManager.remove(fastify, clientId, socket);
    });
  });
};

export default fp(websocketPlugin, { name: 'websocket-manager' });
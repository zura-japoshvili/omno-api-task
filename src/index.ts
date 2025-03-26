import fastify, { FastifyInstance } from 'fastify';
import transactionRoutes from './routes/transactions.route';
import swaggerPlugin from './plugins/swagger';
import fastifyWebsocket from '@fastify/websocket';
import config from './config/config';

const server: FastifyInstance = fastify({ logger: true,  });

server.register(fastifyWebsocket);
server.register(swaggerPlugin);

server.register(transactionRoutes);

server.listen({ port: 3000, }, (err: Error | null) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server running at ${config.baseUrl}:${config.port}`);
  server.log.info(`Swagger UI running at ${config.baseUrl}:${config.port}/docs`);
});
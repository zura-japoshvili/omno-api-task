import fastify, { FastifyInstance } from 'fastify';
import transactionRoutes from './routes/transactions.route';
import swaggerPlugin from './plugins/swagger';
import dotenv from 'dotenv';
import fastifyWebsocket from '@fastify/websocket';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost';

const server: FastifyInstance = fastify({ logger: true });

server.register(fastifyWebsocket);
server.register(swaggerPlugin);

server.register(transactionRoutes);


server.listen({ port: PORT }, (err: Error | null) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server running at ${BASE_URL}:${PORT}`);
  server.log.info(`Swagger UI running at ${BASE_URL}:${PORT}/docs`);
});
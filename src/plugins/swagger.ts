import { FastifyPluginCallback } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyAutoload from '@fastify/autoload';
import path from 'path';
import config from '../config/config';

const swaggerPlugin: FastifyPluginCallback = (server, opts, done) => {
  const swaggerUrl = (config.baseUrl).replace('http://', ''); // Remove http:// if present

  const host = `${swaggerUrl}:${config.port}`;

  server.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Omno API Integration',
        version: '1.0.0'
      },
      host: host,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  });

  server.register(fastifyAutoload, {
    dir: path.join(__dirname, '../routes'),
    options: {
      prefix: '/api'  
    }
  });

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true
    }
  });

  done();
};

export default swaggerPlugin;
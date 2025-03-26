import { FastifyReply } from 'fastify';

export function handleError(error: any, reply: FastifyReply): void {
  if (error?.validation) {
    reply.code(400).send({ error: 'Invalid request data', details: error.validation });
  } else if (error.response) {
    switch (error.response.status) {
      case 400:
        reply.code(400).send({ error: 'Invalid transaction data' });
        break;
      case 401:
        reply.code(401).send({ error: 'Unauthorized: Invalid credentials' });
        break;
      case 403:
        reply.code(403).send({ error: 'Forbidden: Access denied' });
        break;
      case 500:
        reply.code(500).send({ error: 'External API server error' });
        break;
      default:
        reply.code(500).send({ error: 'Unexpected error from external API' });
    }
  } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    reply.code(503).send({ error: 'Service unavailable, please try again later' });
  } else {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
}
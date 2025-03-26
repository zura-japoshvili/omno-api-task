import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import createTransactionBodySchema, { CreateTransactionBody } from '../schemas/createTransactionBody';
import createTransactionResponseSchema from '../schemas/createTransactionResponse';
import webhookBodySchema, { WebhookBody } from '../schemas/webhookBody';
import webhookResponseSchema from '../schemas/webhookResponse';
import { createTransaction, getAccessToken } from '../services/omno.service';
import { websocketManager } from '../plugins/websocket';
import { handleError } from '../utils/errorHandler';
import config from '../config/config';


const transactionRoutes: FastifyPluginAsync = async (server) => {
  server.post('/create-transaction', {
    schema: {
      tags: ['Transactions'],
      body: createTransactionBodySchema,
      response: createTransactionResponseSchema
    }
  }, async (request: FastifyRequest<{ Body: CreateTransactionBody }>, reply) => {
    try {
      const orderId = uuidv4();
      const hookUrl = `${config.webhookBaseUrl}/api/webhook`;
      const transactionData = { ...request.body, orderId, hookUrl };

      const accessToken = await getAccessToken(
        config.omnoClientId!,
        config.omnoClientSecret!
      );

      const response = await createTransaction(accessToken, transactionData);

      reply.send({...response, orderId });
    } catch (error: any) {
      server.log.error(`Error creating transaction: ${JSON.stringify(error.message)}`);

      handleError(error, reply);
    }
  });

  server.post('/webhook', {
    schema: {
      tags: ['Transactions'],
      body: webhookBodySchema,
      response: webhookResponseSchema
    }
  }, async (request: FastifyRequest <{Body: WebhookBody}>, reply) => {
    try {
      const webhookData = request.body;
      const orderId = webhookData.orderId;

      server.log.info(`Webhook received: ${ JSON.stringify({orderId, data: webhookData })}`);

      const redirectUrl = webhookData['3dsRedirectUrl'];

      const sent = websocketManager.send(orderId, {
        orderId,
        status: webhookData.status,
        redirectUrl
      });
      
      if (sent) {
        server.log.info(`Sent 3dsRedirectUrl via WebSocket: ${JSON.stringify({ orderId, redirectUrl })}`);
      } else {
        server.log.warn('No WebSocket connection found for orderId:' + orderId);
      }

      reply.send({ status: 'Webhook received', });


    } catch (error: any) {
      server.log.error(`Error processing webhook: ${JSON.stringify(error)})`);

      handleError(error, reply);
    }
  });
};

export default transactionRoutes;
export default {
    200: {
      type: 'object',
      properties: { status: { type: 'string', description: 'Webhook processed' } }
    },
    500: {
      type: 'object',
      properties: { error: { type: 'string', description: 'Failed to process webhook' } }
    }
  };
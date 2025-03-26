export default {
    200: {
      type: 'object',
      properties: {
        orderId: { type: 'string'},
        paymentId: { type: 'string'},
      }
    },
    400: {
      type: 'object',
      properties: { error: { type: 'string', description: 'Invalid transaction data' } }
    },
    500: {
      type: 'object',
      properties: { error: { type: 'string', description: 'Failed to create transaction' } }
    }
  };
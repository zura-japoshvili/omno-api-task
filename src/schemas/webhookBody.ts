import { JSONSchemaType } from 'ajv';

export interface WebhookBody {
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  psp?: string;
  cardMask?: string;
  cardholder?: string;
  expirationDate?: string;
  country?: string;
  cardBrand?: string;
  customerId?: string;
  paymentResult?: string;
  initialAmount?: number;
  initialCurrency?: string;
  isApm?: boolean;
  paymentLog?: Array<{
    amount?: number;
    merchantId?: string;
    customerId?: string;
    currency?: string;
    paymentTransactionStatus?: string;
    transactionRequestType?: string;
    paymentId?: string;
    country?: string;
    hookUrl?: string;
    callback?: string;
    lang?: string;
    initialTransaction?: boolean;
    createdAt?: string;
    orderId?: string;
    initialAmount?: number;
    initialCurrency?: string;
  }>;
  billingData?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
  };
  paymentTransactionRequests?: any[];
  paymentSystemLog?: Array<{
    paymentId?: string;
    type?: string;
    logData?: {
      result?: boolean;
      pspMaxTransactionCountPerDay?: number;
      merchantId?: string;
      pspMaxTransactionCountPerMonth?: number;
      transactionCountPerDay?: number;
      transactionCountPerMonth?: number;
      pspName?: string;
    };
  }>;
  orderId: string;
  '3dsRedirectUrl': string;
}

export const webhookBodySchema: JSONSchemaType<WebhookBody> = {
  type: 'object',
  required: ['id', 'status', 'orderId', '3dsRedirectUrl'], 
  properties: {
    id: { type: 'string' },
    status: { type: 'string' },
    amount: { type: 'number', nullable: true },
    currency: { type: 'string', nullable: true },
    createdAt: { type: 'string', nullable: true },
    psp: { type: 'string', nullable: true },
    cardMask: { type: 'string', nullable: true },
    cardholder: { type: 'string', nullable: true },
    expirationDate: { type: 'string', nullable: true },
    country: { type: 'string', nullable: true },
    cardBrand: { type: 'string', nullable: true },
    customerId: { type: 'string', nullable: true },
    paymentResult: { type: 'string', nullable: true },
    initialAmount: { type: 'number', nullable: true },
    initialCurrency: { type: 'string', nullable: true },
    isApm: { type: 'boolean', nullable: true },
    paymentLog: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          amount: { type: 'number', nullable: true },
          merchantId: { type: 'string', nullable: true },
          customerId: { type: 'string', nullable: true },
          currency: { type: 'string', nullable: true },
          paymentTransactionStatus: { type: 'string', nullable: true },
          transactionRequestType: { type: 'string', nullable: true },
          paymentId: { type: 'string', nullable: true },
          country: { type: 'string', nullable: true },
          hookUrl: { type: 'string', nullable: true },
          callback: { type: 'string', nullable: true },
          lang: { type: 'string', nullable: true },
          initialTransaction: { type: 'boolean', nullable: true },
          createdAt: { type: 'string', nullable: true },
          orderId: { type: 'string', nullable: true },
          initialAmount: { type: 'number', nullable: true },
          initialCurrency: { type: 'string', nullable: true }
        },
        additionalProperties: false
      }
    },
    billingData: {
      type: 'object',
      nullable: true,
      properties: {
        firstName: { type: 'string', nullable: true },
        lastName: { type: 'string', nullable: true },
        address1: { type: 'string', nullable: true },
        city: { type: 'string', nullable: true },
        state: { type: 'string', nullable: true },
        country: { type: 'string', nullable: true },
        postalCode: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true }
      },
      additionalProperties: false
    },
    paymentTransactionRequests: {
      type: 'array',
      nullable: true,
      items: { type: 'object' }
    },
    paymentSystemLog: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          paymentId: { type: 'string', nullable: true },
          type: { type: 'string', nullable: true },
          logData: {
            type: 'object',
            nullable: true,
            properties: {
              result: { type: 'boolean', nullable: true },
              pspMaxTransactionCountPerDay: { type: 'number', nullable: true },
              merchantId: { type: 'string', nullable: true },
              pspMaxTransactionCountPerMonth: { type: 'number', nullable: true },
              transactionCountPerDay: { type: 'number', nullable: true },
              transactionCountPerMonth: { type: 'number', nullable: true },
              pspName: { type: 'string', nullable: true }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    },
    orderId: { type: 'string' },
    '3dsRedirectUrl': { type: 'string' }
  },
  additionalProperties: false
};

export default webhookBodySchema;
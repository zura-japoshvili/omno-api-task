import { JSONSchemaType } from 'ajv';

export interface CreateTransactionBody {
  amount: number;
  currency: string;
  lang: string;
  hookUrl: string;
  callback: string;
  callbackFail: string;
  billing: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
    externalUserId?: string;
    dateOfBirth?: string;
  };
  orderId: string;
  cardToken?: string;
  kycVerified?: boolean;
  previousPaymentCount?: number;
  cardData?: {
    cardNumber: string;
    cardHolderName: string;
    cardExpiryDate: string; // MM
    cardExpiryDate2: string; // YYYY
    cardCvv: string;
    browser: {
      colorDepth: number;
      userAgent: string;
      language: string;
      timeZone: string;
      screenWidth: number;
      javaEnabled: boolean;
      customerIp: string;
      screenHeight: number;
      windowHeight: number;
      timeZoneOffset: number;
      windowWidth: number;
    };
  };
  saveCard?: boolean;
  payment3dsType?: 'Redirection' | string;
  merchantInformation?: {
    name: string;
    merchantName?: string;
    country?: string;
    address1?: string;
    administrativeArea?: string;
    locality?: string;
    postalCode?: string;
    url?: string;
    customerServicePhoneNumber?: string;
    categoryCode?: string;
    noteToBuyer?: string;
  };
}

// Define the schema with proper handling for nullable fields
export const createTransactionBodySchema: JSONSchemaType<CreateTransactionBody> = {
  type: 'object',
  required: [
    'amount',
    'currency',
    'lang',
    'callback',
    'callbackFail',
    'billing',
    'orderId'
  ],
  properties: {
    amount: {
      type: 'number',
      description: 'The transaction amount'
    },
    currency: {
      type: 'string',
      description: 'Currency code (e.g., USD)'
    },
    lang: {
      type: 'string',
      description: 'Language code (e.g., en)'
    },
    hookUrl: {
      type: 'string',
      description: 'URL where the webhook will be sent'
    },
    callback: {
      type: 'string',
      description: 'URL to redirect after success'
    },
    callbackFail: {
      type: 'string',
      description: 'URL to redirect after failure'
    },
    billing: {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'address1',
        'city',
        'state',
        'country',
        'postalCode',
        'phone',
        'email'
      ],
      properties: {
        firstName: { type: 'string', description: 'First name of the cardholder' },
        lastName: { type: 'string', description: 'Last name of the cardholder' },
        address1: { type: 'string', description: 'Billing address' },
        city: { type: 'string', description: 'City of billing address' },
        state: { type: 'string', description: 'State of billing address' },
        country: { type: 'string', description: 'Country of billing address' },
        postalCode: { type: 'string', description: 'Postal code of billing address' },
        phone: { type: 'string', description: 'Phone number of the cardholder' },
        email: { type: 'string', description: 'Email address of the cardholder' },
        externalUserId: { type: 'string', nullable: true, description: 'External user identifier' },
        dateOfBirth: { type: 'string', nullable: true, description: 'Date of birth' }
      },
      additionalProperties: false
    },
    orderId: {
      type: 'string',
      description: 'Unique order identifier'
    },
    cardToken: {
      type: 'string',
      nullable: true,
      description: 'Token of the card'
    },
    kycVerified: {
      type: 'boolean',
      nullable: true, 
      default: false,
      description: 'Indicates if KYC is verified'
    },
    previousPaymentCount: {
      type: 'number',
      nullable: true, 
      default: 0,
      description: 'Number of previous payments'
    },
    cardData: {
      type: 'object',
      nullable: true,
      required: [
        'cardNumber',
        'cardHolderName',
        'cardExpiryDate',
        'cardExpiryDate2',
        'cardCvv',
        'browser'
      ],
      properties: {
        cardNumber: { type: 'string', description: 'Card number' },
        cardHolderName: { type: 'string', description: 'Name on the card' },
        cardExpiryDate: { type: 'string', description: 'Expiry date of the card (MM)' },
        cardExpiryDate2: { type: 'string', description: 'Expiry date of the card (YYYY)' },
        cardCvv: { type: 'string', description: 'CVV of the card' },
        browser: {
          type: 'object',
          required: [
            'colorDepth',
            'userAgent',
            'language',
            'timeZone',
            'screenWidth',
            'javaEnabled',
            'customerIp',
            'screenHeight',
            'windowHeight',
            'timeZoneOffset',
            'windowWidth'
          ],
          properties: {
            colorDepth: { type: 'number', description: 'Color depth of the browser' },
            userAgent: { type: 'string', description: 'User agent string of the browser' },
            language: { type: 'string', description: 'Browser language' },
            timeZone: { type: 'string', description: 'Time zone of the browser' },
            screenWidth: { type: 'number', description: 'Screen width of the browser' },
            javaEnabled: { type: 'boolean', description: 'Indicates if Java is enabled' },
            customerIp: { type: 'string', description: 'Customer IP address' },
            screenHeight: { type: 'number', description: 'Screen height of the browser' },
            windowHeight: { type: 'number', description: 'Window height of the browser' },
            timeZoneOffset: { type: 'number', description: 'Time zone offset of the browser' },
            windowWidth: { type: 'number', description: 'Window width of the browser' }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    saveCard: {
      type: 'boolean',
      nullable: true, // Added nullable to match optional nature
      default: false,
      description: 'Indicates if the card should be saved'
    },
    payment3dsType: {
      type: 'string',
      nullable: true, // Added nullable to match optional nature
      default: 'Redirection',
      description: 'Type of 3DS process'
    },
    merchantInformation: {
      type: 'object',
      nullable: true,
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Merchant name in bank receipt (max 22 chars)' },
        merchantName: { type: 'string', nullable: true, description: 'Merchant name in 3DS page' },
        country: { type: 'string', nullable: true, description: '2-letter country code' },
        address1: { type: 'string', nullable: true, description: 'Merchant address' },
        administrativeArea: { type: 'string', nullable: true, description: 'State or province' },
        locality: { type: 'string', nullable: true, description: 'City' },
        postalCode: { type: 'string', nullable: true, description: 'Postal code' },
        url: { type: 'string', nullable: true, description: 'Merchant website URL' },
        customerServicePhoneNumber: { type: 'string', nullable: true, description: 'Customer service phone' },
        categoryCode: { type: 'string', nullable: true, description: 'MCC code' },
        noteToBuyer: { type: 'string', nullable: true, description: 'Note to buyer' }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};

export default createTransactionBodySchema;
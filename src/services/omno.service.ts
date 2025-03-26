import axios from 'axios';

export async function getAccessToken(clientId: string, clientSecret: string) {
  try {
    const response: any = await axios.post(
      'https://sso.omno.com/realms/omno/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id:  clientId,
        client_secret: clientSecret
      })
    );

    return response.data.access_token;
  } catch (error: any) {
    throw new Error(`Failed to get access token: ${error.response?.status} - ${error.message}`);
  }
}

export async function createTransaction(accessToken: string, transactionData: any): Promise<any> {
  try {
    const response = await axios.post(
      'https://api.omno.com/transaction/h2h/create',
      transactionData,
      {
        headers: {
          'authorization': `Bearer ${accessToken}`,
          'content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to create transaction: ${error.response?.status} - ${error.message}`);
  }
}
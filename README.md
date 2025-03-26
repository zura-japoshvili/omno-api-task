# Fastify Omno API Integration

A Fastify-based Node.js API integrating with the Omno API for transaction creation and 3DS payment handling.

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (optional for local development without Docker)
- Ngrok account (free tier) with an [authentication token](https://dashboard.ngrok.com/get-started/your-authtoken)

---

## Project Overview
### What This Project Does
This project integrates with the Omno API to:

- **Create Transactions:** Initiates a payment process with Omno.
- **Handle Webhooks:** Receives real-time updates from Omno (e.g., 3DS redirect URLs).
- **Notify Clients:** Sends updates to connected clients via **WebSocket.**


#### Transaction Flow
1. Transaction Creation:
    - A **POST /create-transaction** request is sent with payment details.

    - The API generates a unique **orderId** and forwards the 
    request to Omno.

    - Omno processes the request and prepares a response.

2. Webhook Notification:
    - Omno sends a **POST /webhook** request to the specified **WEBHOOK_BASE_URL** **(Ngrok URL locally)**.

    - The API logs the webhook data and checks for a **3dsRedirectUrl**.

3. WebSocket Delivery:
    - If a **3dsRedirectUrl** is present, it’s sent via WebSocket to clients connected with the matching **orderId**.
    
    - Clients (e.g., a frontend app) can then redirect the user to complete the 3DS process.



## Setup and Running the Application

### Using Docker (Recommended)

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
2. Start Ngrok
Run Ngrok to expose your local server:
    ```bash
    docker-compose up ngrok
    ```
    
- Open http://localhost:4040 in your browser to view the Ngrok dashboard.
- Copy the generated URL (e.g., https://abc123.ngrok-free.app).

 > [!WARNING]
 > Ngrok Warning: Ngrok is used locally to receive webhook data from the Omno API. In production, replace WEBHOOK_BASE_URL with your server's static URL. Each time Ngrok starts, it generates a new URL, so update the WEBHOOK_BASE_URL accordingly.

3. Update Environment Variables
Edit the **WEBHOOK_BASE_URL** in **docker-compose.yml** with the Ngrok URL from step 2:

**environment:**
```bash
  WEBHOOK_BASE_URL=https://<your-ngrok-url>.ngrok-free.app
```

- Replace OMNO_CLIENT_ID and OMNO_CLIENT_SECRET with your Omno credentials.

4. Start the Fastify Application
```bash
docker-compose up app
```
- The API will be available at http://localhost:3000.

## Testing the API

You can test the API using **Swagger UI**, **Postman**, or **cURL**. Postman also supports WebSocket testing.

### Swagger UI
- Open `http://localhost:3000/docs` to access the Swagger UI.
- Use the interactive interface to send a `POST /create-transaction` request and explore responses.

### Postman
1. **Install Postman**
   - Download and install [Postman](https://www.postman.com/downloads/).

2. **Test HTTP Endpoints**
   - **Create Transaction**:
     - Method: `POST`
     - URL: `http://localhost:3000/create-transaction`
     - Headers: `Content-Type: application/json`
     - Body (raw JSON):
       ```json
       {
         "amount": 100,
         "currency": "USD",
         "lang": "en",
         "callback": "http://example.com/success",
         "callbackFail": "http://example.com/fail",
         "billing": {
           "firstName": "John",
           "lastName": "Doe",
           "address1": "123 Street",
           "city": "Tbilisi",
           "state": "TB",
           "country": "GE",
           "postalCode": "0100",
           "phone": "+995555123456",
           "email": "john.doe@example.com"
         },
         "orderId": "test-order-123"
       }
    - Send the request and note the `orderId` in the response.

- **Simulate Webhook**:
  - Method: `POST`
  - URL: `https://<your-ngrok-url>.ngrok-free.app/webhook` <- **Replace From Grok UI**
  - Headers: `Content-Type: application/json`
  - Body (raw JSON):
    ```json
    {
      "orderId": "test-order-123",
      "status": "pending",
      "3dsRedirectUrl": "https://example.com/3ds"
    }
    ```

3. **Test WebSocket**
- In Postman, click "New" > "WebSocket Request".
- URL: ws://localhost:3000/ws?clientId=test-order-123
- Connect to the WebSocket.
- Send the webhook request (above), and you should see a message like:
json
```bash
{"orderId": "test-order-123", "status": "pending", "redirectUrl": "https://example.com/3ds"}
```

### cURL
1. Create Transaction

```bash
curl -X POST http://localhost:3000/create-transaction \
-H "Content-Type: application/json" \
-d '{"amount": 100, "currency": "USD", "lang": "en", "hookUrl": "https://<your-ngrok-url>.ngrok-free.app/webhook", "callback": "http://example.com/success", "callbackFail": "http://example.com/fail", "billing": {"firstName": "John", "lastName": "Doe", "address1": "123 Street", "city": "Tbilisi", "state": "TB", "country": "GE", "postalCode": "0100", "phone": "+995555123456", "email": "john.doe@example.com"}, "orderId": "test-order-123"}'
```
2. Simulate Webhook
```bash
curl -X POST https://<your-ngrok-url>.ngrok-free.app/webhook \
-H "Content-Type: application/json" \
-d '{"orderId": "test-order-123", "status": "pending", "3dsRedirectUrl": "https://example.com/3ds"}'
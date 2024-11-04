# WebSocket Chat Application

This is a simple chat application that uses WebSockets for real-time communication. It includes robust disconnection handling to ensure a reliable and responsive user experience.

## Features

- Real-time chat messaging
- Automatic reconnection with exponential backoff
- Graceful handling of network changes (online/offline)
- Explicit disconnect functionality for user-initiated actions
- Ping/pong mechanism to detect and handle stale connections
- Comprehensive error handling and status updates

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- A modern web browser (e.g., Chrome, Firefox, Safari)

### Installation

1. Install the dependencies:

```bash
npm install
```

### Running the Application

1. Start the WebSocket server:

```bash
node server.js
```

2. Open your web browser and navigate to `http://localhost:3000`.

### Usage

1. Enter a username to join the chat.
2. Type your messages in the input field and press Enter or click the "Send" button to send them.
3. The chat interface will display the messages with the sender's username.
4. If the connection is lost, the application will automatically try to reconnect with an exponential backoff strategy.
5. You can manually disconnect by clicking the "Logout" button (or equivalent).

## Architecture

The application is composed of two main components:

1. **WebSocket Server**: The server-side component that handles WebSocket connections, broadcasts messages, and manages connection state.
2. **WebSocket Client**: The client-side component that connects to the WebSocket server, sends and receives messages, and handles various connection events.
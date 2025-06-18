import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { setupWebSocket } from './ws/wsServer';

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  setupWebSocket(server);
}).catch((error) => {
  console.error(error);
});

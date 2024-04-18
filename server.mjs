import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    const json = JSON.parse(data)

    console.log(json)

    switch (json.request) {
      case 'ping':
        const response = JSON.stringify({ uuid: json.uuid, response: 'ping' })
        ws.send(response)
        break

      case 'change':
        break

      default:
        break
    }
  });
});

console.log('Serving 8081')
server.listen(8081);
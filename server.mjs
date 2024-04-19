import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });
const leaderboards = []

wss.on('connection', (ws) => {
  console.log(`${wss.clients.size} clients connected`)

  ws.on('error', console.error);

  ws.on('message', (data) => {
    const json = JSON.parse(data)
    if (!json.cmd) return
    console.log('msg received', json.cmd)

    switch (json.cmd) {
      case 'ping':
        ws.send(JSON.stringify({ response: 'ping' }))
        break

      case 'listen':
        leaderboards.push(ws)
        ws.send(JSON.stringify({ response: 'listen' }))
        break

      case 'update':
        leaderboards.forEach((leaderboard) => {
          leaderboard.send(JSON.stringify({
            response: 'update',
            uuid: json.uuid,
            tierList: json.tierList,
          }))
        })
        break

      default:
        break
    }
  });
});

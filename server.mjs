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

      case 'change':
        leaderboards.forEach((leaderboard) => {
          leaderboard.send(JSON.stringify({
            response: 'notif',
            uuid: json.uuid,
            tierlist: json.tierlist,
          }))
        })
        break

      default:
        break
    }
  });
});

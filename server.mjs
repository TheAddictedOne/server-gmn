import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8081 })
const leaderboards = []

wss.on('connection', (ws) => {
  console.log(`${wss.clients.size} clients connected`)

  ws.on('error', console.error)

  ws.on('message', (data) => {
    const json = JSON.parse(data)
    if (!json.cmd) return
    console.log(json.cmd)

    switch (json.cmd) {
      case 'ping':
        ws.send(JSON.stringify({ response: 'ping' }))
        break

      case 'subscribe':
        console.log('sub')
        leaderboards.push(ws)
        ws.send(JSON.stringify({ response: 'subscribe' }))
        break

      case 'update':
        leaderboards.forEach((leaderboard) => {
          leaderboard.send(
            JSON.stringify({
              response: 'player_update',
              uuid: json.uuid,
              characters: json.characters,
            })
          )
        })
        break

      default:
        break
    }
  })
})

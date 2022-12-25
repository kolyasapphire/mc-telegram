// @ts-ignore
import Query from 'mcquery'
import type { VercelRequest, VercelResponse } from '@vercel/node'

import 'dotenv/config'
const { TOKEN, HOST, PORT } = process.env

const makeReply = (chatId: string) => async (message: string) =>
  await fetch(
    `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${message}`
  )

type Stats = {
  type: number
  sessionId: number
  hostname: string
  gametype: string
  game_id: string
  version: string
  plugins: string
  map: string
  numplayers: string
  maxplayers: string
  hostport: string
  hostip: string
  player_: string[]
  from: { address: string; port: number }
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (!req.body) {
    res.send('Hello')
    return
  }

  const chatId = req.body.message.chat.id
  const reply = makeReply(chatId)

  const query = new Query(HOST, PORT, { timeout: 3000 })

  let players: string[] = []

  try {
    await query.connect()
    await query.full_stat((err: Error, stat: Stats) => {
      if (err) {
        console.error(err)
        throw new Error('Error on full stat')
      } else {
        console.log('Stats request successful')
        players = stat.player_
      }
    })
    await query.close()
  } catch {
    await reply('Server could not be reached, probably off.')
    await query.close()
    res.send('Failed to get stats')
  }

  if (players.length === 0) {
    await reply('No one is playing :(')
  } else {
    await reply(players.join(', '))
  }

  res.send('All good')
}

export default handler

import { NowRequest, NowResponse } from '@now/node'
import fetch from 'node-fetch'

const STEAM_KEY: string | undefined = process.env.STEAM_KEY
const BASE_URL =
  'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002'

export default async (req: NowRequest, res: NowResponse) => {
  if (STEAM_KEY === undefined) {
    res.setHeader('Content-Type', 'text/plain')
    return res.status(500).send('Internal Server Error')
  }

  try {
    const params = `?key=${STEAM_KEY}&steamids=${req.query.id}`
    const resp = await fetch(`${BASE_URL}/${params}`)

    const {
      response: { players },
    } = await resp.json()
    if (players.length === 0) {
      res.setHeader('Content-Type', 'text/plain')
      return res.status(404).send('Not Found')
    }

    const player = players[0]
    res.status(200).send({ avatar: player.avatarfull })
  } catch (err) {
    console.error(err)

    res.setHeader('Content-Type', 'text/plain')
    res.status(500).send(err.stack)
  }
}

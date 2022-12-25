import type { VercelRequest, VercelResponse } from '@vercel/node'

import 'dotenv/config'
const { TOKEN, HOOK_URL } = process.env

const commands = [{ command: 'check', description: 'Check who is playing.' }]

const handler = async (_req: VercelRequest, res: VercelResponse) => {
  try {
    await fetch(
      `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${HOOK_URL}`
    )
    await fetch(
      `https://api.telegram.org/bot${TOKEN}/setMyCommands?commands=${JSON.stringify(
        commands
      )}`
    )
    res.end('Init successful')
  } catch {
    res.end('Failed to init')
  }
}

export default handler

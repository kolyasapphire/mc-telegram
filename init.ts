import type { VercelRequest, VercelResponse } from '@vercel/node'

const { TOKEN, HOOK_URL } = process.env

const handler = async (_req: VercelRequest, res: VercelResponse) => {
  try {
    await fetch(
      `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${HOOK_URL}`
    )
    res.end('Init successful')
  } catch {
    res.end('Failed to init')
  }
}

export default handler

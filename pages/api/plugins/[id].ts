import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../config/PrismaClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET')
    return res.status(401).json({ message: 'Unauthorized' })

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const { id } = req.query

  const plugin = await prisma.draftPlugin.findFirst({
    where: {
      id: id as string,
    },
  })

  if (!plugin) {
    return res.status(404).json({ message: 'Plugin not found' })
  }
  res.json(plugin)
}

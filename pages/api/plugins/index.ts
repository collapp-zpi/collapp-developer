import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../config/PrismaClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { name, description } = JSON.parse(req.body)

    if (!name)
      return res.status(400).json({ message: 'Plugin name is required' })

    const plugin = await prisma.draftPlugin.create({
      data: {
        name,
        description,
        icon: '',
        author: {
          connect: {
            id: session.userId as string,
          },
        },
      },
    })

    return res.status(200).json(plugin)
  }

  if (req.method !== 'GET')
    return res.status(404).json({ message: 'Method not found' })

  const plugins = await prisma.draftPlugin.findMany({
    where: {
      authorId: session.userId as string,
    },
  })
  res.json(plugins)
}

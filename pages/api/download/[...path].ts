import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse ) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ message: 'Unauthorized access' })

  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path

  const response = await fetch(
    process.env.STORAGE_ROOT + '/' + path,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STORAGE_SECRET}`,
        Accept: 'application/octet-stream'
      }
    }
  );

  res.send(response.body)
}

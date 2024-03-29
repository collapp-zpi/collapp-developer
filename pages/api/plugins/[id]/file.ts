import { NextApiRequest, NextApiResponse } from 'next'
import Formidable, { Fields, File as FFile, Files } from 'formidable'
import { getSession } from 'next-auth/react'
import { prisma } from 'shared/utils/prismaClient'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'Method not found' })
  }
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const { id } = req.query

  if (!id || Array.isArray(id))
    return res.status(400).json({ message: 'Invalid plugin id' })

  const plugin = await prisma.draftPlugin.findFirst({
    where: { id },
    include: { author: true },
  })

  if (!plugin) {
    return res.status(404).json({ message: 'The plugin does not exist' })
  }

  if (plugin.isPending) {
    return res
      .status(400)
      .json({ message: 'Cannot make changes to a pending plugin' })
  }

  if (plugin.authorId !== session.userId) {
    return res
      .status(401)
      .json({ message: 'The plugin has a different author' })
  }

  const file = await prisma.file.findUnique({
    where: { draftId: plugin.id },
    include: { published: true },
  })

  try {
    const parsedFile: FFile = await new Promise((resolve, reject) => {
      const form = new Formidable.IncomingForm()

      form.parse(req, (err: any, fields: Fields, files: Files) => {
        if (err) return reject(err)
        if (!files?.file || Array.isArray(files.file)) return reject()
        resolve(files.file)
      })
    })

    if (!parsedFile?.name)
      return res
        .status(400)
        .json({ message: 'An error ocurred while parsing the file' })

    if (file && !file.published) {
      await prisma.file.delete({
        where: { id: file.id },
      })
    }

    const draftPath = `/drafts/${plugin?.author?.id}/${id}.zip`

    await new Promise((res, rej) => {
      fs.readFile(parsedFile.path, async function (err, data) {
        if (err) throw err

        fetch(process.env.NEXT_PUBLIC_STORAGE_ROOT + draftPath, {
          method: 'PUT',
          headers: {
            'Content-type': '*/*',
            Authorization: `Bearer ${process.env.STORAGE_SECRET}`
          },
          body: data
        }).then(res).catch(rej)
      })
    }).catch((e) => console.log(e))

    fs.unlink(parsedFile.path, (err) => {
      if (err) console.log(err)
    })

    const newFile = await prisma.file.create({
      data: {
        name: parsedFile.name,
        size: parsedFile.size,
        url: draftPath,
        draft: {
          connect: { id: plugin.id },
        },
      },
    })

    return res.status(200).json(newFile)
  } catch (e: any) {
    return res.status(400).json({ message: e?.message })
  }
}

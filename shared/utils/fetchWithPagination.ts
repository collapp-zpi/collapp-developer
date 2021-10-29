//@ts-nocheck
import { prisma } from 'shared/utils/prismaClient'

export async function fetchWithPagination(
  entityName: string,
  _limit?: number,
  _page?: number,
  where?: { [key: string]: any },
) {
  const limit = (_limit && Number(_limit)) || 20
  const page = (_page && Number(_page)) || 1

  console.log('test pag', limit, page)

  const offset = (page - 1) * limit
  const entityCount = await prisma[entityName].count({
    ...(where && { where }),
  })

  const pages = Math.ceil(entityCount / limit)

  return {
    entities: await prisma[entityName].findMany({
      skip: offset,
      take: limit,
      ...(where && { where }),
    }),
    pagination: { pages, page, limit },
  }
}

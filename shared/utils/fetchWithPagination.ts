//@ts-nocheck
import { NotFoundException } from '@storyofams/next-api-decorators'
import { prisma } from 'shared/utils/prismaClient'

export async function fetchWithPagination(
  entityName: string,
  limit: number | undefined,
  page: number | undefined,
  whereQuery: any[],
  outOfRangeMessage: string,
) {
  const andQuery = { AND: whereQuery }

  if (!limit) {
    return {
      entities: await prisma[entityName].findMany({ where: andQuery }),
      pagination: null,
    }
  }

  const currPage = page ? page : 1
  const offset = (currPage - 1) * limit
  const entityCount = await prisma[entityName].count()

  if (offset >= entityCount) {
    throw new NotFoundException(outOfRangeMessage)
  }

  const pages = Math.ceil(entityCount / limit)

  return {
    entities: await prisma[entityName].findMany({
      skip: offset,
      take: limit,
      where: andQuery,
    }),
    pagination: { pages, currPage, limit },
  }
}

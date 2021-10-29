import { prisma } from 'shared/utils/prismaClient'
import {
  createHandler,
  Get,
  NotFoundException,
  Param,
  ParseNumberPipe,
  Query,
  UnauthorizedException,
} from '@storyofams/next-api-decorators'
import { NextAuthGuard, RequestUser, User } from 'shared/utils/apiDecorators'
import { fetchWithPagination } from 'shared/utils/fetchWithPagination'

@NextAuthGuard()
class Published {
  @Get()
  getPublishedList(
    @User user: RequestUser,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
    @Query('name') name?: string,
  ) {
    return fetchWithPagination('publishedPlugin', limit, page, {
      authorId: user.id,
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
    })
  }

  @Get('/:id')
  async getPublished(@Param('id') id: string, @User user: RequestUser) {
    const published = await prisma.publishedPlugin.findFirst({
      where: { id },
      include: {
        source: true,
        draft: true,
      },
    })

    if (!published) {
      throw new NotFoundException('The plugin does not exist.')
    }

    if (published.authorId !== user.id) {
      throw new UnauthorizedException('The plugin has a different author.')
    }

    return published
  }
}

export default createHandler(Published)

import { prisma } from 'shared/utils/prismaClient'
import {
  createHandler,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@storyofams/next-api-decorators'
import { NextAuthGuard, RequestUser, User } from 'shared/utils/apiDecorators'

@NextAuthGuard()
class Published {
  @Get()
  getPublishedList(@User user: RequestUser) {
    return prisma.publishedPlugin.findMany({
      where: {
        authorId: user.id,
      },
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

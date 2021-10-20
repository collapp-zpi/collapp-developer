import { prisma } from 'config/PrismaClient'
import {
  Body,
  createHandler,
  Get,
  Post,
  ValidationPipe,
} from '@storyofams/next-api-decorators'
import { NextAuthGuard, RequestUser, User } from 'config/apiDecorators'
import { IsNotEmpty } from 'class-validator'

export class CreatePluginDTO {
  @IsNotEmpty({ message: 'Plugin name is required.' })
  name!: string

  description!: string
}

@NextAuthGuard()
class Plugins {
  @Get()
  fetchPluginList(@User user: RequestUser) {
    return prisma.draftPlugin.findMany({
      where: {
        authorId: user.id,
      },
    })
  }

  @Post()
  createPlugin(
    @Body(ValidationPipe) body: CreatePluginDTO,
    @User user: RequestUser,
  ) {
    return prisma.draftPlugin.create({
      data: {
        name: body.name,
        description: body.description,
        icon: '',
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    })
  }
}

export default createHandler(Plugins)

import { prisma } from 'shared/utils/prismaClient'
import {
  Body,
  createHandler,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from '@storyofams/next-api-decorators'
import { NextAuthGuard, RequestUser, User } from 'shared/utils/apiDecorators'
import { IsNotEmpty } from 'class-validator'

export class CreatePluginDTO {
  @IsNotEmpty({ message: 'Plugin name is required.' })
  name!: string

  description!: string
}

export class UpdatePluginDTO {
  @IsNotEmpty({ message: 'Plugin name is required.' })
  name?: string
  description?: string
}

@NextAuthGuard()
class Plugins {
  @Get()
  getPluginList(@User user: RequestUser) {
    return prisma.draftPlugin.findMany({
      where: {
        authorId: user.id,
      },
    })
  }

  async innerGetPlugin(id: string, user: RequestUser) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin does not exist.')
    }

    if (plugin.authorId !== user.id) {
      throw new UnauthorizedException('The plugin has a different author.')
    }

    return plugin
  }

  @Get('/:id')
  getPlugin(@Param('id') id: string, @User user: RequestUser) {
    return this.innerGetPlugin(id, user)
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

  @Patch('/:id')
  async updatePlugin(
    @Param('id') id: string,
    @Body(ValidationPipe) body: UpdatePluginDTO,
    @User user: RequestUser,
  ) {
    await this.innerGetPlugin(id, user)

    return await prisma.draftPlugin.update({
      where: { id },
      data: { ...body },
    })
  }

  @Delete('/:id')
  async deletePlugin(@Param('id') id: string, @User user: RequestUser) {
    await this.innerGetPlugin(id, user)

    return await prisma.draftPlugin.delete({
      where: { id },
    })
  }
}

export default createHandler(Plugins)

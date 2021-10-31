import { prisma } from 'shared/utils/prismaClient'
import {
  BadRequestException,
  Body,
  createHandler,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseNumberPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  ValidationPipe,
} from '@storyofams/next-api-decorators'
import { NextAuthGuard, RequestUser, User } from 'shared/utils/apiDecorators'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  NotEquals,
} from 'class-validator'
import { fetchWithPagination } from 'shared/utils/fetchWithPagination'
import AWS from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'

export class CreatePluginDTO {
  @IsNotEmpty({ message: 'Plugin name is required.' })
  name!: string
  description!: string
}

export class UpdatePluginDTO {
  @IsOptional()
  @NotEquals('', { message: 'Plugin name is required.' })
  name?: string
  @IsOptional()
  description?: string
  @IsOptional()
  icon?: string

  @IsOptional()
  @Min(1)
  @Max(4)
  @IsInt()
  minWidth?: number

  @IsOptional()
  @Min(1)
  @Max(4)
  @IsInt()
  minHeight?: number

  @IsOptional()
  @Min(1)
  @Max(4)
  @IsInt()
  maxWidth?: number

  @IsOptional()
  @Min(1)
  @Max(4)
  @IsInt()
  maxHeight?: number
}

@NextAuthGuard()
class Plugins {
  @Get()
  getPluginList(
    @User user: RequestUser,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
    @Query('name') name?: string,
  ) {
    return fetchWithPagination('draftPlugin', limit, page, {
      authorId: user.id,
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
    })
  }

  async innerGetPlugin(id: string, user: RequestUser) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
      include: { source: true },
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
  async getPlugin(@Param('id') id: string, @User user: RequestUser) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
      include: {
        source: true,
        published: true,
      },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin does not exist.')
    }

    if (plugin.authorId !== user.id) {
      throw new UnauthorizedException('The plugin has a different author.')
    }

    return plugin
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
    const plugin = await this.innerGetPlugin(id, user)

    if (plugin.isPending) {
      throw new BadRequestException(`Cannot make changes to a pending plugin.`)
    }

    if (body?.minWidth && body?.maxWidth && body.minWidth > body.maxWidth) {
      throw new BadRequestException(
        `Min. width can't be larger than max. width.`,
      )
    }

    if (body?.minHeight && body?.maxHeight && body.minHeight > body.maxHeight) {
      throw new BadRequestException(
        `Min. height can't be larger than max. height.`,
      )
    }

    return await prisma.draftPlugin.update({
      where: { id },
      data: { ...body },
    })
  }

  @Delete('/:id')
  async deletePlugin(@Param('id') id: string, @User user: RequestUser) {
    const plugin = await this.innerGetPlugin(id, user)

    if (plugin.isPending) {
      throw new BadRequestException(`Cannot make changes to a pending plugin.`)
    }

    if (!!plugin.source) {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      })

      const params: PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET,
        Key: plugin.source.url,
        //region: 'us-east-1',
      }

      s3.deleteObject(params, (err) => {
        if (err) console.log(err)
      })

      await prisma.file.delete({
        where: { id: plugin.source.id },
      })
    }

    return await prisma.draftPlugin.delete({
      where: { id },
    })
  }

  @Post('/:id/submit')
  async submitPlugin(@Param('id') id: string, @User user: RequestUser) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
      include: {
        source: true,
      },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin does not exist.')
    }

    if (plugin.isPending) {
      throw new BadRequestException(`Cannot make changes to a pending plugin.`)
    }

    if (plugin.authorId !== user.id) {
      throw new UnauthorizedException('The plugin has a different author.')
    }

    if (!plugin.source) {
      throw new BadRequestException(`Plugin must have the source code.`)
    }

    if (plugin.minWidth > plugin.maxWidth) {
      throw new BadRequestException(
        `Min. width can't be larger than max. width.`,
      )
    }

    if (plugin.minHeight > plugin.maxHeight) {
      throw new BadRequestException(
        `Min. height can't be larger than max. height.`,
      )
    }

    return await prisma.draftPlugin.update({
      where: { id },
      data: {
        isPending: true,
      },
    })
  }
}

export default createHandler(Plugins)

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { IsNotEmpty } from 'class-validator';
import { InjectModel } from 'nestjs-typegoose';
import { Post as PostSchema } from './post.model';

class PostDto {
  @ApiProperty({ description: '贴子标题', example: '标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  public title: string
  
  @ApiProperty({ description: '帖子内容', example: '内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  public content: string

}



@ApiTags('帖子')
@Controller('posts')
export class PostsController {
  constructor (
    @InjectModel(PostSchema) private readonly postModel: ReturnModelType<typeof PostSchema> 
  ) {}

  @ApiOperation({ summary: '获取所有帖子信息' })
  @Get()
  async index () {
    const res = await this.postModel.find()
    return res
  }

  @ApiOperation({ summary: '获取帖子详情' })
  @Get(':id')
  async detail (@Param('id') id: string) {
    const res = await this.postModel.findById(id)
    return res ? res: {}
  }

  @ApiOperation({ summary: '创建帖子' })
  @Post()
  async create (@Body() dto: PostDto) {
    const res = await this.postModel.create(dto)
    return res._id ? { success: true } : { success: false }
  }

  @ApiOperation({ summary: '更新帖子' })
  @Put(':id')
  async update (@Param('id') id:string, @Body() dto: PostDto) {
    const res = await this.postModel.findByIdAndUpdate(id, dto)
    return res._id? { success: true } : { success: false }
  }

  @ApiOperation({ summary: '删除帖子' })
  @Delete(':id')
  async remove (@Param('id') id: string) {
    const res = await this.postModel.findByIdAndDelete(id)
    return res._id? { success: true } : { success: false }
  }

}

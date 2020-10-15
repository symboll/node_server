import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { ReturnModelType } from '@typegoose/typegoose';
import { IsNotEmpty } from 'class-validator'
import { InjectModel } from 'nestjs-typegoose';
import { Post as PostSchema } from './post.model'

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
  constructor(
    @InjectModel(PostSchema) private readonly postModel: ReturnModelType<typeof PostSchema> 
  ) {}

  @Get()
  @ApiOperation({ summary: '获取所有帖子信息' })
  async index(){
    return await this.postModel.find()
  }
 
  @Get(':id')
  @ApiOperation({ summary: '获取帖子详情' })
  async detail (@Param('id') id: string) {
    return this.postModel.findById(id)
  }

  @Post() 
  @ApiOperation({ summary: '创建帖子' })
  async create(@Body() dto:PostDto) {
    const r = await this.postModel.create(dto)
    if(r) return { success: true }
  }


  @Put(':id')
  @ApiOperation({ summary: '修改帖子' })
  async update (@Param('id') id: string, @Body() dto: PostDto) {
    return await this.postModel.findByIdAndUpdate(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除帖子' })
  async remove (@Param('id') id: string) {
    const r = await this.postModel.findByIdAndDelete(id)
    if(r) return { success: true }
  }
}

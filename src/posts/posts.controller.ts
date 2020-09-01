import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { PostModel } from './post.model';

class PostsDto{
  @ApiProperty({ description: '贴子标题' })
  title: string

  @ApiProperty({ description: '贴子内容' })
  content: string
}

class ResultModel {
  data: any;
  status: number;
  message: string;
}

@Controller('posts')
@ApiTags('帖子')
export class PostsController {
  @Get()
  @ApiOperation({ summary: '获取所有帖子信息' })
  async index(): Promise<ResultModel> {
    try {
      const data = await PostModel.find()
      return { data, status: 200, message: 'success' }
    }catch (e) {
      return { data: e, status: 400, message: 'fail' }
    }
  
  }

  @Get(':id')
  @ApiOperation({ summary: '获取某个帖子信息' })
  async detail (@Param('id') id: string): Promise<ResultModel> {
    try {
      const data = await PostModel.findById(id)
      return { data, status: 200, message: 'success' }
    }catch (e) {
      return { data: e, status: 400, message: 'fail' }
    }
  }

  @Post()
  @ApiOperation({ summary: '创建帖子' })
  async create(@Body() createPostDto: PostsDto): Promise<ResultModel> {
    try {
      const data = await PostModel.create(createPostDto)
      return { data, status: 200, message: 'success' }
    }catch (e) {
      return { data: e, status: 400, message: 'fail' }
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新贴子' })
  async update(@Param('id') id: string, @Body() updatePostDto: PostsDto): Promise<ResultModel> {
    try {
      await PostModel.findByIdAndUpdate(id,updatePostDto)
      return { data: null , status: 200, message: 'success' }
    }catch (e) {
      return { data: e, status: 400, message: 'fail' }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除贴子' })
  async remove(@Param('id') id: string):Promise<ResultModel> {
    try {
      await PostModel.findByIdAndDelete(id)
      return { data: null, status: 200, message: 'success' }
    }catch (e) {
      return { data: e, status: 400, message: 'fail' }
    }
  }
}

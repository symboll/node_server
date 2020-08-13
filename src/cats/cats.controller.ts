import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {

  @Get()
  index (): string {
    return 'get'
  }

  @Post()
  dess () :string {
    return 'post '
  }
}

import { Controller } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.model';
import { Crud } from 'nestjs-mongoose-crud';


@Crud({
  model: User,
  routes: {
    find: {
      decorators: [
        ApiOperation({ summary: '获取用户列表' })
      ]
    }
  }
})
@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User) private readonly model: ReturnModelType<typeof User>
  ) {}
}
 
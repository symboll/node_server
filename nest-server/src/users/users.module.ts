import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersController } from './users.controller';
import { User } from './user.model';

@Module({
  imports: [
    TypegooseModule.forFeature([User])
  ],
  controllers: [UsersController]
})
export class UsersModule {}

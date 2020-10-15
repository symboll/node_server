import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypegooseModule } from 'nestjs-typegoose'
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://127.0.0.1:27017/melon',{
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    PostsModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

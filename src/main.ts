import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose'

async function bootstrap() {
  mongoose.connect('mongodb://127.0.0.1:27017/melon', {
    useNewUrlParser: true,
    useFindAndModify:false,
    useCreateIndex: true
  })
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Posts example')
    .setDescription('The posts API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();

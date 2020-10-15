import { ApiProperty } from '@nestjs/swagger'
import {  prop } from '@typegoose/typegoose'

export class User {
  @prop()
  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  name: string

  @ApiProperty({ description: '年龄', example: 20 })
  @prop()
  age: number

  @ApiProperty({ description: '性别', example: 'male' })
  @prop()
  sex: string
}

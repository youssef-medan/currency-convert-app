import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from './User.schema';
@Schema()
export class Transaction {
  @ApiProperty({
    description: 'currency to convert from',
    example: 'USD',
    required: true,
  })
  @Prop({ required: true })
  from: string;
  @ApiProperty({
    description: 'currency converted to',
    example: 'EGP',
    required: true,
  })
  @Prop({ required: true })
  to: string;
  @ApiProperty({
    description: 'amout to use',
    example: '1',
    required: true,
  })
  @Prop({ required: true })
  amount: number;
  @ApiProperty({
    description: 'result value',
    example: 48.40800405,
    required: true,
  })
  @Prop({ required: true })
  value: number;
  @ApiProperty({
    description: 'this values generated at this date',
    example: '2024-07-22',
    required: true,
  })
  @Prop({ required: true })
  date: Date;
  @ApiProperty({
    description: 'this covert created by',
    example: '66a44906a70533db9952533e',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
export const TransactionSchema =
  SchemaFactory.createForClass(Transaction);

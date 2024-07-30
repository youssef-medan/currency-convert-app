import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
@Schema()
export class User {
  @ApiProperty({
    description: 'Enter Your Email',
    example: 'user@example.com',
    required: true,
  })
  @Prop({ required: true, unique: true })
  email: string;
  
  @ApiProperty({
    description: 'Enter Password',
    example: 'pass12345678',
    required: true,
  })
  @Prop({ required: true, select: false })
  password: string;
  @Prop()
  salt: string;
  @Prop()
  passwordResetToken: string;
  @Prop()
  passwordResetExpires: Date;

  hashPassword:Function
  validatePassword: Function;
  createPasswordResetToken: Function;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.hashPassword = async function (password: string, salt: string) {
  return bcrypt.hash(password, salt);
};
UserSchema.methods.validatePassword = async function (password: string) {
  const hash = await bcrypt.hash(password, this.salt);
  return hash === this.password;
};

UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await this.save();
  return resetToken;
};

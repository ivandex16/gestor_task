import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
  })
  fullname: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  update_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

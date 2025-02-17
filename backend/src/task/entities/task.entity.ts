import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

export enum TaskStatus {
  Pendiente = 'Pendiente',
  En_pregreso = 'En progreso',
  Completado = 'Completado',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({
    unique: true,
    required: true,
    index: true,
  })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.Pendiente,
  })
  status: TaskStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user_id: mongoose.Types.ObjectId;

  @Prop({
    type: [String], // Array de strings
    default: [], // Valor por defecto: array vacío
    index: true, // Índice para búsquedas
  })
  tags: string[];

  // @Prop()
  // created_at: Date;

  // @Prop()
  // update_at: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

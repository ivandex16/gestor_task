import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  user_id: string;

  created_at: Date;

  updated_at: Date;
}

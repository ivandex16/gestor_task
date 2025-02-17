import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsEnum, IsDate, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { Type } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsString()
  id?: string;
  // @IsOptional()
  // @IsString()
  // title?: string ;
  // @IsOptional()
  // @IsDate()
  // @Type(() => Date)
  // description?: string | undefined;
  // @IsOptional()
  // @IsEnum(TaskStatus)
  // status?: TaskStatus;
}

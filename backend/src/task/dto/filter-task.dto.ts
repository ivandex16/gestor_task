import { IsOptional, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class FilterTaskDto  extends PartialType(CreateTaskDto) {
   
    @IsOptional()
    @IsString()
    search?: string 
}
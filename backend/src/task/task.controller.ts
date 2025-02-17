import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from 'src/auth/decorator';
import { IncomingHttpHeaders } from 'http';
import { User } from 'src/auth/entities/user.entity';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
    // @RawHeaders() rawHeaders: string[],
    // @Headers() headers:IncomingHttpHeaders
  ) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(user: string) {
    return this.tasksService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Get()
  filter(@Query('search') search: FilterTaskDto) {
    return this.tasksService.filter(search);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}

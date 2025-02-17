import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import { FilterTaskDto } from './dto/filter-task.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task | undefined> {
    try {
      const createdTask = await this.taskModel.create({
        ...createTaskDto,
        user_id: user.id,
      });
      return createdTask;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Task already exists with ${JSON.stringify(error.keyValue)}`,
        );
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      console.log(error);
      throw new InternalServerErrorException(` Error while creating task`);
    }
  }

  async findAll(user: string): Promise<Task[]> {
    return this.taskModel.find({ user_id: user }).exec();
  }

  async findOne(id: string): Promise<Task | undefined> {
    let task: Task | undefined;
    console.log('aid', id);
    if (isValidObjectId(id)) {
      const foundTask = await this.taskModel.findById(id).exec();
      task = foundTask ? foundTask : undefined;
    }

    if (!task) throw new NotFoundException(`Task with id ${id} not found`);

    return task;
  }

  async filter(filterTaskDto: FilterTaskDto): Promise<Task[] | undefined> {
    console.log('filter service', filterTaskDto);
    try {
      const { search } = filterTaskDto;
      const filter: any = {};

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
        ];
      }

      const filterTask = await this.taskModel.find(filter).exec();
      return filterTask;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const findTask = await this.findOne(id);
    return await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleteTask = await this.taskModel.findByIdAndDelete(id).exec();
    console.log('deleSer', deleteTask);
    if (!deleteTask) {
      throw new BadRequestException(`Task with id "${id}" not found`);
    }
    return {
      message: `Tarea "${deleteTask.title}" se ha eliminado`,
    };
  }
}

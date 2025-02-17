import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskGateway } from './task.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { TaskController } from './task.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [TaskGateway, TaskService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    AuthModule
  ],
  controllers: [TaskController],
})
export class TaskModule {}

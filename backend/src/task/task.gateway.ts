import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Socket, Server } from 'socket.io';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { FilterTaskDto } from './dto/filter-task.dto';

@WebSocketGateway({ namespace: '/tasks', cors: true })
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('TaskGateway');

  constructor(
    private readonly taskService: TaskService,
    private readonly jwtService: JwtService, //
  ) {}
  afterInit(server: any) {
    this.logger.log('✅ WebSocket iniciado');
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`📡 Nueva conexión: ${client.id}`);
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new UnauthorizedException('Token no proporcionado');

      const payload = this.jwtService.verify(token);

      client.data.user = payload; // Almacena el usuario en el cliente
      client.join(payload.id); // Unir a sala por user ID
      client.emit('saludo', payload.fullname);
      this.logger.log('user hi', payload);
      this.logger.log(`Cliente conectado: ${payload.email}`);
    } catch (error) {
      this.logger.error(`Conexión rechazada: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('createTask')
  async create(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() createTaskDto: CreateTaskDto,
  ) {
    try {
      const user = client.data.user;
      if (!user) throw new UnauthorizedException('Usuario no autenticado');

      const task = await this.taskService.create(createTaskDto, user);
      client.emit('taskCreated', {
        task,
        message: 'Tarea agregada 📦',
        success: true,
      });

      const allTasks = await this.taskService.findAll(user.id);
      this.server.emit('taskListed', allTasks); // <- Emitir a todos

      return {
        status: 'success',
        task,
        message: 'Tarea agregada',
        success: true,
      };
    } catch (error) {
      client.emit('addTaskError', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  //@UseGuards(AuthGuard())
  @SubscribeMessage('findAllTask')
  async findAll(client: Socket) {
    try {
      const user = client.data.user;
      const tasks = await this.taskService.findAll(user.id);
      client.emit('taskListed', tasks); // Respuesta solo al cliente que preguntó
      return { success: true, event: 'taskListed', data: tasks };
    } catch (error) {
      client.emit('errorFindAllTask', { message: error });
      return { status: 'error', message: error.message, success: false };
    }
  }

  @SubscribeMessage('findOneTask')
  async findOne(@ConnectedSocket() client: Socket, @MessageBody() id: any) {
    try {
      const task = await this.taskService.findOne(id._id);
      if (client.connected) {
        client.emit('oneTaskListed', task);
      } else {
        client.emit('oneTaskListed', { message: 'CLiente desconectado' });
      }

      return { event: 'oneTaskListed', task };
    } catch (error) {
      this.logger.log('error to find', error);
      client.emit('errorFindOneTask', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('updateTask')
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const user = client.data.user;

      const id = updateTaskDto.id || '';
      const task = await this.taskService.update(id, updateTaskDto);
      this.logger.log('updatedData', task);

      const allTasks = await this.taskService.findAll(user.id);
      this.server.emit('taskListed', allTasks);

      client.emit('taskUpdated', {
        task,
        message: `Tarea: "${task?.title}" actualizada correctamente.`,
        success: true,
      });

      return {
        event: 'taskUpdated',
        task,
        message: `Tarea "${task?.title}" actualizada correctamente.`,
        success: true,
      };
    } catch (error) {
      client.emit('updatedTaskError', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('removeTask')
  async remove(@ConnectedSocket() client: Socket, @MessageBody() param: any) {
    try {
      const user = client.data.user;
      const id = param?.idTask || '';
      const task = await this.taskService.remove(id);

      this.logger.log('task deleted', task);
      client.emit('taskRemoved', {
        message: task.message,
        success: true,
      });

      const allTasks = await this.taskService.findAll(user.id);
      this.server.emit('taskListed', allTasks);

      return {
        event: 'taskRemoved',
        task,
        success: true,
        messagge: task.message,
      };
    } catch (error) {
      this.logger.log(`error delete :${error}`);
      client.emit('deleteTaskError', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('filterTask')
  async filter(
    @ConnectedSocket() client: Socket,
    @MessageBody() filterTaskDto: FilterTaskDto,
  ) {
    try {
      const task = await this.taskService.filter(filterTaskDto);

      if (client.connected) {
        client.emit('filtered', {
          task,
          success: true,
          message: 'resultados encontrados',
        });
      } else {
        client.emit('error_connect', { message: 'CLiente desconectado' });
      }

      return {
        event: 'filtered',
        task,
        success: true,
        message: 'resultados encontrados',
      };
    } catch (error) {
      this.logger.log('error to filtered', error);
      client.emit('errorfilteredTask', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }
}

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@WebSocketGateway()
export class AuthGateway {
  constructor(private readonly authService: AuthService) {}

  @SubscribeMessage('createAuth')
  create(@MessageBody() CreateUserDto: CreateUserDto) {
    return this.authService.create(CreateUserDto);
  }

  // @SubscribeMessage('login')
  // login(@MessageBody() loginUIser) {
  //   return this.authService.login();
  // }

  @SubscribeMessage('findOneAuth')
  findOne(@MessageBody() id: number) {
    return this.authService.findOne(id);
  }

  // @SubscribeMessage('updateAuth')
  // update(@MessageBody() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(updateAuthDto.id, updateAuthDto);
  // }

  @SubscribeMessage('removeAuth')
  remove(@MessageBody() id: number) {
    return this.authService.remove(id);
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-auth.dto';
import { omit } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayLoad, UserWithToken } from './interface';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interface/user-with-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithToken> {
    try {
      const { password, ...userData } = createUserDto;
      const createUser = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      const userObject = createUser.toObject() as Omit<IUser, 'password'>;
      const sanitizedUser = omit(userObject, ['__v', '$locals', '$op']);

      return {
        user: { ...userObject },
        token: this.getJwtToken({
          email: userObject.email,
          id: userObject._id?.toString() || '',
          fullname: userObject.fullname,
        }),
      };

      //todo: retornar jwt acceso
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `El usuario ya existe con ${JSON.stringify(error.keyValue)}`,
        );
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error.message}`,
      );
    }
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('email password _id fullname');

      if (!user)
        throw new UnauthorizedException(`Credentials are not valid (email)`);

      if (!user.password || !bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException(`Credentials are not valid (password)`);

      const userDoc = user.toObject();
      const user_ = omit(userDoc, 'password');
      return {
        ...user_,
        token: this.getJwtToken({
          email: user.email,
          id: user_._id?.toString() || '',
          fullname: user.fullname,
        }),
      };
    } catch (error) {
      console.log('login', error);
      throw new InternalServerErrorException(` ${error.message}`);
    }

    //TODO: retornar jwt
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

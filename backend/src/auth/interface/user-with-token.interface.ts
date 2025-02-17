import mongoose from 'mongoose';
import { User } from '../entities/user.entity';
import { JwtPayLoad } from './jwt-payload.interface';

export interface IUser {
  email: string;
  fullname: string;
  password?: string;
  isActive: boolean;
  created_at: Date;
  update_at: Date;
  _id?: mongoose.Types.ObjectId;
}
export interface UserWithToken {
  user: IUser;
  token: string;
}

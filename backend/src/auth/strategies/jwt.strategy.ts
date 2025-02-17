import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayLoad } from '../interface/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: JwtPayLoad): Promise<User> {
    const { email } = payload;
    const user = await this.userModel.findOne({ email }).select('-password');

    if (!user) throw new UnauthorizedException('Token not Valid');

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with de admin');

    return user;
  }
}

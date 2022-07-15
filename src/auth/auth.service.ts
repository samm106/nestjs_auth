import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeOrm/User';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const newUser = this.userRepository.create({
        email: dto.email,
        password: hash,
      });
      const details = await this.userRepository.save(newUser);
      return { email: details.email, msg: 'succefully signed up' };
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const error = err.driverError;
        if ((error.code = '23505')) {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw err;
    }
  }
  async signin(dto: AuthDto) {
    const email = dto.email;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string; msg: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = process.env.JWT_SECRET;
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      accessToken: token,
      msg: 'succefully logged in',
    };
  }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/typeOrm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [TypeOrmModule.forFeature(entities), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

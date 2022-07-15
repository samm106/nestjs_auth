import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeOrm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: entities,
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}

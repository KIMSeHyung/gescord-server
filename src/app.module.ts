import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ChatModule } from './chat/chat.module';
import { VoiceModule } from './voice/voice.module';
import { REDIS_PUB_SUB } from './common/constants';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import Redis from 'ioredis';
import { Context } from 'apollo-server-core';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false,
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    MongooseModule.forRoot(process.env.MONGO_HOST),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (ctx: Context<any>) => {
            ctx.conn = ctx.Cookies;
            return ctx;
          },
        },
      },
      context: ({ req, conn }) => {
        return req ? req : conn;
      },
    }),
    UserModule,
    AuthModule,
    ChannelModule,
    ChatModule,
    VoiceModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: REDIS_PUB_SUB,
      useFactory: () => {
        const options = {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        };
        const pubsub = new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
        return pubsub;
      },
    },
  ],
  exports: [REDIS_PUB_SUB],
})
export class AppModule {}
